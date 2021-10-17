import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
export default function Error404() {
    return (
        <>
            <Container className="d-flex justify-content-center">
                <Row className="d-flex align-items-center justify-content-center vh-100">
                    <Col>
                        <h1>Error 404 Page not found.</h1>
                        <p className="fs-5">Sorry, this page does not exist.</p>
                        <a href="/">Go back</a>
                    </Col>
                </Row>

            </Container>
        </>
    )
}
