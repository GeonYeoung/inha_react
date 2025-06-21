import React, { useState } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'

const BookPage = ({doc}) => {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(false);

  return (
    <>
    
    <img style={{'cursor':'pointer'}}
        src={document.thumbnail || 'https://placeholder.co/100X145'} widht ="100%" onClick={handleShow}/>
    <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size='lg'>
            <Modalodal.Header closeButton>
                <Modal.Title>도서정보</Modal.Title>
            </Modalodal.Header>   
            <Modal.Body>
                <Row>
                    <Col>
                        <img src={document.thumbnail} width='100%'/>
                    </Col>
                    <Col className='align-self-center'>
                        <h5>{doc.title}</h5>
                        <div>판매가: {doc.sale_price}</div>
                        <div>저자: {doc.authors}</div>
                        <div>출판사: {doc.publisher}</div>
                        <div>ISBM: {doc.isbm}</div>
                        <div>출판일: {doc.datetime}</div>
                    </Col>
                </Row>
                <hr/>
                <div>
                    {doc.contents || '내용없음'}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={handleClose}>Close</Button>
            </Modal.Footer>
    </Modal>

    </>
  );
}

export default BookPage
