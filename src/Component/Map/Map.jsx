import React, { useState, useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { FullscreenControl } from "react-leaflet-fullscreen"
import "react-leaflet-fullscreen/styles.css"
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { LayerGroup, LayersControl, MapContainer, Marker, Popup, TileLayer, useMap, ScaleControl, GeoJSON } from "react-leaflet"
import MarkerClusterGroup from "react-leaflet-cluster"

import Location from "../../Storage/Images/marker.png"
import Lake from "../../Storage/Images/lake.png"
import Relic from "../../Storage/Images/relic.png"
import Cave from "../../Storage/Images/cave.png"
import Waterfall from "../../Storage/Images/waterfall.png"
import Reserve from "../../Storage/Images/reserve.png"
import Terraces from "../../Storage/Images/terraces.png"
import Adventure from "../../Storage/Images/adventure.png"

import { FilterMatchMode } from "primereact/api"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { InputText } from "primereact/inputtext"

const LegendControl = () => {
	const map = useMap()

	useEffect(() => {
		const legendControl = L.control({ position: "bottomleft" })

		legendControl.onAdd = function () {
			const div = L.DomUtil.create("div", "legend")
			div.innerHTML = `
							<div style="background-color: white; padding: 10px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.2);">
								<button type="button" id="showLegend" style="background-color: white; border: 1px solid DodgerBlue; color: red; cursor: pointer; height: 30px; border-radius: 5px; font-weight: bold;">Ẩn</button>
								<div id="legendList" >
									<h4 style="text-align: center;">Bảng chú thích</h4>
									<p>Hang động Karst: <img src="${Cave}" alt="" width="20" height="20" style="border: 1px solid cyan"></p>
									<p>Thác nước: <img src="${Waterfall}" alt="" width="20" height="20" style="border: 1px solid cyan"></p>
									<p>Hồ ao: <img src="${Lake}" alt="" width="20" height="20" style="border: 1px solid cyan"></p>
									<p>Khu du lịch sinh thái: <img src="${Adventure}" alt="" width="20" height="20" style="border: 1px solid cyan"></p>
									<p>Cảnh quan ruộng bậc thang: <img src="${Terraces}" alt="" width="20" height="20" style="border: 1px solid cyan"></p>
									<p>Khu di tích lịch sử: <img src="${Relic}" alt="" width="20" height="20" style="border: 1px solid cyan"></p>
									<p>Khu bảo tồn: <img src="${Reserve}" alt="" width="20" height="20" style="border: 1px solid cyan"></p>
								</div>
							</div>
							`
			return div
		}

		legendControl.addTo(map)
		const buttonShowLegend = document.getElementById("showLegend")
		const legendList = document.getElementById("legendList")
		if (buttonShowLegend)
			buttonShowLegend.addEventListener("click", () => {
				if (legendList.style.display === "none") {
					legendList.style.display = "block"
					buttonShowLegend.innerHTML = "Ẩn"
				} else {
					legendList.style.display = "none"
					buttonShowLegend.innerHTML = "Hiện"
				}
			})
	}, [map])

	return null
}

export default function Map() {
	const [places, setListPlace] = useState({})
	const [places2, setListPlace2] = useState({})
	const [list, setList] = useState()
	const [geoJSONData, setGeoJSONData] = useState({})
	const mapRef = useRef()

	const [globalFilterValue, setGlobalFilterValue] = useState("")

	const fetchData = async () => {
		const url = "http://localhost:4004/place/getAllPlace"
		const urlRanhGioiHuyen = "http://localhost:4004/place/getRanhGioiHuyen"

		try {
			const response = await fetch(url)
			const results = await response.json()
			setList(results)
			const organizedData = {}
			const organizedData2 = {}
			results.forEach((point) => {
				const { id, place_name, address, time, season, id_category, id_cluster, longitude, latitude, cluster, category, description } = point

				if (!organizedData[cluster]) {
					organizedData[cluster] = {}
				}

				if (!organizedData[cluster][category]) {
					organizedData[cluster][category] = []
				}

				organizedData[cluster][category].push({ id, place_name, address, time, season, id_category, id_cluster, longitude, latitude, cluster, category, description })
			})
			setListPlace(organizedData)

			results.forEach((point) => {
				const { id, place_name, address, time, season, id_category, id_cluster, longitude, latitude, cluster, category, description } = point

				if (!organizedData2[category]) {
					organizedData2[category] = {}
				}

				if (!organizedData2[category][cluster]) {
					organizedData2[category][cluster] = []
				}

				organizedData2[category][cluster].push({ id, place_name, address, time, season, id_category, id_cluster, longitude, latitude, cluster, category, description })
			})
			setListPlace2(organizedData2)
		} catch (error) {
			console.log("error", error)
		}

		try {
			const responseRanhGioiHuyen = await fetch(urlRanhGioiHuyen)
			const resultsRanhGioiHuyen = await responseRanhGioiHuyen.json()
			setGeoJSONData(resultsRanhGioiHuyen)
		} catch (error) {
			console.log("error", error)
		}
	}

	useEffect(() => {
		fetchData()
	}, [])

	const center = [22.275680307028182, 105.87320519077504] // 22.275680307028182, 105.87320519077504
	const { BaseLayer, Overlay } = LayersControl

	const createCustomIcon = (icon) =>
		new L.divIcon({
			html: `<img src="${icon}" alt="" width="30" height="30" style="border: 1px solid cyan">`,
			className: "custom-div-icon",
		})

	const createPopup = (place_name, latitude, longitude, description) => {
		return (
			<>
				<h1>Tên: {place_name}</h1>
				<span>
					<strong>Kinh độ: </strong>
					{latitude} - <strong>Vĩ độ: </strong>
					{longitude}
				</span>
				<br />
				<span>
					<strong>Mô tả: </strong>
					{description}
				</span>
			</>
		)
	}

	const renderMarker = (id, place_name, latitude, longitude, category, description) => {
		switch (category) {
			case "Hang động Karst":
				return (
					<Marker key={id} position={[latitude, longitude]} icon={createCustomIcon(Cave)}>
						<Popup>{createPopup(place_name, latitude, longitude, description)}</Popup>
					</Marker>
				)
			case "Thác nước":
				return (
					<Marker key={id} position={[latitude, longitude]} icon={createCustomIcon(Waterfall)}>
						<Popup>{createPopup(place_name, latitude, longitude, description)}</Popup>
					</Marker>
				)
			case "Hồ ao":
				return (
					<Marker key={id} position={[latitude, longitude]} icon={createCustomIcon(Lake)}>
						<Popup>{createPopup(place_name, latitude, longitude, description)}</Popup>
					</Marker>
				)

			case "Khu du lịch sinh thái":
				return (
					<Marker key={id} position={[latitude, longitude]} icon={createCustomIcon(Adventure)}>
						<Popup>{createPopup(place_name, latitude, longitude, description)}</Popup>
					</Marker>
				)
			case "Cảnh quan ruộng bậc thang":
				return (
					<Marker key={id} position={[latitude, longitude]} icon={createCustomIcon(Terraces)}>
						<Popup>{createPopup(place_name, latitude, longitude, description)}</Popup>
					</Marker>
				)
			case "Khu di tích lịch sử":
				return (
					<Marker key={id} position={[latitude, longitude]} icon={createCustomIcon(Relic)}>
						<Popup>{createPopup(place_name, latitude, longitude, description)}</Popup>
					</Marker>
				)
			case "Khu bảo tồn":
				return (
					<Marker key={id} position={[latitude, longitude]} icon={createCustomIcon(Reserve)}>
						<Popup>{createPopup(place_name, latitude, longitude, description)}</Popup>
					</Marker>
				)
			default:
				return (
					<Marker key={id} position={[latitude, longitude]} icon={createCustomIcon(Location)}>
						<Popup>{createPopup(place_name, latitude, longitude, description)}</Popup>
					</Marker>
				)
		}
	}

	const handleRowClick = (rowData) => {
		console.log(rowData)
		const lat = rowData.data.latitude
		const long = rowData.data.longitude
		mapRef.current.setView([lat, long], 15)
		// const marker = renderMarker(rowData.data.id, rowData.data.place_name, lat, long, rowData.data.category, rowData.data.description)
		// marker.bindPopup().openPopup()
		// marker.openPopup()
	}

	const [filters, setFilters] = useState({
		global: { value: null, matchMode: FilterMatchMode.CONTAINS },
	})

	const onGlobalFilterChange = (e) => {
		const value = e.target.value
		let _filters = { ...filters }

		_filters["global"].value = value

		setFilters(_filters)
		setGlobalFilterValue(value)
	}

	const renderHeader = () => {
		return (
			<div className="flex justify-content-end">
				<span className="p-input-icon-left">
					<i className="pi pi-search" />
					<InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Nhập tên địa điểm" />
				</span>
			</div>
		)
	}

	const header = renderHeader()

	const style = (feature) => {
		return {
			weight: 2,
			opacity: 0.9,
			fillOpacity: 0.5,
		}
	}

	return (
		<>
			<div className="flex">
				<div className="col-3">
					<DataTable
						style={{ height: "calc(100vh - 20px)" }}
						className="mt-2 overflow-auto"
						rowClassName="cursor-pointer"
						value={list}
						paginator
						rows={12}
						rowHover={true}
						onRowClick={handleRowClick}
						dataKey="id"
						filters={filters}
						globalFilterFields={["place_name"]}
						header={header}
						emptyMessage="Không có địa điểm phù hợp"
					>
						<Column field="place_name" header="Tên địa điểm"></Column>
					</DataTable>
				</div>
				<MapContainer className="col-9" center={center} zoom={10} style={{ height: "calc(100vh - 20px)" }} ref={mapRef}>
					<TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
					<LayersControl position="topright">
						<BaseLayer checked name="OpenStreetMap">
							<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
						</BaseLayer>

						<BaseLayer name="CartoDB">
							<TileLayer url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors, CartoDB" />
						</BaseLayer>

						{Object.entries(places).map(([cluster, categories]) => (
							<Overlay key={cluster} name={cluster}>
								<MarkerClusterGroup>
									{Object.entries(categories).map(([category, points]) => (
										<LayerGroup key={category}>
											{points.map(({ id, place_name, longitude, latitude, description }) => renderMarker(id, place_name, latitude, longitude, category, description))}
										</LayerGroup>
									))}
								</MarkerClusterGroup>
							</Overlay>
						))}
						{Object.entries(places2).map(([category, clusters]) => (
							<Overlay key={category} name={category} checked>
								<MarkerClusterGroup>
									{Object.entries(clusters).map(([cluster, points]) => (
										<LayerGroup key={cluster}>
											{points.map(({ id, place_name, longitude, latitude, description }) => renderMarker(id, place_name, latitude, longitude, category, description))}
										</LayerGroup>
									))}
								</MarkerClusterGroup>
							</Overlay>
						))}
					</LayersControl>
					<FullscreenControl forceSeparateButton={true} />
					<LegendControl />
					<ScaleControl position="bottomright" />
					{Object.entries(geoJSONData).map(([id, polygon]) => (
						<GeoJSON key={polygon.gid} data={JSON.parse(polygon.geometry)} style={style}>
							<Popup>{polygon.name_2}</Popup>
						</GeoJSON>
					))}
				</MapContainer>
			</div>
		</>
	)
}