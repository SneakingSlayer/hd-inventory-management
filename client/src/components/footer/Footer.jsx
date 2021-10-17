import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import logo from '../../assets/images/hd-lgo.svg'
export default function Footer() {
    return (
        <>
            <Container>
                <Row>
                    <Col style={{paddingTop:"2rem", paddingBottom:".5rem"}} className="d-flex justify-content-between">
                        <img src={logo} height="40px"/>
                        <span className="text-muted small">© 2021 HighDef Supply and Serivces Corp. All rights Reserved</span>
                    </Col>
                </Row>
                
            </Container>
        </>
    )
}
