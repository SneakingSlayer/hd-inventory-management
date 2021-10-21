import React, {useState, useEffect} from 'react'
import Header from '../components/header/Header'
import { Container, Table, Button, Tab, Row, Col, Nav, Form, Alert, Modal, CloseButton, Pagination} from 'react-bootstrap'
import ConfirmationModal from '../components/confirmationModal/ConfirmationModal'
import { BsTrash, BsPencil } from "react-icons/bs";
import {FaPencilAlt, FaTrash} from 'react-icons/fa'
import { BASE_URL, config } from '../globals/globals';
import axios from "axios"
import Footer from '../components/footer/Footer'
import _ from 'lodash'
export default function Employees() {
    const [show, setShow] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [updateShow, setUpdateShow] = useState(false)
    const [emps, setEmps] = useState([])

    const [sending, setSending] = useState(false)

    const [propName, setPropName] = useState('')
    const [propId, setPropId] = useState('')

    const [updateId, setUpdateId] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [bday, setBday] = useState('')
    const [role, setRole] = useState('')
    const [status, setStatus] = useState('')

    const [paginate, setPaginate] = useState([])
    const [currentPage, setCurrentPage] = useState(1)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true)
        const employee = {
            firstname: firstName,
            lastname: lastName,
            birthdate: bday,
            role: role,
            status: status,
        }
        await axios.post(`${BASE_URL}/api/employees`, employee, {
            headers: config
        })
        .then(res => {
            setShow(true)
            setSending(false)
            console.log(res.data)
        })
        .catch(err => {
            console.log(err)
        })
    }
    const handleModal = (id, name) => {

        setPropId(id)
        setPropName(name)
        setModalShow(true)
    }
    const fetchEmps = async () => {
        await axios.get(`${BASE_URL}/api/employees`, {
            headers: config
        })
        .then(res=>{
            setEmps(res.data)
            setPaginate(_(res.data).slice(0).take(pageSize).value())
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const handleDelete = async (e) => {
        e.preventDefault();
        setSending(true)
        await axios.delete(`${BASE_URL}/api/employees`, {data: {id: propId}}, {
            headers: config
        })
        .then(res=> {
            setSending(false)
            console.log(res)
            console.log("yawa")
        })
        .catch(err => {
            console.log(err)
            console.log("piste")
        })
    }

    const handleUpdateModal = (id, firstname, lastname, bday, role, status) => {
        setUpdateId(id)
        setFirstName(firstname)
        setLastName(lastname)
        setBday(bday)
        setRole(role)
        setStatus(status)
        setUpdateShow(true);
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSending(true)
        const emp = {
            firstname: firstName, 
            lastname: lastName, 
            birthdate: bday, 
            role: role, 
            status: status
        }
        await axios.post(`${BASE_URL}/api/employees/${updateId}`, emp, {
            headers: config
        })
        .then(res=>{
            setSending(false)
            console.log(res)
        })
        .catch(err=>{
            console.log(err)
        })

    }

    const formatDate = (res_date) => {
        const date = new Date(res_date)
        const formatted = date.getFullYear() +"-"+ (date.getMonth()+1)+"-"+date.getDate()
        return (formatted.toString())
    }

    const pagination = (pageNo) => {
        setCurrentPage(pageNo)
        const startIndex = (pageNo - 1) *pageSize
        const paginatedItem = _(emps).slice(startIndex).take(pageSize).value()
        setPaginate(paginatedItem)
    }

    const pageSize = 10;
    const pageCount = emps? Math.ceil(emps.length/pageSize):0;
    const pages = _.range(1, pageCount+1)

    useEffect(() => {
        fetchEmps()
    }, [sending]);



    return (
        <>
        <Header/>
        
        <Container className="pt-5">
          {/**  <ConfirmationModal
            route="products"
            id={propId}
            name={propName}
            show={modalShow}
            onHide={() => setModalShow(false)}
            />*/}

            <Modal
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={modalShow}
            >
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter">
                    <BsTrash/>
                    </Modal.Title>
                    <CloseButton onClick={() => setModalShow(false)}/>
                </Modal.Header>
                <Modal.Body>
                    <h4>Delete {propName}</h4>
                    <p>This action cannot be undone.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setModalShow(false)} variant="outline-secondary">Cancel</Button>
                    <form onSubmit={handleDelete}>
                        <Button type="submit" onClick={() => setModalShow(false)} variant="danger">Delete</Button>
                    </form>
                </Modal.Footer>
            </Modal>
            
            <Modal
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={updateShow}
            >
                <Modal.Header className="d-flex justify-content-between">
                    <Modal.Title id="contained-modal-title-vcenter">
                        <BsPencil/>
                    
                    </Modal.Title>
                    <span>Update</span>
                    <CloseButton onClick={() => setUpdateShow(false)}/>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">First Name</Form.Label>
                            <Form.Control defaultValue={firstName} onChange={e => setFirstName(e.target.value)} type="text" placeholder="Enter name"  />            
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Last Name</Form.Label>
                            <Form.Control  defaultValue={lastName} onChange={e => setLastName(e.target.value)} type="text" placeholder="Enter description"  />            
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Birthdate</Form.Label>
                            <Form.Control  defaultValue={bday} onChange={e => setBday(e.target.value)} type="date"  />            
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Role</Form.Label>
                            <Form.Control defaultValue={role} onChange={e => setRole(e.target.value)} type="text" placeholder="Enter description"  />            
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Status</Form.Label>
                            <Form.Select defaultValue={status} onChange={e => setStatus(e.target.value)} aria-label="Default select example">
                                <option>Select status</option>
                                <option value="Employed">Employed</option>   
                                <option value="Suspended">Suspended</option>  
                                <option value="Retired">Retired</option>  
                                <option value="Unemployed">Unemployed</option>        
                            </Form.Select>
                        </Form.Group>
                     
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setUpdateShow(false)} variant="outline-secondary">Cancel</Button>
                    <form onSubmit={handleUpdate}>
                        <Button type="submit" onClick={() => setUpdateShow(false)} variant="warning">Update</Button>
                    </form>
                </Modal.Footer>
            </Modal>


            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                <Row className="flex-column">
                    <Col className="mb-3 d-flex flex-row justify-content-between align-items-center"> 
                        <div>
                            <h1>Employees</h1>
                        </div>
                        <Nav variant="pills" className="flex-row">
                            <Nav.Item>
                            <Nav.Link eventKey="first">Employees</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                            <Nav.Link eventKey="second">Add Employee</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col>
                        <Tab.Content>
                            <Tab.Pane eventKey="first">
                                <Table bordered responsive="sm">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>Birthdate</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Date created</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginate.map((emp, index) => 
                                            <tr>
                                            <td className="align-middle">{index+1}</td>
                                            <td className="align-middle">{emp.firstname}</td>
                                            <td className="align-middle">{emp.lastname}</td>
                                            <td className="align-middle">{emp.birthdate}</td>
                                            <td className="align-middle">{emp.role}</td>
                                            <td className="align-middle">{emp.status}</td>
                                            <td className="align-middle">{formatDate(emp.date_created)}</td>
                                            <td className="align-middle">
                                                <button className="action-btn-edit" onClick={e => {e.preventDefault(); handleUpdateModal(emp._id, emp.firstname, emp.lastname, emp.birthdate, emp.role, emp.status)}} ><FaPencilAlt/></button>{' '}
                                                <button className="action-btn-delete" variant="danger" onClick={e => {e.preventDefault(); handleModal(emp._id, emp.product_name);}}><FaTrash/></button>
                                            </td>

                                        </tr>
                                            )}
                                    </tbody>
                                </Table>
                                <div className="d-flex justify-content-between">
                                <span className="page-number display-9" >Page {currentPage} of {pages.length} </span>
                                <Pagination>
                                    {pages.map(page =>
                                        <li className={page === currentPage? "page-item active" : "page-item"}>
                                            <p className="page-link" role="button" onClick={() => pagination(page)}>{page}</p>
                                        </li>
                                        )}
                                </Pagination>
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="second">
                                {show? <Alert variant="success" onClose={() => setShow(false)} dismissible>
                                    <Alert.Heading>
                                        Product Saved Successfully!
                                    </Alert.Heading>
                                    <p>
                                        You can view the saved changes on the stocks tab.
                                    </p>
                                </Alert> : null}
                                <Form onSubmit={handleSubmit} className="pt-4" >
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">First Name</Form.Label>
                                        <Form.Control onChange = {e => setFirstName(e.target.value)} type="text" placeholder="Name"  />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Last Name</Form.Label>
                                        <Form.Control onChange = {e => setLastName(e.target.value)} type="text" placeholder="Name"  />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Birthdate</Form.Label>
                                        <Form.Control onChange = {e => setBday(e.target.value)} type="date" placeholder="Name"  />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Role</Form.Label>
                                        <Form.Control onChange = {e => setRole(e.target.value)} type="text" placeholder="Name"  />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Status</Form.Label>
                                        <Form.Select onChange = {e => setStatus(e.target.value)} aria-label="Default select example">
                                            <option>Select status</option>
                                            <option value="Employed">Employed</option>   
                                            <option value="Suspended">Suspended</option>  
                                            <option value="Retired">Retired</option>  
                                            <option value="Unemployed">Unemployed</option>        
                                        </Form.Select>
                                    </Form.Group>
                                    
                                    <div className="d-grid gap-2 d-flex flex-row">
                                        <Button type="submit" variant="primary" size="lg">
                                            Add Employee
                                        </Button>
                                    </div>
                                </Form>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
            <Footer/>
        </Container>
        
        </>
    )
}
