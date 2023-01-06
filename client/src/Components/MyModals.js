import {Button, Modal, Form, Row, Col, Alert} from 'react-bootstrap';
import {LoginForm} from './MyForms.js';
import {useState} from 'react';

function ModalLogin(props){
    return(
        <Modal show={props.show}>
            <Modal.Header>
                <Modal.Title>{"Login"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <LoginForm handleClose={props.handleClose} login={props.login}/>
            </Modal.Body>
        </Modal>
    );
};

function ModalCreateMeme(props){
    const [selected, setSelected] = useState(-1);
    const [font, setFont] = useState('');
    const [color, setColor] = useState('');
    const [text, setText] = useState({});
    const [visibility, setVisibility] = useState('');
    const [title, setTitle] = useState('');
    const [alert, setAlert] = useState();

    
    const handleText = (id, f) => {
        setText((fon) => {
            let obj = {}
            for(let v=0; v<props.images.filter((i) => i.id===selected).length; v++)
            {
                if(v===id)
                    obj[v] = f;                    
                else
                    obj[v] = fon[v];
            }
            return obj;
        });
    };    

    const handleInsert = (iid, title, visibility, n, text, font, color) => {
        props.handleInsertMeme(iid, title, visibility, n, text, font, color).then((ret) => {
            if(ret !== 1)
            setAlert(ret);
        else{
            setSelected(-1);
            setFont('');
            setColor('');
            setText('');
            setVisibility('');
            setTitle('');
            setAlert();
            props.setShow(false);
        }}).catch((e) => {props.handleRemoveStatus(); setAlert("Problemi con il database. Riprovare.")});
        
    }
        
    return (
        <Modal size="lg" show={props.show} centered>
            <Modal.Header className="justify-content-center">
                <Modal.Title>
                    {selected === -1 ? "Selezione immagine" : "Creazione nuovo meme"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {alert ? <Alert variant='danger'>{alert}</Alert> : ''}
                <Form><Row>
                {selected === -1 ? props.images.filter((i) => i.field === 0).map((i) => {
                return(
                <Col key={i.id} sm="4">
                <div><img height={150} alt="" width={150} src={window.location.origin+"/"+i.id+".png"}></img></div>
                    <Form.Check type={"checkbox"} disabled={selected!==-1 && selected !== i.id} id={i.id} onChange={() => {
                        if(selected === -1)
                            setSelected(i.id)
                    }}></Form.Check>  
                </Col>
                )}) : ""}
                {selected !== -1 ? <><Col className="justify-content-center d-flex">
                <div><img alt="" className="images" src={window.location.origin+"/"+selected+".png"}></img>
                <Row>{props.images.filter((i) => i.id === selected).map((s) => {
                        let style = {left:s.left, bottom:s.bottom};
                        return(<Col key={"memec-"+selected+"-"+s.field} style={style} className="meme">{s.field+1}</Col>);})}</Row></div>
                </Col><Row><Col className="d-flex justify-content-center"><Button className="justify-content-center" onClick={() => {setSelected(-1); setColor(''); setFont(''); setText({}); setVisibility(''); setTitle(''); setAlert('');}}>Cambia immagine</Button></Col></Row></> : ""}
                </Row>
                </Form>
                {selected !== -1 ? <Form>
                    <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="3">
                                    {"Titolo:"}
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control placeholder="..." value={title} onChange={ev => setTitle(ev.target.value)}/>
                                </Col>
                        </Form.Group>                   
                    {props.images.filter((i) => i.id === selected).map((s) => {
                        return (<div key={"Campo " + parseInt(s.field+1) +":c"}>
                                <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="3">{"Campo " + parseInt(s.field+1) +":"}
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control placeholder="..." value={text[s.field] === undefined ? '' : text[s.field]} onChange={ev => handleText(s.field, ev.target.value)}/>
                                </Col>
                        </Form.Group></div>)})}
                        <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="2">
                                    Font:
                                </Form.Label>
                                <Col sm="4">
                                <Form.Control as="select" value={font} onChange={ev => {setFont(ev.target.value)}}>
                                    <option value=''>Scegli...</option>
                                    <option value='verdana'>Verdana</option>
                                    <option value='arial'>Arial</option>
                                </Form.Control>
                                </Col>
                                <Form.Label column sm="2">
                                    Colore:
                                </Form.Label>
                                <Col sm="4">
                                <Form.Control as="select" value={color} onChange={ev => {setColor(ev.target.value)}}>
                                    <option key="" value=''>Scegli...</option>
                                    <option key="red" value='red'>Rosso</option>
                                    <option key="green" value='green'>Verde</option>
                                    <option key="black" value='black'>Nero</option>
                                    <option key="white" value='white'>Bianco</option>
                                </Form.Control>
                                </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="4">
                                    Visibilità:
                                </Form.Label>
                                <Col sm="7">
                                <Form.Control as="select" value={visibility} onChange={ev => {setVisibility(ev.target.value)}}>
                                    <option key="" value=''>Scegli...</option>
                                    <option key="public" value='public'>pubblica</option>
                                    <option key="protected" value='protected'>protetta</option>
                                </Form.Control>
                                </Col>
                        </Form.Group>
                 </Form> : ""}            
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => {setAlert(); setText({}); setFont(''); setColor(''); setVisibility(''); setTitle(''); setSelected(-1); props.setShow(false)}}>Indietro</Button>
                {selected !== -1 ? <Button onClick={() => {handleInsert(selected, title, visibility, props.images.filter((i) => i.id===selected).length, text, font, color)}}>Inserisci</Button> : "" }
            </Modal.Footer>
            </Modal>
        );
};

function ModalDBError(props){
    return (
        <Modal show={props.show} centered>
            <Modal.Header centered>
                <Modal.Title>
                    Errore!
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.post ? "" : "Ci sono problemi con il database. Aggiornare la pagina"}
            </Modal.Body>
            </Modal>
        );
};

