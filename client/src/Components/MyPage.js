import {MemeList} from './MemeList';
import {ModalDBError} from './MyModals';
import { Switch, useHistory,Route,Redirect, useRouteMatch} from 'react-router-dom';
import API from '../API.js';
import {VisualizzaMeme} from './VisualizzaMeme';
import Meme from '../Models/Meme';
import Sentence from '../Models/Sentence';
import { useEffect } from 'react';

function MyPage(props){
    const history = useHistory();
    const matchView = useRouteMatch("/visualizza_meme/:id");    
    const activeV = matchView && matchView.params && matchView.params.id;
    
    useEffect(() => {
        if(activeV && (props.memes.find((x) => x.id === activeV) === undefined || props.memes.find((x) => x.id === activeV).sentences.length === 0) && props.refresh===true)
            props.setRefresh(activeV);
    }, []);
    
    const handleRemoveStatus = () => {
        props.setMemes((memes) => memes.filter((x) => x.status === undefined));
    }
    const handleInsertMeme = async (iid, title, visibility, n, text, font, color) => {       
        let sentences = [];
        if(text === undefined || iid === undefined)
            return "Errore nell'inserimento dei dati."
        if(font === undefined || font === '')
            return "Necessario specificare il font";
        if(color === undefined || color === '')
            return "Necessario specificare il colore";
        for(let v = 0; v < n; v++){
            sentences.push(new Sentence(undefined, text[v]));
        }
        let found = false;
        for(let v = 0; v < n; v++){
            if(text[v] !== undefined && text[v] !== '')
                found = true;
        }
        if(!found)
            return "Almeno un campo di testo non deve essere vuoto";
        if(title === undefined || title === '')
            return "Necessario specificare un titolo";
        if(visibility === undefined || !(visibility === "public" || visibility === "protected"))
            return "Necessario specificare la visibilità";
        
        let meme = new Meme(undefined, iid, title, visibility, props.currAId, props.currA, n, font, color);
        meme.status = 'success';
        props.setMemes((m) => [...m, meme])
        let id = await API.fetchInsertMeme(meme);
        if(id === undefined)
            throw id;
        
        for(let v = 0; v < n; v++){
            sentences[v]["id"] = id;
        }


        API.fetchInsertSentences(sentences)
            .then(() => props.setDirty(true));
        return 1;
    };

    const handleChosen = async (id) => {
        const choose = async (id) => {
            if(props.memes.find((x) => x.id === id).sentences.length === 0){
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
            
                props.setRefresh(false);
                history.push("./visualizza_meme/"+id);
                            
        };
        choose(id).catch((e) => console.error(e));
    };
    
    const handleDelete = async (id) => {
        const del = async (id) => {
            props.setMemes((m) => m.map((x) => {
                if(x.id === id){
                    let m = new Meme(x.id, x.iid, x.title, x.visibility, x.admin, x.username, x.fields, x.font, x.color);
                    m.sentences=[...x.sentences];
                    m.status = "danger";
                    return m;
                }
                else
                    return x;
            }));
            await API.deleteMeme(id);
        }
        del(id).then((e) => props.setDirty(true)).catch((e) => props.setDatabaseError(true));
    }
    return(<>
        {props.databaseError ? 
          <Redirect to="/"></Redirect> : ""}
      <Switch> 
        <Route exact path="/visualizza_meme/:id" render = {({match}) => {
            return(<>{props.loading || props.memes.find((x) => x.id===parseInt(match.params.id)) === undefined || props.memes.find((x) => x.id===parseInt(match.params.id)).sentences.length === 0? <span>🕗In attesa del caricamento...</span> : <VisualizzaMeme meme={props.memes.find((x) => x.id === parseInt(match.params.id))}></VisualizzaMeme>}</>)
        }}/>

        <Route exact path="/" render = {() => {     
          return(<>{props.databaseError ? <ModalDBError show={props.databaseError}></ModalDBError> : ""}
                {props.loading && !props.databaseError && props.memes.find((s) => s["status"] !== undefined) === undefined ? <span>🕗In attesa del caricamento...</span> : 
              <MemeList handleRemoveStatus={handleRemoveStatus} setMemes={props.setMemes} handleInsertMeme={handleInsertMeme} handleChosen={handleChosen} handleDelete={handleDelete} memes={props.memes} currA={props.currA} currAId={props.currAId} loggedIn={props.loggedIn}></MemeList>}
              </>); }
        }/>

        <Route path="/" render = {() => {
            return(<Redirect to="/"></Redirect>);
        }}/>
                
      </Switch></>);
    
}


export {MyPage};