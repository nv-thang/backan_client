import React, { useRef , useEffect} from 'react';
import { Controller, useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import 'primeflex/primeflex.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const navigate = useNavigate();
  const toast = useRef(null);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const accessToken = sessionStorage.getItem('access_token');
    if (isLoggedIn === 'true' && accessToken) {
      navigate('/place');
    }
  }, [navigate]);

  const defaultValues = {
    username: '',
    password: '',
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValues });

  const onSubmit = async (data) => {
    const url = `${process.env.REACT_APP_API_URL}/auth/login`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });

      const result = await response.json();
      
      console.log(result);

      if (response.ok) {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('access_token', result.access_token);
       
        navigate('/place');
      } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Sai thông tin đăng nhập!' });
      }
    } catch (error) {
      console.log('error', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Đã xảy ra lỗi, vui lòng thử lại!' });
    }

    reset();
  };

  const getFormErrorMessage = (name) => {
    return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
  };

  return (
    <>
      <div className="container d-flex align-items-center min-vh-100">
        <div className="row w-100">
          <div className="col-md-6 mx-auto">
            <div className="text-center mb-4" style={{ fontSize: '25px', fontWeight: '500', color: '#fa9108' }}>
              HỆ THỐNG DU LỊCH TỰ NHIÊN TỈNH BẮC KẠN
            </div>
            <div className="card p-4 shadow-sm">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Tên người dùng
                  </label>
                  <Controller
                    name="username"
                    control={control}
                    rules={{ required: 'Tên người dùng không được để trống' }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputText
                          id={field.name}
                          value={field.value}
                          className={classNames('form-control', { 'is-invalid': fieldState.error })}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        {getFormErrorMessage(field.name)}
                      </>
                    )}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Mật khẩu
                  </label>
                  <Controller
                    name="password"
                    control={control}
                    rules={{ required: 'Mật khẩu không được để trống' }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputText
                          id={field.name}
                          value={field.value}
                          className={classNames('form-control', { 'is-invalid': fieldState.error })}
                          onChange={(e) => field.onChange(e.target.value)}
                          type="password"
                        />
                        {getFormErrorMessage(field.name)}
                      </>
                    )}
                  />
                </div>

                <div className="text-center">
                  <Button label="Đăng Nhập" type="submit" className="btn btn-primary w-100" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Toast ref={toast} />
    </>
  );
};

export default Login;
