import {ListGroup, Row, Col, Button} from 'react-bootstrap';
import { useState } from 'react';
import {userIcon} from './icons';
import {ModalCopyMeme, ModalCreateMeme} from './MyModals';
import Meme from '../Models/Meme';
import API from '../API';

function Element(props){
    const [showCopy, setShowCopy] = useState(false);

    const handleCopy = async (id) => {
        await props.getImages();
        await props.getSentences(id);
        setShowCopy(true);
    };

    return (
        <ListGroup.Item variant={props.status} key={props.id}>
          <Row className="d-flex w-100 justify-content-between">
            <Col className="col-pad-left fs-4">{props.title}</Col>
            {
                props.loggedIn && props.visibility === "protected" ? <Col className="d-flex d-grid gap-2 d-md-flex justify-content-center">{userIcon}</Col> : ""
            }
            <Col className="small-button-style d-flex d-grid gap-2 d-md-flex justify-content-end"><Button onClick={() => {props.handleChosen(props.id, true)}} variant="success">Visualizza meme</Button>
            {props.loggedIn ? <Button onClick={() => handleCopy(props.id)} variant="success">Copia meme</Button> : ""}
            {props.loggedIn && props.admin === props.currAId ? <Button onClick={() => {props.handleDelete(props.id)}} variant="danger">Elimina</Button> : ""}</Col>
          </Row>
          <ModalCopyMeme handleRemoveStatus={props.handleRemoveStatus} imag={props.imag} color={props.color} font={props.font} currAId={props.currAId} admin={props.admin} handleInsertMeme={props.handleInsertMeme} title={props.title} show={showCopy} setShow={setShowCopy} iid={props.iid} fields={props.fields} canChangeVis={props.visibility} sentences={props.sentences}></ModalCopyMeme>
      </ListGroup.Item> 
    );
}

function MemeList(props){
    const [showCreate, setShowCreate] = useState(false);
    const [imag, setImag] = useState([]);

    const handleCreate = async() => {
        if(imag.length === 0){
            let i = await API.fetchImages();
            setImag(i);
        }
        setShowCreate(true);
    }

    const getImages = async() => {
        if(imag.length === 0){
            let i = await API.fetchImages();
            setImag(i);
        } 
    }

    const getSentences = async (id) => {
        if(props.memes.find((x) => x.id === id).sentences.length === 0) 
        {
            const sentences = await API.fetchSentencesForMeme(id);
            props.setMemes((meme) => meme.map((x) => {
                        if(x.id === id){
                        let meme = new Meme(x.id, x.iid, x.title, x.visibility, x.admin, x.username, x.fields, x.font, x.color);
                        meme.sentences = [...sentences];
                        return meme;
            }
            else
                return x;               
            }));
        }
    };
    return(<>{props.memes.length === 0 ? <Row className="padding-top">Non ci sono ancora meme da visualizzare</Row> : <>
      <ListGroup variant="flush" className="padding-top justify-content-center list-height">
        {props.memes.map( (s) => <Element key={s.id || -1} handleRemoveStatus={props.handleRemoveStatus} getImages={getImages} imag={imag} getSentences={getSentences} color={s.color} font={s.font} handleInsertMeme={props.handleInsertMeme} status={s.status} loggedIn={props.loggedIn} currAId={props.currAId} handleDelete={props.handleDelete} handleChosen={props.handleChosen} sentences={s.sentences} iid={s.iid} id={s.id} admin={s.admin} title={s.title} fields={s.fields} visibility={s.visibility}/>)}       
      </ListGroup></>}
      {props.loggedIn ? <Col className="d-flex d-grid gap-2 d-md-flex justify-content-center"><Button variant="success" onClick={() => handleCreate()}>Crea un nuovo meme</Button></Col> : ""}
      <ModalCreateMeme handleRemoveStatus={props.handleRemoveStatus} images={imag} handleInsertMeme={props.handleInsertMeme} setShow={setShowCreate} show={showCreate}></ModalCreateMeme></>)
}

export {MemeList}