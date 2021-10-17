import React, {useState, useEffect}from 'react'
import { Container, Alert, Col, Row} from 'react-bootstrap'
import axios from 'axios'
import { BASE_URL, config } from '../globals/globals'
export default function Verify(props) {
    const [success, setSuccess] = useState()
    const token = props.match.params.token

    const handleAlert = () => {
        if(success === '' || success === null || success === undefined){
            return '' 
        }
        if(success === false){
            return (<Alert variant="danger" onClose={() => setSuccess(false)} dismissible>
            <Alert.Heading>
                There was an error trying to verify this account.
            </Alert.Heading>
                <p>
                    <a href="https://mail.google.com/mail/u/0/#inbox">Please try again.</a>
                </p>
        </Alert>)
        }
        if(success === true){
            return (

                <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
                                <Alert.Heading>
                                    Account Verified
                                </Alert.Heading>
                                    <p>
                                        Thank you for confirming this account.
                                     </p>
                            </Alert> 
            )
        }
    }
    const handleVerify = async () => {
        await axios.post(`${BASE_URL}/api/verify`, {email_token: token}, {
            headers:config
        })
        .then(res => {
            setSuccess(true)
        })
        .catch(err => {
            setSuccess(false)
        })
    }
    useEffect(() => {
        handleVerify()

    }, [])
    return (
        <div>
            <Container >
                <Row className="vh-100 d-flex align-items-center"> 
                    <Col>
                        {handleAlert()}
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
