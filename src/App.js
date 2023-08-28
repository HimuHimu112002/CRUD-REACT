import { useEffect, useState } from 'react';
import { Container, Form, ListGroup, Modal, Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { getDatabase, ref, set, push, onValue, remove, update} from "firebase/database";
import './list.css'
function App() {

  const db = getDatabase();

  let [FirstName, setFirstName] = useState();
  let [uiShow, setUiShow] = useState([]);

  // popup show koranor jonno
  const [show, setShow] = useState(false);
  
  // for button id access
  const [id, setId] = useState(false);

  let firstName =(item)=>{
    setFirstName(item.target.value)
  }
   
  let handleClick=(value)=>{
    value.preventDefault();
    set(push(ref(db, 'crud')),{
     fname:FirstName,
    });
  }

  useEffect(()=>{
    onValue(ref(db, 'crud'), (snapshot) => {
      let arr = []
      snapshot.forEach((item)=>{
        let show = {
          id: item.key,
          name: item.val().fname,
          
        }
        arr.push(show)
      });
      setUiShow(arr);
      });
  }, [])

  let handleDelete = (id) =>{
    remove(ref(db, 'crud/'+ id))
  }

  const handleShow = (id) => {
    setShow(true);
    setId(id)
  }

  const handleClose = () =>{
    setShow(false);
    update(ref(db, 'crud/' + id), {
      fname:FirstName,
    })
  }

return (
    <>
      <Container className='mt-5'>
        <Row> 
          <Col md="6">

              <div className='shadow p-4 rounded'>

              <h1 className='mt-5 text-center text-danger'>CRUD</h1>

              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Input Your Name Here</Form.Label>
                  <Form.Control onChange={firstName} type="text" placeholder="First Name" />
                </Form.Group>

                <Button onClick={handleClick} variant="success" type="submit">Submit</Button>

              </Form>

              <ListGroup className='mt-3'>
                {uiShow.map((item) => (

                  <ListGroup.Item >
                  <Row>

                    <Col md="6" className='nameFild'>
                      {item.name}<br></br>
                    </Col>

                    <Col md="6">
                      <div className='mt-2 Update_button-align'>
                        <Button className='btn1' onClick={()=>handleShow(item.id)} variant="success">Update</Button>
                        <Button onClick={()=>handleDelete(item.id)} variant="danger">Delete</Button>
                      </div>
                    </Col>

                  </Row>           
                  </ListGroup.Item>
                ))}
              </ListGroup>

            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Updating Your Name</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group className="mb-3" controlId="formBasictext">
                  <Form.Label>Input Your's Value.</Form.Label>
                  <Form.Control onChange={firstName} type="text"/>
                </Form.Group>
              </Modal.Body>
                <Modal.Footer>
                  <Button variant="success" onClick={handleClose}>
                    Update
                  </Button>

                  <Button className='bg-danger' variant="secondary" onClick={handleClose}>
                    Cancel
                  </Button>
              </Modal.Footer>
            </Modal>
              </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
