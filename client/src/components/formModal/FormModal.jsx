import React, {useState, useEffect}  from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { useHistory } from 'react-router-dom';
import {BASE_URL, config} from '../../globals/globals';
import axios from 'axios'   
export default function FormModal(props) {
    const [code, setCode] = useState('')
    const [name, setName] = useState('')
    const history = useHistory();
    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log('i am clicked')
        const client = {
            order_code: props.code,
            client_name: name,
            project_total: 'empty',
            project_status: 'empty'
        }

        console.log(client)
        
        await axios.post(`${BASE_URL}/api/clients`, client, {
            headers: config
        })
        .then(res => {
            console.log(res)
            history.push(`/orders/client/${props.code}`)
        })
        .catch(err => {
            console.log(err)
        })
    }


    return (
        <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Order Code</Form.Label>
                <Form.Control disabled type="text" placeholder={props.code} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Client</Form.Label>
                <Form.Control onChange={e => setName(e.target.value)} type="text" placeholder="Client Name" />
            </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button   onClick={props.onHide} variant="outline-secondary">Cancel</Button>
        <Button onClick={handleSubmit} type="submit" >Save</Button>
      </Modal.Footer>
    </Modal>
    )
}
