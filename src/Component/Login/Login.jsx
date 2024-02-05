import React, { useRef } from "react"
import { Controller, useForm } from "react-hook-form"
import "primeflex/primeflex.css"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import { classNames } from "primereact/utils"
import { useNavigate } from "react-router-dom"
import { Toast } from "primereact/toast"

export default function Login() {
	const navigate = useNavigate()
	const toast = useRef(null)

	const defaultValues = {
		username: "",
		password: "",
	}

	const {
		control,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm({ defaultValues })

	const onSubmit = async (data) => {
		const url = `{process.env.API_URL}/user/getUserByUserName?username=${data.username}`
		try {
			const response = await fetch(url)
			const result = await response.json()
			if (result && data.password === result.password) {
				navigate("/manager/home")
				localStorage.setItem("isLoggedIn", "true")
			} else {
				toast.current.show({ severity: "error", summary: "Error", detail: "Sai thông tin đăng nhập!" })
				return false
			}
		} catch (error) {
			console.log("error", error)
		}

		reset()
	}

	const getFormErrorMessage = (name) => {
		return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>
	}

	return (
		<>
			<Toast ref={toast} />
			<div className="card flex justify-content-center">
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-column gap-2">
					<h2 className="flex justify-content-center flex-wrap">Đăng nhập hệ thống</h2>
					<div className="flex flex-column gap-2">
						<label htmlFor="username">Tên người dùng</label>
						<Controller
							name="username"
							control={control}
							rules={{ required: "Tên người dùng không được để trống" }}
							render={({ field, fieldState }) => (
								<>
									<span className="p-float-label">
										<InputText id={field.name} value={field.value} className={classNames({ "p-invalid": fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
									</span>
									{getFormErrorMessage(field.name)}
								</>
							)}
						/>
					</div>

					<div className="flex flex-column gap-2">
						<label htmlFor="password">Mật khẩu</label>
						<Controller
							name="password"
							control={control}
							rules={{ required: "Mật khẩu không được để trống" }}
							render={({ field, fieldState }) => (
								<>
									<span className="p-float-label">
										<InputText
											id={field.name}
											value={field.value}
											className={classNames({ "p-invalid": fieldState.error })}
											onChange={(e) => field.onChange(e.target.value)}
											type="password"
										/>
									</span>
									{getFormErrorMessage(field.name)}
								</>
							)}
						/>
					</div>
					<div className="flex justify-content-center flex-wrap gap-2">
						<Button label="Đăng Nhập" type="submit" />
					</div>
				</form>
			</div>
		</>
	)
}
