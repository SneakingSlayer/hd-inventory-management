import React, {useState, useEffect, useContext} from 'react'
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { FaUserCircle,FaBoxOpen, FaCreditCard, FaChartPie, FaShoppingBag, FaTruck } from "react-icons/fa";
import { BsFillGearFill, BsHouseDoorFill } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import {IoRocketSharp } from "react-icons/io5";
import {FaUserFriends} from 'react-icons/fa' 
import {Context} from '../../context/Context'
import logo from '../../assets/images/hd-lgo.svg'
import './header.css'

import { useHistory } from 'react-router-dom';
export default function Header() {
  const [dash, setDash] = useState(false);
  const [stock, setStock] = useState(false);
  const [order, setOrder] = useState(false);
  const [rep, setRep] = useState(false);
  const path = window.location.pathname
  const history = useHistory()
  const {user, dispatch} = useContext(Context)

  const handleLogout = async (e) => {
    e.preventDefault();
    await dispatch({type: "LOGOUT"})
    history.push('/login')
  }

  const setName = () => {
    if(user !== null)
      return user.firstname
    if(user === null)
      return "empty"
  }
  useEffect(() =>{
    if(path === "/dashboard")
      setDash(true);
    if(path === "/products" || path === "/trucks")
      setStock(true);
    if(path === "/orders")
      setOrder(true);
    if(path === "/dashboard")
      setDash(true);
  },[])

 

  


    return (
        <Navbar collapseOnSelect expand="lg" variant="light">
  <Container>
  <Navbar.Brand href="/dashboard">
    <img src={logo} height="60px"/>
  </Navbar.Brand>
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
    <Nav  className="ml-auto">
      <Nav.Link className="d-flex align-items-center" href="/dashboard"><BsHouseDoorFill/>&nbsp;Dashboard</Nav.Link>
      <NavDropdown className="d-flex align-items-center" title={(
        <span >
          <FaBoxOpen/> 
          <span>&nbsp;Stocks</span>
        </span>
        )} id="collasible-nav-dropdown">
        <NavDropdown.Item className="d-flex align-items-center " href="/products"><FaShoppingBag/>&nbsp;Products</NavDropdown.Item>
        <NavDropdown.Item className="d-flex align-items-center" href="/trucks"><FaTruck/>&nbsp;Trucks</NavDropdown.Item>
      </NavDropdown>

      <Nav.Link className="d-flex align-items-center" href="/orders"><IoRocketSharp/>&nbsp;Orders</Nav.Link>
      <Nav.Link className="d-flex align-items-center" href="/employees"><FaUserFriends/>&nbsp;Employees</Nav.Link>
    </Nav>
    <Nav className="ms-auto">
    <NavDropdown title={(
        <span>
          <FaUserCircle/> 
          <span style={{fontWeight: "500"}}>&nbsp;&nbsp;{setName()}</span>
        </span>
        )} id="collasible-nav-dropdown" >
        <NavDropdown.Item href="#action/3.1" className="d-flex align-items-center" ><FaUserCircle/> &nbsp; Profile</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.2" className="d-flex align-items-center" ><BsFillGearFill/> &nbsp; Settings</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="#action/3.4" className="d-flex align-items-center" style={{paddingLeft: "11px", paddingRight: "0"}}><button className="d-flex align-items-center" onClick={handleLogout} style={{width: "100%", border:"none", backgroundColor: "transparent"}}><HiOutlineLogout/> <span>&nbsp; Logout</span></button></NavDropdown.Item>
      </NavDropdown>
    </Nav>
  </Navbar.Collapse>
  </Container>
</Navbar>

    )
}
