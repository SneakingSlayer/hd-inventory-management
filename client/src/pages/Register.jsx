import React, {useRef, useContext, useState}from 'react'
import {Context} from '../context/Context'
import { Container, Button, Form, Col, Row, Navbar, Alert} from 'react-bootstrap'
import {useHistory } from 'react-router-dom'
import logo from '../assets/images/hd-lgo.svg'
import './login.css'
import Header from '../components/header/Header'
import axios from 'axios'
import { BASE_URL, config } from '../globals/globals'
export default function Login() {

    const [firstname, setFirstName] = useState('')
    const [lastname, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false) 
    const [success, setSuccess] = useState(false)
    const history = useHistory()
    const {user, dispatch, isFetching} = useContext(Context)
    const handleSubmit = async (e) =>{
        e.preventDefault();
        const user={
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password
        }
        await axios.post(`${BASE_URL}/api/register`, user, {
            headers:config
        })
        .then(res => {
            //history.push('/login')
            setSuccess(true)
        })
        .catch(err=>{
            setError(true)
            console.log(err)
        })
    }
    if(user !== null)
        history.push('/dashboard')
    return (
        <>

        <Container className="vh-100 d-flex flex-column justify-content-between">
            <Navbar fixed>
                <Container>
                    <Navbar.Brand href="/">
                        <img src={logo} height="50px"/>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                    <Button>Create an account</Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Row className=" d-flex  align-items-center justify-content-center">
                
                <Col  className="d-flex align-items-center justify-content-center">
                    <div  style={{width:"50%"}} className="ps-5 pe-5 d-flex flex-column justify-content-between">
                        <div></div>
                        <div>
                            <h1>Register</h1>
                            <p className="text-muted">Fill up the form to register.</p>
                            {error? <Alert variant="danger" onClose={() => setError(false)} dismissible>
                                    <Alert.Heading>
                                        Registration failed!
                                    </Alert.Heading>
                                    <p>
                                        Email already exists.
                                    </p>
                                </Alert> : null}
                            {success? <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
                                <Alert.Heading>
                                    Registration Successful!
                                </Alert.Heading>
                                <p>
                                    Please wait for confirmation.
                                </p>
                                </Alert> : null}
                            <Form onSubmit={handleSubmit} className="pt-4" >
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">First name</Form.Label>
                                    <Form.Control onChange={(e) => setFirstName(e.target.value)} type="text" placeholder="First name"  />
                                </Form.Group>
                                
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Last name</Form.Label>
                                    <Form.Control onChange={(e) => setLastName(e.target.value)} type="text" placeholder="Last name"  />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label className="fw-bold">Email address</Form.Label>
                                    <Form.Control onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter email"  />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label className="fw-bold">Password</Form.Label>
                                    <Form.Control onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
                                </Form.Group>
                                
                                <div className="d-grid gap-2 mt-4">
                                    <Button type="submit" variant="primary" size="lg">
                                       Register
                                    </Button>
                                </div>
                                <div className="mt-3">
                                    <span className="text-muted">
                                        Already have an account? {' '} 
                                        <a href="/login">Sign in here.</a>
                                    </span>
                                </div>
                            </Form>
                        </div>
                        
                    </div>
                </Col>

                
            </Row>
            <div className="mb-4 text-center">
                <span className="text-muted small">© 2021 HighDef Supply and Serivces Corp. All rights Reserved</span>
            </div>
        </Container>
        
        </>
    )
}
