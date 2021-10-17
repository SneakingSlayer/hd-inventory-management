import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import axios from 'axios'
import { BsTrash } from "react-icons/bs";

export default function ConfirmationModal(props) {
    const BASE_URL = "http://localhost:5000/api"

    const config = {
        'Content-Type': 'application/json',
        'token': ''
    }

    const handleDelete = async (e) => {
        e.preventDefault();
        console.log(props.id)
        const product ={id: props.id}
        await axios.post(`${BASE_URL}/${props.route}/delete`,product , {
            headers: config
        })
        .then(res=> {
            console.log(res)
        })
        .catch(err => {
            console.log(err)
        })
    }


    return (
        <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <BsTrash/>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Delete {props.name}</h4>
        <p>This action cannot be undone.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide} variant="outline-secondary">Cancel</Button>
        <form onSubmit={handleDelete}>
            <Button type="submit" onClick={props.onHide} variant="danger">Delete</Button>
        </form>
      </Modal.Footer>
    </Modal>
    )
}
