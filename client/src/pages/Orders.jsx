import React, {useState, useEffect} from 'react'
import Header from '../components/header/Header'
import { Container, Table, Button,Col, Row, Form, Modal, Badge, CloseButton, Pagination} from 'react-bootstrap'
import FormModal from '../components/formModal/FormModal'
import { BsTrash, BsFillFileSpreadsheetFill } from "react-icons/bs";
import { BASE_URL, config } from '../globals/globals'
import {useHistory} from 'react-router-dom'
import axios from 'axios'
import {FaPencilAlt, FaTrash, FaArrowRight} from 'react-icons/fa'
import _ from 'lodash'
export default function Orders() {
    const [modalShow, setModalShow] = useState(false);
    const [deleteShow, setDeleteShow] = useState(false)
    const [clients, setClients] = useState([])
    const [name, setName] = useState('')
    const [code, setCode] = useState('')
    const [sending, setSending] = useState(false)
    const [propName, setPropName] = useState('')
    const [propId, setPropId] = useState('')
    const [orders, setOrders] = useState([])
    const history = useHistory();

    const [paginate, setPaginate] = useState([])
    const [currentPage, setCurrentPage] = useState(1)

    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    const fetchClients = async () => {
        await axios.get(`${BASE_URL}/api/clients`, {
            headers:config
        })
        .then(res => {
            setClients(res.data)
            setPaginate(res.data)
        })
        .catch(err => {
            console.log(err)
        })
    }
    const orderCode = () => {
        const code = Math.floor(Math.random() * 100000000000);
        return code
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSending(true)
        console.log('i am clicked')
        const client = {
            order_code: code,
            client_name: name,
            project_total: '0',
            project_status: 'Pending'
        }

        console.log(client)
        
        await axios.post(`${BASE_URL}/api/clients`, client, {
            headers: config
        })
        .then(res => {
            console.log(res)
            setSending(false)
            history.push(`/orders/client/${code}`)
        })
        .catch(err => {
            console.log(err)
        })
    }

    const handleModal = (e) =>{
        e.preventDefault();
        setModalShow(true)
        setCode(orderCode())
    }
    const handleDeleteShow = (name, id) => {
        setDeleteShow(true)
        setPropName(name)
        setPropId(id)

    }

    const handleDeleteSubmit = async (e) => {
        e.preventDefault();
        setSending(true)
        const client = {
            order_code: propId
        }
        console.log(propId)
        await axios.post(`${BASE_URL}/api/clients/delete`, client, {
            headers: config
        })
        .then(res => {
            setSending(false)
        })
        .catch(err => {
            console.log(err)
        })

        const clientCode = {
            order_code: propId
        }
        console.log(propId)
        await axios.post(`${BASE_URL}/api/client/orders/delete`, clientCode, {
            headers: config
        })
        .then(res => {
            setSending(false)
            console.log("Orders deleted")
        })
        .catch(err => {
            console.log(err)
        })
    }

    const fetchOrders = async () => {
        await axios.get(`${BASE_URL}/api/all/orders`, {
            headers:config
        })
        .then(res=>{
            setOrders(res.data)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const getCost = (id) => {
        let sum = 0
        orders.filter(order => order.order_code === id).map(ord => {
            sum += parseFloat(ord.price)
        })
     /**   orders.map(order => {
            sum += parseFloat(order.price)   
        })*/ 
        return sum.toFixed(2);
    }

    const formatDate = (res_date) => {
        const date = new Date(res_date)
        const formatted = date.getFullYear() +"-"+ (date.getMonth()+1)+"-"+date.getDate()
        return (formatted.toString())
    }

    const badgeColor = (status) => {
        if(status === "Completed")
            return "success"
        if(status === "Pending")
            return "secondary"
    }

    useEffect(() => {
        fetchClients()
        fetchOrders()
        
    }, [sending])


    const pagination = (pageNo) => {
        setCurrentPage(pageNo)
        const startIndex = (pageNo - 1) *pageSize
        const paginatedItem = _(clients).slice(startIndex).take(pageSize).value()
        setPaginate(paginatedItem)
    }

    const pageSize = 10;
    const pageCount = clients? Math.ceil(clients.length/pageSize):0;
    const pages = _.range(1, pageCount+1)

    return (
        <>
        <Header/>
        <Container className="pt-5">
          {/**   <FormModal
            show={modalShow}
            code={orderCode()}
            onHide={() => setModalShow(false)}
            />*/}
        <Modal
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={deleteShow}
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                    <BsTrash/>
                    </Modal.Title>
                    <CloseButton  onClick={() => setDeleteShow(false)} />
                </Modal.Header>
                <Modal.Body>
                    <h4>Delete {propName}</h4>
                    <p>This action cannot be undone.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setDeleteShow(false)} variant="outline-secondary">Cancel</Button>
                    <form onSubmit={handleDeleteSubmit}>
                        <Button type="submit" onClick={() => setDeleteShow(false)} variant="danger">Delete</Button>
                    </form>
                </Modal.Footer>
            </Modal>
        <Modal
        show={modalShow}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
        <Modal.Header >
            <Modal.Title id="contained-modal-title-vcenter">
            Add a New Client
            </Modal.Title>
            <CloseButton onClick={() => setModalShow(false)} />
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Order Code</Form.Label>
                    <Form.Control disabled type="text" placeholder={orderCode()} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Client</Form.Label>
                    <Form.Control onChange={e => setName(e.target.value)} type="text" placeholder="Client Name" />
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button   onClick={() => setModalShow(false)} variant="outline-secondary">Cancel</Button>
            <Button onClick={handleSubmit} type="submit" >Save</Button>
        </Modal.Footer>
        </Modal>

            <Row className="mb-3 d-flex flex-row justify-content-between align-items-center">
                <Col> 
                    <h1>Clients</h1>
                </Col>
                <Col className="d-flex justify-content-end"> 
                    <Button onClick={handleModal}>New client</Button>
                </Col>
            </Row>
            <Table bordered responsive="sm">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Order Code</th>
                        <th>Client</th>
                        <th>Project cost</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    
                        {
                            paginate.map((client, index) => 
                            <tr>
                            <td className="align-middle">{index+1}</td>
                            <td className="align-middle">{client.order_code}</td>
                            <td className="align-middle">{client.client_name}</td>
                            
                            <td className="align-middle">₱ {numberWithCommas(getCost(client.order_code))}</td>
                            <td className="align-middle">{formatDate(client.date_created)}</td>
                            <td className="align-middle text-center">
                               <Badge style={{width:"60%", padding: "7px"}} bg={badgeColor(client.project_status)}>{client.project_status}</Badge>
        
                            </td>
                            <td className="align-middle">

                                <a className="action-btn-edit" href={`/orders/client/${client.order_code}`}><FaArrowRight/></a>{' '}
                                <button className="action-btn-delete" onClick={() => handleDeleteShow(client.client_name, client.order_code)}><FaTrash/></button>
                            </td>
                            </tr>
                            )
                        
                            
                        }
                        
                    
            
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
        </Container>
        </>
    )
}
