import React, { useState, useEffect, useRef } from "react"
import "primeflex/primeflex.css"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import Button from "react-bootstrap/Button";
import { Dialog } from "primereact/dialog"
import { InputText } from "primereact/inputtext"
import { Dropdown } from "primereact/dropdown"
import { Toast } from "primereact/toast"

export default function Category() {
	const [products, setProducts] = useState([])
	const [visible, setVisible] = useState(false)

	const [title, setTitle] = useState("")
	const [selected, setSelected] = useState("")
	const [image, setImage] = useState("")
	const [id, setId] = useState("")

	const toast = useRef(null)

	const selections = [
		{ name: "Có", code: "true" },
		{ name: "Không", code: "false" },
	]

	const fetchData = async () => {
		const url = `${process.env.REACT_APP_API_URL}/category/getAllCategory`
		try {
			const response = await fetch(url)
			const results = await response.json()
			setProducts(results)
		} catch (error) {
			console.log("error", error)
		}
	}

	useEffect(() => {
		fetchData()
	}, [])

	// Functions
	const clearForm = () => {
		setTitle("")
		setSelected("")
		setImage("")
	}

	const handleHideForm = () => {
		clearForm()
		setVisible(false)
	}

	const handleAddCategory = () => {
		setId("")
		clearForm()
		setVisible(true)
	}

	const handleSelectedChange = (e) => {
		setSelected(e.value)
	}

	const handleEditClick = async (rowData) => {
		clearForm()
		setId(rowData.id)
		const rowId = rowData.id
		const url = `${process.env.REACT_APP_API_URL}/category/getCategoryById?id=${rowId}`

		const response = await fetch(url)
		const results = await response.json()
		setTitle(results.title || "")
		setSelected(results.is_select || "")
		setImage(results.image || "")
		setVisible(true)
	}

	const handleDeleteClick = async (rowData) => {
		const url = `${process.env.REACT_APP_API_URL}/category/deleteCategory?id=${rowData.id}`
		const token = sessionStorage.getItem('access_token');

		const response = await fetch(url, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				'Authorization': `Bearer ${token}` 
			},
		})
		const result = await response.json()
		if (result) {
			toast.current.show({ severity: "info", summary: "Info", detail: "Category is deleted" })
			fetchData()
		}
	}

	const handleSaveCategory = async () => {
		const token = sessionStorage.getItem('access_token');

		if (!id) {
			const url = `${process.env.REACT_APP_API_URL}/category/createCategory`
			const category = {
				title: title,
				is_select: selected.code,
				image: image,
			}

			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					'Authorization': `Bearer ${token}` 
					
				},
				body: JSON.stringify(category),
			})
			const result = await response.json()
			console.log(result);
			
			if (result) {
				handleHideForm()
				toast.current.show({ severity: "success", summary: "Info", detail: "Category is created" })
			}
		} else {
			const url = `${process.env.REACT_APP_API_URL}/category/updateCategory?id=${id}`
			const category = {
				title: title,
				is_select: selected.code,
				image: image,
			}

			const response = await fetch(url, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					'Authorization': `Bearer ${token}` 
				},
				body: JSON.stringify(category),
			})
			const result = await response.json()
			if (result) {
				handleHideForm()
				toast.current.show({ severity: "success", summary: "Info", detail: "Category is updated" })
			}
		}
		fetchData()
	}

	// Templates
	const actionsBodyTemplate = (rowData) => {
		return (
			<>
				<Button 
				className="m-2"
				variant="secondary"
				severity="info" text onClick={() => handleEditClick(rowData)}>
					<i className="pi pi-pencil" />
				</Button>
				<Button 
				className="m-2"
				variant="warning"
				severity="danger" text onClick={() => handleDeleteClick(rowData)}>
					<i className="pi pi-trash" />
				</Button>
			</>
		)
	}

	return (
		<div  className="container-fluid">
			<Toast ref={toast} />
			<div className="d-flex justify-content-end">
				<Button
				className="mt-2 "
				onClick={() => handleAddCategory()}
				>
				Thêm mới
				</Button>
			</div>
			{/* <Button className="mt-2" label="Thêm mới" onClick={() => handleAddCategory()}></Button> */}
			<DataTable className="mt-2" value={products} tableStyle={{ minWidth: "50rem" }} paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]}>
				<Column field="title" header="Tiêu đề"></Column>
				<Column field="image" header="Hình ảnh"></Column>
				<Column field="is_select" header="Chọn"></Column>
				<Column field="" header="Thao tác" body={actionsBodyTemplate}></Column>
			</DataTable>

			<Dialog header="Thêm danh mục" visible={visible} onHide={() => handleHideForm()} style={{ minWidth: "30vw" }}>
				<div className="mb-4 flex gap-2 justify-content-between flex-wrap">
					<div className="flex flex-column gap-2">
						<label htmlFor="title">Tiêu đề</label>
						<InputText id="title" aria-describedby="title-help" value={title} onChange={(e) => setTitle(e.target.value)} />
					</div>
					<div className="flex flex-column gap-2">
						<label htmlFor="selected">Chọn</label>
						<Dropdown
							id="selected"
							value={selected}
							onChange={(e) => handleSelectedChange(e)}
							options={selections}
							optionLabel="name"
							placeholder="Chọn một lựa chọn"
							editable
							className="w-full md:w-14rem"
						/>
					</div>
				</div>
				<div className="mb-4 flex flex-column gap-2 justify-content-between">
					<label htmlFor="image">Hình ảnh</label>
					<InputText id="image" className="w-full" aria-describedby="image-help" value={image} onChange={(e) => setImage(e.target.value)} />
				</div>

				<div className="mt-5 flex justify-content-evenly flex-wrap">
					<Button onClick={handleSaveCategory}>Lưu lại</Button>
					<Button variant="warning" onClick={() => handleHideForm()}>Hủy</Button>
				</div>
			</Dialog>
		</div>
	)
}
