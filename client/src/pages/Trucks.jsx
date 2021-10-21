import React, {useState, useEffect} from 'react'
import Header from '../components/header/Header'
import { Pagination, Container, Table, Button,Tab, Row, Col, Nav, Form, Alert, Modal, CloseButton} from 'react-bootstrap'
import axios from "axios"
import { BsTrash,  BsPencil} from "react-icons/bs";
import { BASE_URL, config } from '../globals/globals';
import {FaPencilAlt, FaTrash} from 'react-icons/fa'
import ConfirmationModal from '../components/confirmationModal/ConfirmationModal'
import _ from 'lodash'
export default function Trucks() {
    const [propName, setPropName] = useState('')
    const [propId, setPropId] = useState('')
    const [modalShow, setModalShow] = useState(false);
    const [updateShow, setUpdateShow] = useState(false)
    const [show, setShow] = useState(false);
    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [type, setType] = useState('')
    const [trucks, setTrucks] = useState([])
    const [sending, setSending] = useState(false)

    const [updateId, setUpdateId] = useState('')
    const [updateCode, setUpdateCode] = useState('')
    const [updateType, setUpdateType] = useState('')
    const [updateDesc, setUpdateDesc] = useState('')

    const [paginate, setPaginate] = useState([])
    const [currentPage, setCurrentPage] = useState(1)


    const handleSubmit = async (e) =>{
        e.preventDefault();
        setSending(true)
        const truck = {
            truck_code: name,
            truck_desc: desc,
            type: type
        }
        await axios.post(`${BASE_URL}/api/trucks/add`, truck , {
            headers:config
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
    const fetchTrucks = async () => {
        await axios.get(`${BASE_URL}/api/trucks/all`, {
            headers: config
        })
        .then(res=>{
            setTrucks(res.data)
            setPaginate(_(res.data).slice(0).take(pageSize).value())
        })
        .catch(err=>{
            console.log(err)
        })
    }
    const handleModal = (id, name) => {
  
        setPropId(id)
        setPropName(name)
        setModalShow(true)
    }

    const handleDelete = async (e) => {
        e.preventDefault();
        setSending(true)
        const product ={id: propId}
        console.log(product)
        await axios.post(`${BASE_URL}/api/trucks/delete`,product , {
            headers: config
        })
        .then(res=> {
            setSending(false)
            console.log(res)
        })
        .catch(err => {
            console.log(err)
        })
    }

    const handleUpdateModal = (id, code, type, desc) => {
        setUpdateCode(code)
        setUpdateType(type)
        setUpdateDesc(desc)
        setUpdateId(id)
        setUpdateShow(true)
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSending(true)
        const truck = {
            id: updateId,
            truck_code: updateCode,
            type: updateType,
            truck_desc: updateDesc
        }
        console.log(truck)
        await axios.post(`${BASE_URL}/api/trucks/update`, truck, {
            headers:config
        })
        .then(res => {
            console.log(res)
            setSending(false)
        })
        .catch(err => {
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
        const paginatedItem = _(trucks).slice(startIndex).take(pageSize).value()
        setPaginate(paginatedItem)
    }
    const pageSize = 10;
    const pageCount = trucks? Math.ceil(trucks.length/pageSize):0;
    const pages = _.range(1, pageCount+1)

    useEffect(() => {
        fetchTrucks()
    },[sending])

    return (
        <>
        <Header/>
        <Container className="pt-5">
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
                    <CloseButton onClick={() => setModalShow(false)} />
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
                            <Form.Label className="fw-bold">Truck code</Form.Label>
                            <Form.Control defaultValue={updateCode} onChange={e => setUpdateCode(e.target.value)} type="text" placeholder="Truck code"  />            
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Type</Form.Label>
                            <Form.Control defaultValue={updateType} onChange={e => setUpdateType(e.target.value)} type="text" placeholder="Enter type"  />            
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Descrption</Form.Label>
                            <Form.Control defaultValue={updateDesc} onChange={e => setUpdateDesc(e.target.value)} type="text" as="textarea" rows={2} placeholder="Enter description"  />            
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
                            <h1>Trucks</h1>
                        </div>
                        <Nav variant="pills" className="flex-row">
                            <Nav.Item>
                            <Nav.Link eventKey="first">Stocks</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                            <Nav.Link eventKey="second">Add Vehicle</Nav.Link>
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
                        <th>Truck Code</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginate.map((truck, index) => 
                        <tr>
                        <td className="align-middle">{index+1}</td>
                        <td className="align-middle">{truck.truck_code}</td>
                        <td className="align-middle">{truck.type}</td>
                        <td className="align-middle">{truck.truck_desc}</td>
                        <td className="align-middle">{formatDate(truck.date_created)}</td>
                        <td className="align-middle">
                            <button className="action-btn-edit" onClick={e => {e.preventDefault(); handleUpdateModal(truck._id, truck.truck_code, truck.type, truck.truck_desc)}}><FaPencilAlt/></button>{' '}
                            <button className="action-btn-delete" onClick={e => {e.preventDefault(); handleModal(truck._id, truck.truck_code);}}><FaTrash/></button>
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
                                    <Form.Label className="fw-bold">Truck Name</Form.Label>
                                    <Form.Control onChange = {e => setName(e.target.value)} type="text" placeholder="Name"  />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Type</Form.Label>
                                    <Form.Control onChange = {e => setType(e.target.value)} type="text" placeholder="Type"  />
                                </Form.Group>

                               
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Description</Form.Label>
                                    <Form.Control onChange = {e => setDesc(e.target.value)} as="textarea" rows={3} placeholder="Description"/>
                                </Form.Group>
                                <Form.Group className="mb-3 d-flex justify-content-between" controlId="formBasicCheckbox">

                                </Form.Group>
                                <div className="d-grid gap-2 d-flex flex-row">
                                    <Button type="submit" variant="primary" size="lg">
                                        Add Truck
                                    </Button>
                                </div>
                            </Form>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        
  
            
        </Container>
        </>
    )
}
