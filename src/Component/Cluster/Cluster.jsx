import React, { useState, useEffect, useRef } from "react"
import "primeflex/primeflex.css"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { InputText } from "primereact/inputtext"
import { Toast } from "primereact/toast"

export default function Cluster() {
	const [clusters, setListCluster] = useState([])
	const [visible, setVisible] = useState(false)

	const [title, setTitle] = useState("")
	const [image, setImage] = useState("")
	const [id, setId] = useState("")

	const toast = useRef(null)

	const fetchData = async () => {
		const url = `${process.env.REACT_APP_API_URL}/cluster/getAllCluster`
		try {
			const response = await fetch(url)
			const results = await response.json()
			setListCluster(results)
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
		setImage("")
	}

	const handleHideForm = () => {
		clearForm()
		setVisible(false)
	}

	const handleAddCluster = () => {
		setId("")
		clearForm()
		setVisible(true)
	}

	const handleEditClick = async (rowData) => {
		clearForm()
		setId(rowData.id)
		const rowId = rowData.id
		const url = `${process.env.REACT_APP_API_URL}/cluster/getClusterById?id=${rowId}`

		const response = await fetch(url)
		const results = await response.json()
		console.log(results)
		setTitle(results.title || "")
		setImage(results.image || "")
		setVisible(true)
	}

	const handleDeleteClick = async (rowData) => {
		const url = `${process.env.REACT_APP_API_URL}/cluster/deleteCluster?id=${rowData.id}`

		const response = await fetch(url, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		})
		const result = await response.json()
		if (result) {
			toast.current.show({ severity: "info", summary: "Info", detail: "Cluster is deleted" })
			fetchData()
		}
	}

	const handleSaveCluster = async () => {
		if (!id) {
			const url = `${process.env.REACT_APP_API_URL}/cluster/createCluster`
			const cluster = {
				title: title,
				image: image,
			}

			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(cluster),
			})
			const result = await response.json()
			if (result) {
				handleHideForm()
				toast.current.show({ severity: "success", summary: "Info", detail: "Cluster is created" })
			}
		} else {
			const url = `${process.env.REACT_APP_API_URL}/cluster/updateCluster?id=${id}`
			const cluster = {
				title: title,
				image: image,
			}

			const response = await fetch(url, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(cluster),
			})
			const result = await response.json()
			if (result) {
				handleHideForm()
				toast.current.show({ severity: "success", summary: "Info", detail: "Cluster is updated" })
			}
		}
		fetchData()
	}

	// Templates
	const actionsBodyTemplate = (rowData) => {
		return (
			<>
				<Button severity="info" text onClick={() => handleEditClick(rowData)}>
					<i className="pi pi-pencil" />
				</Button>
				<Button severity="danger" text onClick={() => handleDeleteClick(rowData)}>
					<i className="pi pi-trash" />
				</Button>
			</>
		)
	}

	return (
		<>
			<Toast ref={toast} />
			<Button className="mt-2" label="Thêm mới" onClick={() => handleAddCluster()}></Button>
			<DataTable className="mt-2" value={clusters} tableStyle={{ minWidth: "50rem" }} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]}>
				<Column field="title" header="Tiêu đề"></Column>
				<Column field="image" header="Hình ảnh"></Column>
				<Column field="" header="Thao tác" body={actionsBodyTemplate}></Column>
			</DataTable>

			<Dialog header="Thêm cụm điểm" visible={visible} onHide={() => handleHideForm()} style={{ minWidth: "30vw" }}>
				<div className="mb-4 flex gap-2 justify-content-between flex-wrap">
					<div className="flex flex-column gap-2">
						<label htmlFor="title">Tiêu đề</label>
						<InputText id="title" aria-describedby="title-help" value={title} onChange={(e) => setTitle(e.target.value)} />
					</div>
					<div className="flex flex-column gap-2">
						<label htmlFor="image">Hình ảnh</label>
						<InputText id="image" className="w-full" aria-describedby="image-help" value={image} onChange={(e) => setImage(e.target.value)} />
					</div>
				</div>

				<div className="mt-5 flex justify-content-evenly flex-wrap">
					<Button label="Lưu lại" severity="success" onClick={handleSaveCluster}></Button>
					<Button className="ml-1" label="Hủy" severity="danger" onClick={() => handleHideForm()}></Button>
				</div>
			</Dialog>
		</>
	)
}
