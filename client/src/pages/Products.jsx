import React, {useState, useEffect} from 'react'
import Header from '../components/header/Header'
import { Pagination, Container, Table, Button, Tab, Row, Col, Nav, Form, Alert, Modal, CloseButton} from 'react-bootstrap'
import ConfirmationModal from '../components/confirmationModal/ConfirmationModal'
import { BsTrash, BsPencil } from "react-icons/bs";
import {FaPencilAlt, FaTrash} from 'react-icons/fa'
import { BASE_URL, config } from '../globals/globals';
import axios from "axios"
import Footer from '../components/footer/Footer'
import _ from 'lodash'
export default function Products() {
    const [show, setShow] = useState(false);
    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [price, setPrice] = useState('')
    const [modalShow, setModalShow] = useState(false);
    const [updateShow, setUpdateShow] = useState(false)
    const [items, setItems] = useState([])

    const [sending, setSending] = useState(false)

    const [propName, setPropName] = useState('')
    const [propId, setPropId] = useState('')

    const [updateId, setUpdateId] = useState('')
    const [updateName, setUpdateName] = useState('')
    const [updateDesc, setUpdateDesc] = useState('')
    const [updatePrice, setUpdatePrice] = useState('')

    const [paginate, setPaginate] = useState([])
    const [currentPage, setCurrentPage] = useState(1)


    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true)
        const product = {
            product_name: name,
            product_desc: desc,
            product_price: price
        }
        await axios.post(`${BASE_URL}/api/products/add`, product, {
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
    const fetchItems = async () => {
        await axios.get(`${BASE_URL}/api/products/all`, {
            headers: config
        })
        .then(res=>{
            setItems(res.data)
            setPaginate(_(res.data).slice(0).take(pageSize).value())
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const handleDelete = async (e) => {
        e.preventDefault();
        setSending(true)
        const product ={id: propId}
        console.log(product)
        await axios.post(`${BASE_URL}/api/products/delete`,product , {
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

    const handleUpdateModal = (id, product_name, product_desc, product_price) => {
        setUpdateName(product_name)
        setUpdateDesc(product_desc)
        setUpdatePrice(product_price)
        setUpdateId(id)
        setUpdateShow(true);
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSending(true)
        const product = {
            id: updateId,
            product_name: updateName,
            product_desc: updateDesc,
            product_price: updatePrice
        }
        await axios.post(`${BASE_URL}/api/products/update`, product, {
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
        const paginatedItem = _(items).slice(startIndex).take(pageSize).value()
        setPaginate(paginatedItem)
    }

    const pageSize = 10;
    const pageCount = items? Math.ceil(items.length/pageSize):0;
    const pages = _.range(1, pageCount+1)

    useEffect(() => {
        fetchItems()
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
                            <Form.Label className="fw-bold">Name</Form.Label>
                            <Form.Control defaultValue={updateName} onChange={(e) => setUpdateName(e.target.value)} type="text" placeholder="Enter name"  />            
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Description</Form.Label>
                            <Form.Control defaultValue={updateDesc}  onChange={(e) => setUpdateDesc(e.target.value)} type="text" placeholder="Enter description"  />            
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Price</Form.Label>
                            <Form.Control defaultValue={updatePrice}  onChange={(e) => setUpdatePrice(e.target.value)} type="number" placeholder="₱ 0.00"  />            
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
                            <h1>Products</h1>
                        </div>
                        <Nav variant="pills" className="flex-row">
                            <Nav.Item>
                            <Nav.Link eventKey="first">Stocks</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                            <Nav.Link eventKey="second">Add Product</Nav.Link>
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
                                            <th>Product Name</th>
                                            <th>Description</th>
                                            <th>Price</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginate.map((item, index) => 
                                            <tr>
                                            <td className="align-middle">{index+1}</td>
                                            <td className="align-middle">{item.product_name}</td>
                                            <td className="align-middle">{item.product_desc}</td>
                                            <td className="align-middle">₱ {item.product_price}</td>
                                            <td className="align-middle">{formatDate(item.date_created)}</td>
                                            <td className="align-middle">
                                                <button className="action-btn-edit" onClick={e => {e.preventDefault(); handleUpdateModal(item._id, item.product_name, item.product_desc, item.product_price)}} ><FaPencilAlt/></button>{' '}
                                                <button className="action-btn-delete" variant="danger" onClick={e => {e.preventDefault(); handleModal(item._id, item.product_name);}}><FaTrash/></button>
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
                                        <Form.Label className="fw-bold">Product Name</Form.Label>
                                        <Form.Control onChange = {e => setName(e.target.value)} type="text" placeholder="Name"  />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Price</Form.Label>
                                        <Form.Control onChange = {e => setPrice(e.target.value)} type="number" min={1} placeholder="Price ₱"  />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Description</Form.Label>
                                        <Form.Control onChange = {e => setDesc(e.target.value)} as="textarea" rows={3} placeholder="Description"/>
                                    </Form.Group>
                                    <Form.Group className="mb-3 d-flex justify-content-between" controlId="formBasicCheckbox">

                                    </Form.Group>
                                    <div className="d-grid gap-2 d-flex flex-row">
                                        <Button type="submit" variant="primary" size="lg">
                                            Add Product
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
