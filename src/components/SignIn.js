import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";

import { RiLoginBoxLine } from "react-icons/ri";

import styles from "./styles/SignIn.module.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

function SignIn() {
  const [resData, setResData] = useState(null);

  let navigate = useNavigate();

  const schema = yup.object().shape({
    userName: yup.string().email().required(),
    password: yup.string().min(8).required(),
  });

  async function postSignInInfo(inputData) {
    try{
      console.log("Yo 1");
    const response = await axios({
      method: "post",
      url: "api1/API/v1.0/tweets/login",
      data: {
        userName: inputData.userName,
        password: inputData.password,
      },
    });
    console.log("Yo 2");
    
    if (response.data !== null && response.status !== 200) {
      showWarningToast(response.data.message);
    }
    console.log("Yo 3");
    if (response.data !== null && response.status === 200) {
      setResData(response.data);
      console.log(response.data);
      localStorage.setItem("userName", response.data.userName);
      localStorage.setItem("valid", response.data.valid);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("firstName",response.data.firstName);
      localStorage.setItem("lastName",response.data.lastName);
      console.log(response.data.token);
      console.log(response.headers.token);
      navigate("/home");
    }
    console.log("Yo 4");
  }
    catch(error){
      console.log(error.response)
      if(error.response.status===500){
        showWarningToast("Login Service Down");
      }
      else if(error.response.status===403){
        showWarningToast(error.response.data.token);
      }
      else
        showWarningToast(error.response.data.message); 
    }
  }

  function showWarningToast(inputMessage) {
    toast.warn(inputMessage, {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    console.log("toast");
  }

  return (
    <Container fluid className={styles.container}>
      <ToastContainer />
      <Formik
        validationSchema={schema}
        initialValues={{
          userName: "",
          password: "",
        }}
        onSubmit={(values, {setSubmitting}) => {
          postSignInInfo(values);
          setSubmitting(false);
        }}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          touched,
          isInValid,
          errors,
        }) => (
          <Form
            noValidate
            onSubmit={handleSubmit}
            className={styles.formContainer}
          >
            <Row className="mb-5 text-center">
              <h1>Sign In</h1>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="12" controlId="signInUsername">
                <Form.Label>Enter Username : </Form.Label>
                <Form.Control
                  type="email"
                  name="userName"
                  value={values.userName}
                  onChange={handleChange}
                  isInvalid={touched.userName && errors.userName}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid email
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="12" controlId="signInPassword">
                <Form.Label>Enter Password : </Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  isInvalid={touched.password && errors.password}
                />

                <Form.Control.Feedback type="invalid">
                  Please enter your password
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Button type="submit" variant="success">
              Sign In <RiLoginBoxLine />
            </Button>
            
          </Form>
        )}
      </Formik>
    </Container>
  );
}

export default SignIn;
