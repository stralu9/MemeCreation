import {ListGroup, Container, Row, Col, Button} from "react-bootstrap";
import {useHistory} from "react-router-dom";

function VisualizzaMeme(props){
    const history = useHistory();
    return(<>
    <Container>
        <Col className="d-flex d-grid gap-2 d-md-flex justify-content-center">
        <div>
        <img className="images" alt="" src={window.location.origin+"/"+props.meme.iid+".png"}></img>
        <Row>{props.meme.sentences.map((s,idx) => {
            if(s === undefined || s === null)
                return(<Col key={"text"+idx} className={"meme"}>{''}</Col>);
            
            let style = {color: props.meme.color, fontFamily: props.meme.font, left:s.left, bottom:s.bottom};
            return(<Col key={"text"+idx} style={style} className={"meme"}>{s.sentence || ''}</Col>);})}</Row>
        </div>
        </Col>        
    </Container>
    <ListGroup variant="flush" className="justify-content-center list-height">
        <ListGroup.Item key={"title"+props.id}>Titolo : {props.meme.title}</ListGroup.Item>
        <ListGroup.Item key={"admin"+props.id}>Creatore : {props.meme.username}</ListGroup.Item>
    </ListGroup>
    <Row><Col className="d-flex justify-content-center"><Button size="lg" variant="secondary" onClick={() => history.push("/")}>Indietro</Button></Col></Row>
    </>);
}

export {VisualizzaMeme};