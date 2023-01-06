import { useState } from 'react';
import {Form,Button,Alert} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

function LoginForm(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const history = useHistory();
    
    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');
        const credentials = { username, password };
        let valid = true;
        if(username === '' || password === '' || password.length < 6)
            valid = false;
        if(valid){
          props.login(credentials);
          props.handleClose();
          history.push("/");
        }
        else
          setErrorMessage('Email e/o password errati. Riprovare.');
    };
    return (
      <Form>
        {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
        <Form.Group controlId='username'>
            <Form.Label>Username</Form.Label>
            <Form.Control type='username' value={username} onChange={ev => setUsername(ev.target.value)} />
        </Form.Group>
        <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
        </Form.Group>
        <Form.Group className="padform">
          <Button variant="secondary" onClick={props.handleClose}>Chiudi</Button>
          <Button style={{float:'right'}} onClick={handleSubmit}>Login</Button>
        </Form.Group>
    </Form>
    );
  }

  export {LoginForm}