function ModalCopyMeme(props){
    const [font, setFont] = useState('');
    const [color, setColor] = useState('');
    const [text, setText] = useState({});
    const [visibility, setVisibility] = useState('');
    const [title, setTitle] = useState();
    const [alert, setAlert] = useState();

    const handleText = (id, f) => {
        setText((fon) => {
            let obj = {}
            for(let v=0; v<props.fields; v++)
            {
                if(v===id)
                    obj[v] = f;                    
                else
                    obj[v] = fon[v];
            }
            return obj;
        });
    };

    const handleCopy = (t, v, te, f, c) => {
        for(let i=0; i < props.fields; i++){
            if(props.sentences[i] !== undefined && props.sentences[i] !== null){
                if(te[i] === undefined)
                    te[i] = props.sentences[i].sentence;
            }
        }
        if(f===undefined || f==='')
            f=props.font;
        if(c===undefined || c==='')
            c=props.color;
        if(t === undefined)
            handleInsert(props.iid, props.title, v || props.canChangeVis, props.fields, te, f, c);
        else
            handleInsert(props.iid, t, v || props.canChangeVis, props.fields, te, f, c);
    }

    const handleInsert = (iid, title, visibility, n, text, font, color) => {        
        props.handleInsertMeme(iid, title, visibility, n, text, font, color).then((ret) => {
            if(ret !== 1)
            setAlert(ret);
        else{
            setFont('');
            setColor('');
            setText({});
            setVisibility('');
            setTitle();
            setAlert();
            props.setShow(false);
        }}).catch((e) => {props.handleRemoveStatus(); setAlert("Problemi con il database. Riprovare.")});
        
    }
    return (
        <Modal size="lg" show={props.show} centered>
            <Modal.Header className="justify-content-center">
                <Modal.Title>
                    Copia di un meme esistente
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {alert ? <Alert variant='danger'>{alert}</Alert> : ''}
                <Row>
                <Col className="justify-content-center d-flex">
                <div><img className="images" alt="" src={window.location.origin+"/"+props.iid+".png"}></img>
                <Row>{props.imag.filter((i) => i.id===props.iid).map((s) => {
                        let style = {left:s.left, bottom:s.bottom};
                        return(<Col key={"meme-"+props.iid+"-"+s.field} style={style} className={"meme"}>{s.field+1}</Col>);})}</Row></div>
                </Col>
                </Row>
                <Form>
                    <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="4">
                                    {"Titolo:"}
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control defaultValue={props.title} onChange={ev => setTitle(ev.target.value)}/>
                                </Col>
                        </Form.Group>                   
                    {props.imag.filter((i) => i.id===props.iid).map((s) => {
                        return (<div key={"div " + parseInt(s.field+1)}><Form.Label key={"Campo " + parseInt(s.field+1)} className="fs-4 fw-bold">{"Campo " + parseInt(s.field+1) +":"}</Form.Label>
                                <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="4">
                                    {"Testo:"}
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control defaultValue={(props.sentences[s.field] && props.sentences[s.field].sentence) || ''} onChange={ev => handleText(s.field, ev.target.value)}/>
                                </Col>
                        </Form.Group></div>)})}
                        <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="2">
                                    Font:
                                </Form.Label>
                                <Col sm="4">
                                <Form.Control as="select" defaultValue={props.font} onChange={ev => {setFont(ev.target.value)}}>
                                    <option value='verdana'>Verdana</option>
                                    <option value='arial'>Arial</option>
                                </Form.Control>
                                </Col>
                                <Form.Label column sm="2">
                                    Colore:
                                </Form.Label>
                                <Col sm="4">
                                <Form.Control as="select" defaultValue={props.color} onChange={ev => {setColor(ev.target.value)}}>
                                    <option key="red" value='red'>Rosso</option>
                                    <option key="green" value='green'>Verde</option>
                                    <option key="black" value='black'>Nero</option>
                                    <option key="white" value='white'>Bianco</option>
                                </Form.Control>
                                </Col>
                        </Form.Group>
                        {!(props.canChangeVis === "protected" && props.currAId !== props.admin)? <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="4">
                                    Visibilità:
                                </Form.Label>
                                <Col sm="7">
                                <Form.Control as="select" defaultValue={props.canChangeVis} onChange={ev => {setVisibility(ev.target.value)}}>
                                    <option key="public" value='public'>pubblica</option>
                                    <option key="protected" value='protected'>protetta</option>
                                </Form.Control>
                                </Col>
                        </Form.Group> : ""}
                 </Form>            
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => {setAlert(); setFont(''); setColor(''); setVisibility(); setTitle(); props.setShow(false)}}>Indietro</Button>
                <Button onClick={() => handleCopy(title, visibility, text, font, color)}>Copia</Button>
            </Modal.Footer>
            </Modal>
        );
};


export{ModalDBError, ModalLogin, ModalCopyMeme, ModalCreateMeme};