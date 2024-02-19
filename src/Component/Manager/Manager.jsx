import "primereact/resources/themes/lara-light-blue/theme.css" // theme
import "primeflex/primeflex.css" // css utility
import "primeicons/primeicons.css"
import "primereact/resources/primereact.css"

// React router dom

import React from "react"
import { Routes, Route, useNavigate /* NavLink */ } from "react-router-dom"

// Prime react
import { Menubar } from "primereact/menubar"
import { Button } from "primereact/button"
// import { Image } from "primereact/image"

// Component
import GlobalStyles from "../GlobalStyle"
import Place from "../Place"
import Category from "../Category"
import Cluster from "../Cluster"
import User from "../User"
import Map from "../Map"
import Login from "../Login"
// import Logo from "../../Storage/Images/Home.jpg"

export default function Manager() {
	const navigate = useNavigate()
	const isLoggedIn = sessionStorage.getItem("isLoggedIn")

	const handleLogout = () => {
		sessionStorage.removeItem("isLoggedIn")
		navigate("/manager")
	}

	/* const start = (
		<NavLink to="/manager">
			<Image imageClassName="border-circle" src={Logo} width="40" height="40" alt="No image" />
		</NavLink>
	) */

	const end = (
		<>
			<Button severity="info" text onClick={(e) => console.log(e)}>
				<i className="pi pi-facebook" />
			</Button>
			<Button severity="info" text onClick={(e) => console.log(e)}>
				<i className="pi pi-google" />
			</Button>
			<Button severity="danger" text onClick={handleLogout}>
				<i className="pi pi-power-off" />
			</Button>
		</>
	)

	const items = [
		{
			label: "Trang chủ",
			icon: "",
			command: () => {
				navigate("/manager/home")
			},
		},
		{
			label: "Địa điểm",
			icon: "",
			command: () => {
				navigate("/manager/place")
			},
		},
		{
			label: "Danh mục",
			icon: "",
			command: () => {
				navigate("/manager/category")
			},
			className: "",
		},
		{
			label: "Cụm điểm",
			icon: "",
			command: () => {
				navigate("/manager/cluster")
			},
			className: "",
		},
		{
			label: "Người dùng",
			icon: "",
			command: () => {
				navigate("/manager/user")
			},
			className: "",
		},
	]
	if (!isLoggedIn) return <Login />

	return (
		<>
			<GlobalStyles>
				<div className="h-screen">
					<Menubar model={items} className="w-full bg-primary-reverse" end={end}></Menubar>
					<div>
						<Routes>
							<Route path="/" element={<Map />} />
							<Route path="/home" element={<Map />} />
							<Route path="/place" element={<Place />} />
							<Route path="/category" element={<Category />} />
							<Route path="/cluster" element={<Cluster />} />
							<Route path="/user" element={<User />} />
						</Routes>
					</div>
				</div>
			</GlobalStyles>
		</>
	)
}
