import "primereact/resources/themes/lara-light-blue/theme.css" // theme
import "primeflex/primeflex.css" // css utility
import "primeicons/primeicons.css"
import "primereact/resources/primereact.css"

// React router dom
import { Routes, Route } from "react-router-dom"

// Component
import GlobalStyles from "./Component/GlobalStyle"
import React from "react"
import Manager from "./Component/Manager"
import Home from "./V2/pages/Home"
import About from "./V2/pages/About"
import Contact from "./V2/pages/Contact"
import Login from "./V2/pages/Login"

import PlacePage from "./V2/pages/PlacePage"
import CategoryPage from "./V2/pages/CategoryPage"
import ClusterPage from "./V2/pages/ClusterPage"
import UserPage from "./V2/pages/UserPage"

import ProtectedRoute from './V2/ProtectedRoute';


function App() {
	return (
		<>
			<GlobalStyles>
				<div className="h-screen">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/about" element={<About />} />
						<Route path="/contact" element={<Contact />} />
						<Route path="/login" element={<Login />} />
						<Route path="/place" element={<ProtectedRoute><PlacePage /></ProtectedRoute>} />
						<Route path="/category" element={<ProtectedRoute><CategoryPage /></ProtectedRoute>} />
						<Route path="/cluster" element={<ProtectedRoute><ClusterPage /></ProtectedRoute>} />
						<Route path="/user" element={<ProtectedRoute><UserPage /></ProtectedRoute>} />
						<Route path="/manager/*" exact element={<Manager />} />
					</Routes>
				</div>
			</GlobalStyles>
		</>
	)
}

export default App

