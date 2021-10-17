import React, {useState, useEffect} from 'react'
import Header from '../components/header/Header'
import { Container, Table, Button,Col, Row, Form, Nav, Tab, Modal, Alert, Badge, Pagination} from 'react-bootstrap'
import axios from 'axios'
import { BsTrash, BsPencil} from "react-icons/bs";
import { BASE_URL, config } from '../globals/globals'
import { useHistory } from 'react-router-dom';
import {FaPencilAlt, FaTrash} from 'react-icons/fa'
import _ from 'lodash'
export default function ViewOrder(props) {
    const [alert, setAlert] = useState(false)
    const [orders, setOrders] = useState([])
    const [sending, setSending] = useState(false)
    const [client, setClient] = useState([])
    const [trucks, setTrucks] = useState([])
    const [products, setProducts] = useState([])
    const [modalShow, setModalShow] = useState(false)
    const [item, setItem] = useState('')
    const [truck, setTruck] = useState('')
    const [propId, setPropId] = useState('')
    const [propName, setPropName] = useState('')
    const [total, setTotal] = useState('')
    const [updateShow, setUpdateShow] = useState(false)
    const orderCode = props.match.params.id
    const history = useHistory();
    const [updateId, setUpdateId] = useState('')
    const [newOrder, setNewOrder] = useState([])
    const [found, setFound] = useState(true)
    const [status, setStatus] = useState('')


    const [paginate, setPaginate] = useState([])
    const [currentPage, setCurrentPage] = useState(1)

    const updateTotal = () => {
        let sum = 0
        orders.map(order => {
            sum += parseFloat(order.price)   
        })
        return sum.toFixed(2);
    }
    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    const fetchOrders = async () => {
        await axios.get(`${BASE_URL}/api/orders/${orderCode}`, {
            headers:config
        })
        .then(res=>{
            setOrders(res.data)
            setPaginate(_(res.data).slice(0).take(pageSize).value())
        })
        .catch(err=>{
            console.log(err)
        })
    }
    const fetchClient = async () => {
        await axios.get(`${BASE_URL}/api/clients/${orderCode}`, {
            headers: config
        })
        .then(res => {
           // console.log(res.data)
            setClient(res.data)
            setStatus(res.data.project_status)
            
        })
        .catch(err => {
            setFound(false)
            console.log(err)
        })
    }
    const fetchTrucks = async () => {
        await axios.get(`${BASE_URL}/api/trucks/all`, {
            headers: config
        })
        .then(res => {
            setTrucks(res.data)
        })
        .catch(err => {
            console.log(err)
        })
    }
    const fetchProducts = async () => {
        await axios.get(`${BASE_URL}/api/products/all`, {
            headers: config
        })
        .then(res => {
            setProducts(res.data)
        })
        .catch(err => {
            console.log(err)
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true)

        const filteredPrice = products.filter(product => product.product_name == item).map(filtered => filtered.product_price)
        const order = {
            order_code: orderCode,
            client_name: client.client_name,
            item: item,
            truck: truck,
            price: filteredPrice[0]
        }

        await axios.post(`${BASE_URL}/api/orders`, order, {
            headers:config
        })
        .then(res => {
            setSending(false)
            setAlert(true)
        }) 
        .catch(err => {
            console.log(err)
        })

        const updateClient = {
            order_code: orderCode,
            total: (parseFloat(updateTotal())+parseFloat(order.price)).toString()
        }
        console.log(client)
       await axios.post(`${BASE_URL}/api/clients/update`, updateClient, {
            headers:config
        })
        .then(res => {
            setSending(false)
           // history.push('/orders')
        })
        .catch(err => {
            console.log(err)
        })


    }
    const handleDelete = async (e) => {
        e.preventDefault();
        setSending(true)

        const product ={id: propId}
        await axios.post(`${BASE_URL}/api/orders/delete`,product , {
            headers: config
        })
        .then(res=> {
            setSending(false)
            console.log(res)
        })
        .catch(err => {
            console.log(err)
        })
   
        const currentPrice = orders.filter(product => product._id == propId).map(filtered => filtered.price)
        const parseCurrent = parseFloat(currentPrice)
        const parseTotal = parseFloat(updateTotal())
   
        const updatedValue = (parseTotal - parseCurrent).toString()

        const updateClient = {
            order_code: orderCode,
            total: updatedValue
        }
        await axios.post(`${BASE_URL}/api/clients/update`, updateClient, {
            headers:config
        })
        .then(res=>{

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
    const handleUpdateModal = (id) => {
        setUpdateId(id)
        setUpdateShow(true)
    }
    const handleUpdate = async (e) => {
        e.preventDefault();
        setSending(true)
        const currentPrice = orders.filter(product => product._id == updateId).map(filtered => filtered.price)
        const filteredPrice = products.filter(product => product.product_name == item).map(filtered => filtered.product_price)
        const order = {
            id: updateId,
            truck: truck,
            item: item,
            price: filteredPrice[0]
        }
        await axios.post(`${BASE_URL}/api/orders/update`, order, {
            headers:config
        })
        .then(res => {
            setSending(false)
        })
        .catch(err => {
            console.log(err)
        })

        let updatedValue = ''
        const currentParsed = parseFloat(currentPrice[0])
        const filteredParsed = parseFloat(filteredPrice[0])

        if(currentParsed > filteredParsed){
            updatedValue = ((parseFloat(updateTotal()) - currentParsed)+(filteredParsed)).toString()
        }
        if(currentParsed < filteredParsed){
            updatedValue = ((parseFloat(updateTotal())+filteredParsed)-(currentParsed)).toString()
        }
        if(currentParsed === filteredParsed){
            updatedValue = (parseFloat(updateTotal())).toString()
        }
        const updateClient = {
            order_code: orderCode,
            total: updatedValue
        }
        await axios.post(`${BASE_URL}/api/clients/update`, updateClient, {
            headers:config
        })
        .then(res=>{

        })
        .catch(err=>{
            console.log(err)
        })
    }
    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        setSending(true)
        const client = {
            order_code: orderCode,
            status: "Completed"
        }
        await axios.post(`${BASE_URL}/api/clients/update/status`, client, {
            headers: config
        })
        .then(res => {
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
    const print = async () =>{
       window.print()   

    }

    const completeBtn = () => {
        if(client.project_status==="Pending")
            return <Button onClick={handleUpdateStatus}>Complete Project</Button>
        if(client.project_status==="Completed")
            return <Button disabled onClick={handleUpdateStatus}>Complete Project</Button>
    }
    useEffect(() => {
        fetchClient()
        fetchTrucks()
        fetchProducts()
        fetchOrders()
        setStatus(client.project_status)
    }, [sending]) 

    const badgeColor = (stat) => {
        if(stat === "Completed")
            return "success"
        if(stat === "Pending")
            return "secondary"
    }

    const pagination = (pageNo) => {
        setCurrentPage(pageNo)
        const startIndex = (pageNo - 1) *pageSize
        const paginatedItem = _(orders).slice(startIndex).take(pageSize).value()
        setPaginate(paginatedItem)
    }

    const pageSize = 10;
    const pageCount = orders? Math.ceil(orders.length/pageSize):0;
    const pages = _.range(1, pageCount+1)


    return (
        <>
        <div style={{display:"none"}} id="tobol">Tobol</div>
        <Header/>
        <Container className="pt-5">
            <Modal
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={modalShow}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                    <BsTrash/>
                    </Modal.Title>
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
                    <button onClick={() => setUpdateShow(false)} type="button" class="btn-close" aria-label="Close"></button>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Item</Form.Label>
                            <Form.Select required onChange={e => setItem(e.target.value)} aria-label="Default select example">
                                <option>Select an item</option>
                                    {products.map(product =>
                                        <option value={product.product_name}>{product.product_name}</option>    
                                    )}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Truck</Form.Label>
                            <Form.Select required onChange={e => setTruck(e.target.value)} aria-label="Default select example">
                                <option>Select a truck</option>
                                    {trucks.map(truck =>
                                        <option value={truck.truck_code}>{truck.truck_code}</option>    
                                    )}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Price</Form.Label>
                            <Form.Control 
                            value={products.filter(product => product.product_name == item).map(filtered => filtered.product_price)} 
                            placeholder="Price PHP"  
                            required
                            />
                        </Form.Group>
                     
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setUpdateShow(false)} variant="outline-secondary">Cancel</Button>
                    <form onSubmit={ handleUpdate}>
                        <Button type="submit" onClick={() => setUpdateShow(false)} variant="warning">Update</Button>
                    </form>
                </Modal.Footer>
            </Modal>
            <Row className="mb-3 d-flex flex-row justify-content-between align-items-center">
                <Col> 
                    <div>
                        <h4 style={{marginBottom: "0"}}>{client.client_name}{ ' ' }  </h4> 
                        <Badge style={{padding: "7px"}} bg="secondary">{status}</Badge>
                        <span  className="small text-muted">&nbsp;&nbsp;{"#" + client.order_code}</span>
                    </div>
                </Col>
                <Col className="d-flex justify-content-end">
                    <div>
                        <h4 style={{marginBottom: "0"}}>₱ {' '}{numberWithCommas(updateTotal())}</h4>
                        <p className="small text-muted">{client.date_created}</p>
                    </div>
                </Col>
            </Row>
            {found? <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                <Row className="flex-column">
                    <Col className="mb-3 d-flex flex-row justify-content-between align-items-center"> 
                        <div className="d-flex flex-row  align-items-center">
                            <h4>Orders </h4>
                         
                        </div>
                        <Nav variant="pills" className="flex-row">
                            <Nav.Item>
                            <Nav.Link eventKey="first">Orders</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                            <Nav.Link eventKey="second">Add Order</Nav.Link>
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
                                            <th>Order Code</th>
                                            <th>Client</th>
                                            <th>Item</th>
                                            <th>Truck</th>
                                            <th>Date</th>
                                            <th>Price</th>
                                            <th className="print-hide">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                            {paginate.map((order, index) =>
                                                <tr>
                                                    <td className="align-middle">{index+1}</td>
                                                    <td className="align-middle">{order.order_code}</td>
                                                    <td className="align-middle">{order.client_name}</td>
                                                    <td className="align-middle">{order.item}</td>
                                                    <td className="align-middle">{order.truck}</td>
                                                    <td className="align-middle">{formatDate(order.date_created)}</td>
                                                    <td className="align-middle">₱ {numberWithCommas(order.price)}</td>
                                                    <td className="print-hide align-middle">
                                                    <button className="action-btn-edit" onClick={e=> {e.preventDefault(); handleUpdateModal(order._id);}}><FaPencilAlt/></button>{' '}
                                                    <button className="action-btn-delete" onClick={e => {e.preventDefault(); handleModal(order._id, order.item);}}><FaTrash/></button>
                                                    </td>
                                                </tr>
                                                )}
                                                
                                    </tbody>
                                    
                                </Table>
                                
                                {/**<Button onClick={handleUpdateStatus}>Complete Project</Button>*/}
                                <div className="d-flex justify-content-between">
                                    <div>
                                    {completeBtn()}
                                        <Button className="ms-2" onClick={print}>Print</Button>
                                    </div>

                                        
                                        <Pagination>
                                            {pages.map(page =>
                                                <li className={page === currentPage? "page-item active" : "page-item"}>
                                                    <p className="page-link" role="button" onClick={() => pagination(page)}>{page}</p>
                                                </li>
                                                )}
                                        </Pagination>

                                    
                                </div>
                                <span className="page-number display-9" >Page {currentPage} of {pages.length} </span>
                                
                                    

                            </Tab.Pane>
                            <Tab.Pane eventKey="second">
                                {alert? <Alert variant="success" onClose={() => setAlert(false)} dismissible>
                                    <Alert.Heading>
                                        Order Saved Successfully!
                                    </Alert.Heading>
                                    <p>
                                        You can view the saved changes on the orders tab.
                                    </p>
                                </Alert> : null}
                                <Form onSubmit={handleSubmit} className="pt-4" >
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Order code</Form.Label>
                                        <Form.Control  disabled type="text" placeholder={orderCode}  />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Client name</Form.Label>
                                        <Form.Control disabled type="number" min={1} placeholder={client.client_name}  />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Item</Form.Label>
                                        <Form.Select onChange={e => setItem(e.target.value)} aria-label="Default select example">
                                            <option>Select an item</option>
                                            {products.map(product =>
                                                <option value={product.product_name}>{product.product_name}</option>    
                                            )}
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Truck</Form.Label>
                                        <Form.Select onChange={e => setTruck(e.target.value)} aria-label="Default select example">
                                            <option>Select a truck</option>
                                            {trucks.map(truck =>
                                                <option value={truck.truck_code}>{truck.truck_code}</option>    
                                            )}
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Price</Form.Label>
                                        <Form.Control 
                                        value={products.filter(product => product.product_name == item).map(filtered => filtered.product_price)} 
                                        placeholder="Price PHP"  
                                        />
                                    </Form.Group>

                                    
                                    <div className="d-grid gap-2 d-flex flex-row">
                                        <Button type="submit" variant="primary" size="lg">
                                            Add Order
                                        </Button>
                                        <Button type="submit" variant="danger" size="lg">
                                            Cancel
                                        </Button>
                                    </div>
                                </Form>
                            </Tab.Pane>
                        </Tab.Content>
                        
                    </Col>
                </Row>
            </Tab.Container> : <h1>Client not found.</h1>}
            
            
        </Container>
        </>
    )
}
