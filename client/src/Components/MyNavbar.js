import {logo,login_i,logout_i} from './icons';
import { Navbar,Col,Button} from "react-bootstrap";
import { useState } from 'react';
import {ModalLogin} from './MyModals';
import { useHistory } from 'react-router-dom';

function MyNavbar(props){
    const[show,setShow]=useState(false);
    const handleShow = () => setShow(true);
    const handleClose = ()=>setShow(false);
    const history = useHistory();

    const handleLogout = () => {
        props.doLogout();
        history.push("/");
    }
    return(<>
        <Navbar bg={props.loggedIn?"success":"dark"} variant="dark" className="expand-sm fixed-top">
            <Col>
                <Navbar.Brand href='/' >
                    {logo}
                    Meme generator
                </Navbar.Brand>
            </Col>
            <Col>
                {
                    props.loggedIn?
                    <Button variant="dark" style={{float:'right'}} onClick={() => handleLogout()}>
                        Logout
                        {logout_i}      
                    </Button>:
                    <Button variant="success" style={{float:'right'}} onClick={handleShow}>
                        Login
                        {login_i}
                    </Button>
                }
            </Col>
        </Navbar>
        <ModalLogin show={show} user={false} handleClose={handleClose} login={props.doLogin} />
    </>);
}

export {MyNavbar};