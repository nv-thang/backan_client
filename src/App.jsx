import "primereact/resources/themes/lara-light-blue/theme.css" // theme
import "primeflex/primeflex.css" // css utility
import "primeicons/primeicons.css"
import "primereact/resources/primereact.css"

// React router dom
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom";



// Component
import GlobalStyles from "./Component/GlobalStyle"
import React from "react"
import Manager from "./Component/Manager"
import Map from "./Component/Map"

function App() {
	return (
		<>
			<GlobalStyles>
				<div className="h-screen">
					<Routes>
						<Route path="/" element={<Map />} />
						<Route path="/manager/*" exact element={<Manager />} />
					</Routes>
				</div>
			</GlobalStyles>
		</>
	)
}

export default App
