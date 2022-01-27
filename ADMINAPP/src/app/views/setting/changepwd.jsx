import React from 'react';
import { Breadcrumb, SimpleCard } from "@gull";
import { Form, Button, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import { rootPath } from 'app/config';
import { Formik } from "formik";
import { NotificationContainer, NotificationManager } from "react-notifications";
import { changePasswordAction } from 'app/redux/actions/SettingsActions';
import { useDispatch } from 'react-redux';

function ChangePassword() {

    const dispatch = useDispatch();

    const handleSubmit = (submitValues) => {
        const {
            current_password,
            password,
            confirm_password
        } = submitValues;

        if(!current_password){
            NotificationManager.warning('Please Enter the Current Password');
        } else if(!password){
            NotificationManager.warning('Please Enter the New Password');
        } else if(!confirm_password){
            NotificationManager.warning('Please Enter the Confirm Password');
        } else if(password && confirm_password && password.toString() !== confirm_password.toString()){
            NotificationManager.warning('Password and Confirm password must be same');
        } else {
            dispatch(changePasswordAction(submitValues, NotificationManager));
        }
    }
    return (
        <>
            <Breadcrumb
                routeSegments={[
                    { name: "Settings", path: rootPath + 'setting/changePassword' },
                    { name: "Change Password" }
                ]}
            />

            <SimpleCard>
                <Formik
                    enableReinitialize={true}
                    onSubmit={handleSubmit}
                    initialValues={{
                        "current_password": "",
                        "password": "",
                        "confirm_password": ""
                    }}>
                    {({
                        values,
                        handleChange,
                        handleReset,
                        handleBlur,
                        handleSubmit,
                        setFieldValue
                    }) => {
                        return (<Form
                            onSubmit={handleSubmit}
                            encType={`true`}
                            autoComplete={false}
                            className="needs-validation">
                            <div className="row">
                                <Form.Row className="w-100 p-0 d-block">
                                    <FormGroup className="w-50 m-auto pt-3">
                                        <FormLabel className="font-weight-bold">Current Password</FormLabel>
                                        <FormControl
                                            type="password"
                                            className="form-control"
                                            name="current_password"
                                            onChange={(e) => {
                                                setFieldValue("current_password", e.target.value);
                                            }}
                                        />
                                    </FormGroup>
                                    <FormGroup className="w-50 m-auto pt-3">
                                        <FormLabel className="font-weight-bold">New Password</FormLabel>
                                        <FormControl
                                            type="password"
                                            className="form-control"
                                            name="password"
                                            onChange={(e) => {
                                                setFieldValue("password", e.target.value);
                                            }}
                                        />
                                    </FormGroup>
                                    <FormGroup className="w-50 m-auto pt-3">
                                        <FormLabel className="font-weight-bold">Confirm Password</FormLabel>
                                        <FormControl
                                            type="password"
                                            className="form-control"
                                            name="confirm_password"
                                            onChange={(e) => {
                                                setFieldValue("confirm_password", e.target.value);
                                            }}
                                        />
                                    </FormGroup>
                                    <FormGroup className="w-50 m-auto pt-5 d-flex align-items-center">
                                        <Button className="w-50" variant="outline-danger m-1 text-capitalize">Cancel</Button>
                                        <Button type="submit" className="w-50" variant="outline-primary m-1 text-capitalize">Submit</Button>
                                    </FormGroup>
                                </Form.Row>
                            </div>
                        </Form>)
                    }}
                </Formik>
            </SimpleCard>
            <NotificationContainer />
        </>
    )
}

export default ChangePassword;