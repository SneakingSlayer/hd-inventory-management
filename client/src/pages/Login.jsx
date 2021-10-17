import React, {useRef, useContext, useState}from 'react'
import { Container, Button, Form, Col, Row, Navbar, Alert, Card} from 'react-bootstrap'
import logo from '../assets/images/hd-lgo.svg'
import './login.css'
import Header from '../components/header/Header'
import {Context} from '../context/Context'
import axios from 'axios'
import { BASE_URL, config } from '../globals/globals'
import {useHistory} from 'react-router-dom'
export default function Login() {
    const [error, setError] = useState(false)
    const emailRef = useRef()
    const passwordRef = useRef()
    const history = useHistory()
    const [ver, setVer] = useState()
    const {user, dispatch, isFetching} = useContext(Context)

    const handleAlert = () => {
        if(ver === '' || ver === null || ver === undefined)
            return 
        if(ver === false)
            return (
                <Alert variant="danger" onClose={() => setVer(false)} dismissible>
                    <Alert.Heading>
                        Login failed!
                    </Alert.Heading>
                    <p>
                        It seems that this account has not been verified yet.
                    </p>
                </Alert>

            )
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = {
            email: emailRef.current.value,
            password: passwordRef.current.value
        }
        dispatch({type:"LOGIN_START"})
        await axios.post(`${BASE_URL}/api/login`, user, {
            headers:config
        })
        .then(res=> {
            dispatch({type:"LOGIN_SUCCESS", payload:res.data})
            if(res.data.isVerified === true){
                history.push('/dashboard')
            }
            else{
                setVer(false)
                console.log("not verified")
            }
            
        })
        .catch(err =>{
            dispatch({type:"LOGIN_FAILED"})
            setError(true)
        })


    }

    if(user !== null && user.verified === true)
        history.push('/dashboard')
    
    return (
        <>
        <Container className="vh-100 d-flex flex-column justify-content-between">
            <div></div>
            <Row className=" d-flex  align-items-center justify-content-center">
                
                <Col  className="d-flex align-items-center justify-content-center">
                    <div  style={{width:"500px"}} className=" d-flex flex-column justify-content-between">
                        <div></div>
                            <Card style={{borderRadius: "15px", padding:"20px"}}>
                            
                                <Card.Body>
                                    <div className="text-center">
                                        <img src={logo} height="100px"/>
                                        <h2 className="pt-3">Welcome Back!</h2>
                                        <p className="text-muted small">Please login to your account.</p>
                                        {handleAlert()}
                                        {error? <Alert variant="danger" onClose={() => setError(false)} dismissible>
                                                <Alert.Heading>
                                                    Login failed!
                                                </Alert.Heading>
                                                <p>
                                                    Incorrect credentials.
                                                </p>
                                            </Alert> : null}
                                    </div>
                                    <Form onSubmit={handleSubmit} className="pt-4" >
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label className="fw-bold">Email address</Form.Label>
                                            <Form.Control ref={emailRef} type="email" placeholder="Enter email"  />
                                            
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="formBasicPassword">
                                            <Form.Label className="fw-bold">Password</Form.Label>
                                            <Form.Control ref={passwordRef} type="password" placeholder="Password" />
                                        </Form.Group>
                                        <Form.Group className="mb-3 d-flex justify-content-between" controlId="formBasicCheckbox">
                                            <Form.Check className="text-muted small" type="checkbox" label="Remember me?" />
                                            <a className="small" href="/">Forgot password?</a>
                                        </Form.Group>
                                        <div className="d-grid gap-2">
                                            <Button type="submit" variant="primary" size="lg">
                                                Login
                                            </Button>
                                        </div>
                                        <div className="mt-3 text-center">
                                            <span className="text-muted">
                                                Don't have an account? {' '} 
                                                <a href="/register">Sign up here.</a>
                                            </span>
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        
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
