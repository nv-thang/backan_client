import React, { useState, useEffect, useRef } from "react"
import "leaflet/dist/leaflet.css"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { InputText } from "primereact/inputtext"
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
	const [id_category, setIdCategory] = useState(0)
	const [id_cluster, setIdCluster] = useState(0)
	const [id, setId] = useState("")

	const toast = useRef(null)

	const fetchData = async () => {
		const url = `${process.env.REACT_APP_API_URL}/place/getAllPlace`
		console.log("hihi")

		console.log("error", url)

		try {
			const response = await fetch(url)
			const results = await response.json()
			setListPlace(results)
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
		setIdCategory(0)
		setIdCluster(0)
	}

	const handleHideForm = () => {
		clearForm()
		setVisible(false)
	}

	const handleAddPlace = () => {
		setId("")
		clearForm()
		setVisible(true)
	}

	const handleEditClick = async (rowData) => {
		clearForm()
		setId(rowData.id)
		const url = `${process.env.REACT_APP_API_URL}/place/getPlaceById?id=${rowData.id}`

		const response = await fetch(url)
		const results = await response.json()
		setPlaceName(results.place_name || "")
		setAddress(results.address || "")
		setTime(results.time || "")
		setSeason(results.season || "")
		setDescription(results.description || "")
		setLongitude(results.longitude || 0)
		setLatitude(results.latitude || 0)
		setIdCategory(results.id_category || 0)
		setIdCluster(results.id_cluster || 0)
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
			<Dialog header="Thêm địa điểm" visible={visible} onHide={() => handleHideForm()} style={{ minWidth: "30vw" }}>
				<div className="mb-4 flex gap-2 justify-content-between flex-wrap">
					<div className="flex flex-column gap-2">
						<label htmlFor="place_name">Tên địa điểm</label>
						<InputText id="place_name" aria-describedby="place_name-help" value={place_name} onChange={(e) => setPlaceName(e.target.value)} />
					</div>
					<div className="flex flex-column gap-2">
						<label htmlFor="address">Địa chỉ</label>
						<InputText id="address" aria-describedby="address-help" value={address} onChange={(e) => setAddress(e.target.value)} />
					</div>
				</div>

				<div className="mb-4 flex gap-2 justify-content-between flex-wrap">
					<div className="flex flex-column gap-2">
						<label htmlFor="time">Thời gian</label>
						<InputText id="time" aria-describedby="time-help" value={time} onChange={(e) => setTime(e.target.value)} />
					</div>
					<div className="flex flex-column gap-2">
						<label htmlFor="season">Mùa</label>
						<InputText id="season" aria-describedby="season-help" value={season} onChange={(e) => setSeason(e.target.value)} />
					</div>
				</div>

				<div className="mb-4 flex flex-column gap-2 justify-content-between flex-wrap">
					<label htmlFor="description">Mô tả</label>
					<InputText id="description" aria-describedby="description-help" value={description} onChange={(e) => setDescription(e.target.value)} />
				</div>

				<div className="mb-4 flex gap-2 justify-content-between flex-wrap">
					<div className="flex flex-column gap-2">
						<label htmlFor="longitude">Kinh độ</label>
						<InputText id="longitude" aria-describedby="longitude-help" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
					</div>
					<div className="flex flex-column gap-2">
						<label htmlFor="latitude">Vĩ độ</label>
						<InputText id="latitude" aria-describedby="latitude-help" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
					</div>
				</div>

				<div className="mb-4 flex gap-2 justify-content-between flex-wrap">
					<div className="flex flex-column gap-2">
						<label htmlFor="id_cluster">Cụm điểm</label>
						<InputText id="id_cluster" aria-describedby="id_cluster-help" value={id_cluster} onChange={(e) => setIdCluster(e.target.value)} />
					</div>
					<div className="flex flex-column gap-2">
						<label htmlFor="id_category">Danh mục</label>
						<InputText id="id_category" aria-describedby="id_category-help" value={id_category} onChange={(e) => setIdCategory(e.target.value)} />
					</div>
				</div>

				<div className="mt-5 flex justify-content-evenly flex-wrap">
					<Button label="Lưu lại" severity="success" onClick={handleSavePlace}></Button>
					<Button className="ml-1" label="Hủy" severity="danger" onClick={() => handleHideForm()}></Button>
				</div>
			</Dialog>
		</>
	)
}
