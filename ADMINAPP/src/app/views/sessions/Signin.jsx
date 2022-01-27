import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { apiUrl } from 'app/config';
import { useDispatch } from "react-redux";
import { loginWithEmailAndPassword } from "app/redux/actions/LoginActions";
import axios from 'axios'
import { NotificationContainer, NotificationManager } from "react-notifications";
import {
    Button,
    Form,
    FormGroup,
    FormControl
} from "react-bootstrap";
import { classList } from "@utils";

const Signin = () => {
    const [type, setType] = useState(true)
    const [flagValid, setflagValid] = useState(false)
    const dispatch = useDispatch()

    const handleSubmit = (values, { isSubmitting }) => {
        if(!values.password.length>0&&!values.username.length>0){
            NotificationManager.error("Enter valid Username and Password");
        }
        else if(!values.password.length>0){
            NotificationManager.error("Enter valid Password");
        }else if(!values.username.length>0){
            NotificationManager.error("Enter valid Username");
        }
        if(values.password.length>0 && values.username.length>0){
            axios.post(apiUrl + "user/login", values)
            .then((res) => {
                if (res.data.status === true) {
                    dispatch(loginWithEmailAndPassword(res.data.token));
                    NotificationManager.success(
                        res.data.message
                    );
                }
                else {
                    NotificationManager.error(
                        res.data.message
                    );
                }
            })
            .catch((err) => {
                NotificationManager.warning(
                    err.message
                );
            })
        isSubmitting(true);
        }
    };

    return (
        <>
            <div
                className="auth-layout-wrap"
                style={{
                    backgroundImage: "url(" + process.env.PUBLIC_URL + "/assets/images/photo-wide-4.jpg)"
                }}
            >
                <div className="auth-content w-25">
                    <div className="card o-hidden">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="p-4">
                                    <div className="auth-logo text-center mb-4">
                                        <p style={{
                                            fontSize: '20px', fontWeight: 'bold', color: 'rgb(0, 32, 81)'
                                        }} className="w-100" >Miyami Maldives</p>
                                        {/* <img src={process.env.PUBLIC_URL + "/assets/images/logo1.png"} alt="Sphoenix" style={{ fontWeight: 'bold', fontSize: '2rem', textTransform: 'full-width' }} /> */}
                                    </div>
                                    <Formik
                                        initialValues={{
                                            username: '',
                                            password: '',
                                        }}
                                        
                                        onSubmit={handleSubmit}
                                        // validationSchema={
                                        //     yup.object().shape({
                                        //         username: NotificationManager.error("Username is required"),
                                        //         password: NotificationManager.error("Password is required"),
                                        //     })
                                        // }
                                    >
                                        {({
                                            values,
                                            errors,
                                            touched,
                                            handleChange,
                                            handleBlur,
                                            handleSubmit,
                                            isSubmitting,
                                            resetForm
                                        }) => {
                                            return (
                                                <Form
                                                    autoComplete="off"
                                                    className="needs-validation"
                                                    onSubmit={handleSubmit}
                                                    noValidate
                                                >
                                                    <div className="row mb-6">
                                                        <div className="col-md-12">
                                                            <FormGroup className="col-md-12 mb-4">
                                                                <FormControl
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="username"
                                                                    placeholder="Username"
                                                                    value={values.username}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    isInvalid={
                                                                        errors.username &&
                                                                        touched.username
                                                                    }
                                                                />
                                                            </FormGroup>
                                                        </div>

                                                        <div className="col-md-12">
                                                            <FormGroup className="col-md-12 mb-4">
                                                                <FormControl
                                                                    type={type ? 'password' : 'text'}
                                                                    className="form-control"
                                                                    name="password"
                                                                    placeholder="Password"
                                                                    value={values.password}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    isInvalid={
                                                                        errors.password &&
                                                                        touched.password
                                                                    }
                                                                />
                                                                <i
                                                                    className={classList({
                                                                        "password": true,
                                                                        "ion-md-eye": type,
                                                                        "ion-md-eye-off": !type
                                                                    })}
                                                                    onClick={() => setType(!type)}
                                                                />
                                                            </FormGroup>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-12">
                                                        <Button variant="outline-primary" className="w-100" type="submit">Sign In</Button>
                                                    </div>

                                                </Form>
                                            );
                                        }}
                                    </Formik>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <NotificationContainer />
        </>
    )

}
export default Signin;