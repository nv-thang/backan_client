import React from "react"
import ReactDOM from "react-dom/client"
import {  HashRouter } from "react-router-dom"
import { PrimeReactProvider } from "primereact/api"
// import "primereact/resources/themes/lara-light-indigo/theme.css" // theme
// import "primeflex/primeflex.css" // css utility
// import "primeicons/primeicons.css"
// import "primereact/resources/primereact.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals"

/* <React.StrictMode></React.StrictMode> */

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
	<>
		<HashRouter>
			<PrimeReactProvider>
				<App />
			</PrimeReactProvider>
		</HashRouter>
	</>
)
reportWebVitals()
