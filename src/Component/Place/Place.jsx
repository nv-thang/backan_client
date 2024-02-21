import React, { useState, useEffect, useRef } from "react"
import "leaflet/dist/leaflet.css"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { InputText } from "primereact/inputtext"
import { InputTextarea } from "primereact/inputtextarea"
import { Dropdown } from "primereact/dropdown"
import { FileUpload } from "primereact/fileupload"
import { ProgressBar } from "primereact/progressbar"
import { Tooltip } from "primereact/tooltip"
import { Tag } from "primereact/tag"
import { Toast } from "primereact/toast"

export default function Place() {
	const [places, setListPlace] = useState([])
	const [visible, setVisible] = useState(false)

	const [place_name, setPlaceName] = useState("")
	const [address, setAddress] = useState("")
	const [time, setTime] = useState("")
	const [season, setSeason] = useState("")
	const [description, setDescription] = useState("")
	const [longitude, setLongitude] = useState(0)
	const [latitude, setLatitude] = useState(0)
	const [id_cluster, setIdCluster] = useState(0)
	const [id_category, setIdCategory] = useState({ id: "New York", title: "new york" })
	const [id, setId] = useState("")

	const [listCluster, setListCluster] = useState([])
	const [listCategory, setListCategory] = useState([])

	const [totalSize, setTotalSize] = useState(0)

	const toast = useRef(null)
	const fileUploadRef = useRef(null)

	const fetchData = async () => {
		const url = `${process.env.REACT_APP_API_URL}/place/getAllPlace`

		try {
			const response = await fetch(url)
			const results = await response.json()
			setListPlace(results)
		} catch (error) {
			console.log("error", error)
		}

		const urlGetAllCluster = `${process.env.REACT_APP_API_URL}/cluster/getAllCluster`
		try {
			const responseCluster = await fetch(urlGetAllCluster)
			const resultsCluster = await responseCluster.json()
			setListCluster(resultsCluster)
		} catch (error) {
			console.log("error", error)
		}

		const urlGetAllCategory = `${process.env.REACT_APP_API_URL}/category/getAllCategory`
		try {
			const responseCategory = await fetch(urlGetAllCategory)
			const resultsCategory = await responseCategory.json()
			setListCategory(resultsCategory)
		} catch (error) {
			console.log("error", error)
		}
	}

	useEffect(() => {
		fetchData()
	}, [])

	// Functions
	const clearForm = () => {
		setPlaceName("")
		setAddress("")
		setTime("")
		setSeason("")
		setDescription("")
		setLongitude(0)
		setLatitude(0)
		setIdCategory(null)
		setIdCluster(null)
	}

	const handleHideForm = async () => {
		setTotalSize(0)
		clearForm()
		setVisible(false)
	}

	const handleShowForm = async () => {
		clearForm()
		const url = `${process.env.REACT_APP_API_URL}/place/getPlaceById?id=${id}`
		let files = []
		const response = await fetch(url)
		const results = await response.json()
		let _totalSize = totalSize
		if (results.images) {
			const images = results.images.split(",")
			files = images.map((image, index) => {
				const byteCharacters = atob(`${image}`)
				const byteNumbers = new Array(byteCharacters.length)
				for (let i = 0; i < byteCharacters.length; i++) {
					byteNumbers[i] = byteCharacters.charCodeAt(i)
				}
				const byteArray = new Uint8Array(byteNumbers)
				const blob = new Blob([byteArray], { type: "image/jpeg" })
				const file = new File([blob], `${index + 1}.jpg`, { type: "image/jpeg" })
				file.base64code = image

				_totalSize += file.size || 0
				return file
			})
		}

		setTotalSize(_totalSize)

		setPlaceName(results.place_name || "")
		setAddress(results.address || "")
		setTime(results.time || "")
		setSeason(results.season || "")
		setDescription(results.description || "")
		setLongitude(results.longitude || 0)
		setLatitude(results.latitude || 0)
		setIdCategory(parseInt(results.id_category) || 0)
		setIdCluster(parseInt(results.id_cluster) || 0)
		fileUploadRef.current.setFiles(files)
	}

	const handleAddPlace = () => {
		setId("")
		clearForm()
		setVisible(true)
	}

	const handleEditClick = async (rowData) => {
		console.log(rowData.id)
		setId(rowData.id)
		setVisible(true)
	}

	const handleDeleteClick = async (rowData) => {
		const url = `${process.env.REACT_APP_API_URL}/place/deletePlace?id=${rowData.id}`

		const response = await fetch(url, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		})
		const result = await response.json()
		if (result) {
			toast.current.show({ severity: "info", summary: "Info", detail: "Place is deleted" })
			fetchData()
		}
	}

	const handleSavePlace = async () => {
		console.log(fileUploadRef.current.getFiles())
		let listFiles = ""
		const files = fileUploadRef.current.getFiles()
		if (files.length > 0) {
			const readerPromises = files.map((file) => {
				const reader = new FileReader()
				reader.readAsDataURL(file)
				return new Promise((resolve, reject) => {
					reader.onload = () => resolve(reader.result.split(",")[1])
					reader.onerror = (error) => reject(error)
				})
			})
			await Promise.all(readerPromises)
				.then((imageDataArray) => {
					console.log(imageDataArray.join(","))
					listFiles = imageDataArray.join(",")
				})
				.catch((error) => console.error("Error reading images:", error))
		}

		if (!id) {
			const url = `${process.env.REACT_APP_API_URL}/place/createPlace`
			const place = {
				place_name: place_name,
				address: address,
				time: time,
				season: season,
				description: description,
				longitude: longitude,
				latitude: latitude,
				id_category: id_category,
				id_cluster: id_cluster,
				images: listFiles,
			}

			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(place),
			})
			const result = await response.json()
			if (result) {
				handleHideForm()
				toast.current.show({ severity: "success", summary: "Info", detail: "Place is created" })
			}
		} else {
			const url = `${process.env.REACT_APP_API_URL}/place/updatePlace?id=${id}`
			const place = {
				place_name: place_name,
				address: address,
				time: time,
				season: season,
				description: description,
				longitude: longitude,
				latitude: latitude,
				id_category: id_category,
				id_cluster: id_cluster,
				images: listFiles,
			}

			const response = await fetch(url, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(place),
			})
			const result = await response.json()
			if (result) {
				handleHideForm()
				toast.current.show({ severity: "success", summary: "Info", detail: "Place is updated" })
			}
		}
		fetchData()
	}

	const handleClusterChange = (e) => {
		console.log(e.value)
		setIdCluster(e.value)
	}

	const handleCategoryChange = (e) => {
		setIdCategory(e.value)
	}

	const onTemplateSelect = (e) => {
		let _totalSize = totalSize
		let files = e.files

		Object.keys(files).forEach((key) => {
			_totalSize += files[key].size || 0
		})

		setTotalSize(_totalSize)
	}

	const onTemplateRemove = (file, callback) => {
		setTotalSize(totalSize - file.size)
		callback()
	}

	const onTemplateClear = () => {
		setTotalSize(0)
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

	const headerTemplate = (options) => {
		const { className, chooseButton, cancelButton } = options
		const value = totalSize / 10000
		const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : "0 B"

		return (
			<div className={className} style={{ backgroundColor: "transparent", display: "flex", alignItems: "center" }}>
				{chooseButton}
				{cancelButton}
				<div className="flex align-items-center gap-3 ml-auto">
					<span>{formatedValue} / 1 MB</span>
					<ProgressBar value={value} showValue={false} style={{ width: "10rem", height: "12px" }}></ProgressBar>
				</div>
			</div>
		)
	}

	const itemTemplate = (file, props) => {
		return (
			<div className="flex align-items-center flex-wrap">
				<div className="flex align-items-center" style={{ width: "40%" }}>
					<img alt={file.name} role="presentation" src={file.objectURL ? file.objectURL : `data:image/jpeg;base64,${file.base64code}`} width={100} />
					<span className="flex flex-column text-left ml-3">
						{file.name}
						<small>{new Date().toLocaleDateString()}</small>
					</span>
				</div>
				<Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
				<Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
			</div>
		)
	}

	const emptyTemplate = () => {
		return (
			<div className="flex align-items-center flex-column">
				<i className="pi pi-image mt-3 p-5" style={{ fontSize: "5em", borderRadius: "50%", backgroundColor: "var(--surface-b)", color: "var(--surface-d)" }}></i>
				<span style={{ fontSize: "1.2em", color: "var(--text-color-secondary)" }} className="my-5">
					Drag and Drop Image Here
				</span>
			</div>
		)
	}

	const chooseOptions = { icon: "pi pi-fw pi-images", iconOnly: true, className: "custom-choose-btn p-button-rounded p-button-outlined" }
	const cancelOptions = { icon: "pi pi-fw pi-times", iconOnly: true, className: "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined" }

	return (
		<>
			<Toast ref={toast} />
			<Button className="mt-2" label="Thêm mới" onClick={() => handleAddPlace()}></Button>
			<DataTable className="mt-2" value={places} tableStyle={{ minWidth: "50rem" }} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]}>
				<Column field="place_name" header="Tên địa điểm"></Column>
				<Column className="w-10rem" field="address" header="Địa chỉ"></Column>
				<Column field="description" header="Mô tả"></Column>
				<Column field="season" header="Mùa"></Column>
				<Column field="time" header="Thời gian"></Column>
				<Column field="cluster" header="Cụm điểm"></Column>
				<Column field="category" header="Danh mục"></Column>
				<Column field="" header="Thao tác" body={actionsBodyTemplate}></Column>
			</DataTable>
			<Dialog header="Thêm địa điểm" visible={visible} onHide={handleHideForm} onShow={handleShowForm}>
				<div className="mb-4 flex gap-2 justify-content-between flex-wrap">
					<div className="flex flex-column gap-2 col">
						<label htmlFor="place_name">Tên địa điểm</label>
						<InputText id="place_name" aria-describedby="place_name-help" value={place_name} onChange={(e) => setPlaceName(e.target.value)} />
					</div>
					<div className="flex flex-column gap-2 col">
						<label htmlFor="address">Địa chỉ</label>
						<InputText id="address" aria-describedby="address-help" value={address} onChange={(e) => setAddress(e.target.value)} />
					</div>
					<div className="flex flex-column gap-2 col">
						<label htmlFor="time">Thời gian</label>
						<InputText id="time" aria-describedby="time-help" value={time} onChange={(e) => setTime(e.target.value)} />
					</div>
					<div className="flex flex-column gap-2 col">
						<label htmlFor="season">Mùa</label>
						<InputText id="season" aria-describedby="season-help" value={season} onChange={(e) => setSeason(e.target.value)} />
					</div>
				</div>

				<div className="mb-4 flex gap-2 justify-content-between flex-wrap">
					<div className="flex flex-column gap-2 col">
						<label htmlFor="longitude">Kinh độ</label>
						<InputText id="longitude" aria-describedby="longitude-help" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
					</div>
					<div className="flex flex-column gap-2 col">
						<label htmlFor="latitude">Vĩ độ</label>
						<InputText id="latitude" aria-describedby="latitude-help" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
					</div>
					<div className="flex flex-column gap-2 col">
						<label htmlFor="id_cluster">Cụm điểm</label>
						<Dropdown
							id="id_cluster"
							value={id_cluster}
							onChange={handleClusterChange}
							options={listCluster}
							optionLabel="title"
							optionValue="id"
							placeholder="Chọn cụm điểm"
							editable
							showClear
							className="w-full"
						/>
					</div>
					<div className="flex flex-column gap-2 col">
						<label htmlFor="id_category">Danh mục</label>
						<Dropdown
							id="id_category"
							value={id_category}
							onChange={handleCategoryChange}
							options={listCategory}
							optionLabel="title"
							optionValue="id"
							placeholder="Chọn danh mục"
							editable
							showClear
							className="w-full"
						/>
					</div>
				</div>

				<div className="mb-4 flex flex-column gap-2 justify-content-between flex-wrap">
					<label htmlFor="description">Mô tả</label>
					<InputTextarea id="description" aria-describedby="description-help" value={description} onChange={(e) => setDescription(e.target.value)} rows={10} />
				</div>

				<div className="mb-4 flex flex-column gap-2 justify-content-between flex-wrap">
					<label htmlFor="image">Hình ảnh</label>
					<Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
					<Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

					<FileUpload
						id="image"
						ref={fileUploadRef}
						name="images[]"
						url="/api/upload"
						multiple
						accept="image/*"
						maxFileSize={1000000}
						onSelect={onTemplateSelect}
						onError={onTemplateClear}
						onClear={onTemplateClear}
						headerTemplate={headerTemplate}
						itemTemplate={itemTemplate}
						emptyTemplate={emptyTemplate}
						chooseOptions={chooseOptions}
						cancelOptions={cancelOptions}
					/>
				</div>

				<div className="mt-5 flex justify-content-evenly flex-wrap">
					<Button label="Lưu lại" severity="success" onClick={handleSavePlace}></Button>
					<Button className="ml-1" label="Hủy" severity="danger" onClick={handleHideForm}></Button>
				</div>
			</Dialog>
		</>
	)
}
