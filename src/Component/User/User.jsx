import React, { useState, useEffect, useRef } from "react"
import "primeflex/primeflex.css"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { InputText } from "primereact/inputtext"
import { Toast } from "primereact/toast"

export default function APIs() {
	const [products, setProducts] = useState([])
	const [visible, setVisible] = useState(false)
	const [userName, setUserName] = useState("")
	const [password, setPassword] = useState("")
	const [firstName, setFirstName] = useState("")
	const [lastName, setLastName] = useState("")
	const [email, setEmail] = useState("")
	const [role, setRole] = useState("")
	const [id, setId] = useState("")

	const toast = useRef(null)

	const fetchData = async () => {
		const url = "{process.env.API_URL}/user/getAllUser"
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
		setUserName("")
		setPassword("")
		setFirstName("")
		setLastName("")
		setEmail("")
		setRole("")
	}

	const handleHideForm = () => {
		clearForm()
		setVisible(false)
	}

	const handleSaveUser = async () => {
		if (!id) {
			const url = "{process.env.API_URL}/user/createUser"
			const user = {
				username: userName,
				password: password,
				firstname: firstName,
				lastname: lastName,
				email: email,
				role: role,
			}

			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(user),
			})
			const result = await response.json()
			console.log(response)
			if (result) {
				handleHideForm()
				toast.current.show({ severity: "success", summary: "Info", detail: "User is created" })
			}
		} else {
			const url = `{process.env.API_URL}/user/updateUser?id=${id}`
			const user = {
				username: userName,
				password: password,
				firstname: firstName,
				lastname: lastName,
				email: email,
				role: role,
			}

			const response = await fetch(url, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(user),
			})
			const result = await response.json()
			if (result) {
				handleHideForm()
				toast.current.show({ severity: "success", summary: "Info", detail: "User is updated" })
			}
		}
		fetchData()
	}

	const handleDeleteUser = async (rowData) => {
		const url = `{process.env.API_URL}/user/deleteUser?id=${rowData.id}`

		const response = await fetch(url, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		})
		const result = await response.json()
		if (result) {
			toast.current.show({ severity: "info", summary: "Info", detail: "User is deleted" })
			fetchData()
		}
	}

	const handleAddUser = () => {
		setId("")
		clearForm()
		setVisible(true)
	}

	const handleEditClick = async (rowData) => {
		clearForm()
		setId(rowData.id)
		const rowId = rowData.id
		const url = `{process.env.API_URL}/user/getUserById?id=${rowId}`

		const response = await fetch(url)
		const results = await response.json()
		setUserName(results.username || "")
		setPassword(results.password || "")
		setFirstName(results.firstname || "")
		setLastName(results.lastname || "")
		setEmail(results.email || "")
		setRole(results.role || "0")
		setVisible(true)
	}

	// Templates
	const actionsBodyTemplate = (rowData) => {
		return (
			<>
				<Button severity="info" text onClick={() => handleEditClick(rowData)}>
					<i className="pi pi-pencil" />
				</Button>
				<Button severity="danger" text onClick={() => handleDeleteUser(rowData)}>
					<i className="pi pi-trash" />
				</Button>
			</>
		)
	}

	return (
		<>
			<Toast ref={toast} />
			<Button className="mt-2" label="Thêm mới" onClick={() => handleAddUser()}></Button>
			<DataTable className="mt-2" value={products} tableStyle={{ minWidth: "50rem" }} paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]}>
				<Column field="fullname" header="Tên đầy đủ"></Column>
				<Column field="username" header="Tên người dùng"></Column>
				<Column field="image" header="Hình ảnh"></Column>
				<Column field="email" header="Email"></Column>
				<Column field="role" header="Vai trò"></Column>
				<Column field="" header="Thao tác" body={actionsBodyTemplate}></Column>
			</DataTable>

			<Dialog header="Thêm người dùng" visible={visible} onHide={() => handleHideForm()} style={{ minWidth: "30vw" }}>
				<div className="mb-4 flex gap-2 justify-content-between flex-wrap">
					<div className="flex flex-column gap-2">
						<label htmlFor="username">Tên người dùng</label>
						<InputText id="username" aria-describedby="username-help" value={userName} onChange={(e) => setUserName(e.target.value)} />
					</div>
					<div className="flex flex-column gap-2">
						<label htmlFor="password">Mật khẩu</label>
						<InputText id="password" aria-describedby="password-help" value={password} onChange={(e) => setPassword(e.target.value)} />
					</div>
				</div>
				<div className="mb-4 flex gap-2 justify-content-between flex-wrap">
					<div className="flex flex-column gap-2">
						<label htmlFor="firstname">Họ</label>
						<InputText id="firstname" aria-describedby="firstname-help" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
					</div>
					<div className="flex flex-column gap-2">
						<label htmlFor="lastname">Tên</label>
						<InputText id="lastname" aria-describedby="lastname-help" value={lastName} onChange={(e) => setLastName(e.target.value)} />
					</div>
				</div>

				<div className="mb-4 flex gap-2 justify-content-between flex-wrap">
					<div className="flex flex-column gap-2">
						<label htmlFor="email">Email</label>
						<InputText id="email" aria-describedby="email-help" value={email} onChange={(e) => setEmail(e.target.value)} />
					</div>
					<div className="flex flex-column gap-2">
						<label htmlFor="role">Vai trò</label>
						<InputText id="role" aria-describedby="role-help" value={role} onChange={(e) => setRole(e.target.value)} />
					</div>
				</div>

				<div className="mt-5 flex justify-content-evenly flex-wrap">
					<Button label="Lưu lại" severity="success" onClick={handleSaveUser}></Button>
					<Button className="ml-1" label="Hủy" severity="danger" onClick={() => handleHideForm()}></Button>
				</div>
			</Dialog>
		</>
	)
}
