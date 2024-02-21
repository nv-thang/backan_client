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
import Viewpage from "./Component/Viewpage"

function App() {
	return (
		<>
			<GlobalStyles>
				<div className="h-screen">
					<Routes>
						<Route path="/" element={<Viewpage />} />
						<Route path="/manager/*" exact element={<Manager />} />
					</Routes>
				</div>
			</GlobalStyles>
		</>
	)
}

export default App
