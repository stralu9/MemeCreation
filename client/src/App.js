import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {MyNavbar} from './Components/MyNavbar.js';
import {MyPage} from './Components/MyPage.js';
import {Container, Row,Alert} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import API from './API.js';
import Meme from './Models/Meme';

function App() {
  const [loggedIn,setLoggedIn]=useState(false);
  const [currA,setCurrA]=useState('');
  const [currAId,setCurrAId]=useState('');
  const [loading,setLoading]=useState(true);
  const [dirty, setDirty] = useState(true);
  const [memes,setMemes]=useState([]);
  const [message, setMessage] = useState('');
  const [databaseError, setDatabaseError] = useState(false);
  const [refresh, setRefresh] = useState(true);
  
  useEffect(()=>{
    const checkAuth = async () => {      
      let before = loading;
      try {
        setLoading(true);
        const uInfo = await API.getUserInfo();
        setCurrAId(uInfo.id);
        setCurrA(uInfo.username);
        setLoggedIn(true);
        setLoading(before);
      } catch(err) {
        setLoading(before);
      }
    };
    checkAuth();
  },[]);

  useEffect(()=>{
    const getMemes = async()=>{
          if(currAId!==''){
            const im = await API.fetchMemeAdmin(currAId);
            setMemes(im);
          }else{
            const im = await API.fetchMeme();           
            setMemes(im);
          }
      };
      if(dirty){
        getMemes().then(()=>{setDirty(false); setLoading(false);}).catch((e) => {setDatabaseError(true);});
      }       
  },[dirty,currAId]);

  useEffect(()=>{
    const getMemes = async(id)=>{      
        const sentences = await API.fetchSentencesForMeme(parseInt(id));
        setMemes((meme) => meme.map((x) => {
            if(x.id === parseInt(id)){
                let meme = new Meme(x.id, x.iid, x.title, x.visibility, x.admin, x.username, x.fields, x.font, x.color);
                meme.sentences = [...sentences];
                return meme;
            }
            else
                return x;               
      }));
      };
      if(refresh !== false && refresh !== true && !dirty){        
        let id = refresh;
        setLoading(true);
        setRefresh(false);        
        getMemes(id).then(()=>{setLoading(false);}).catch((e) => {setDatabaseError(true);});;
      }       
  },[refresh, loading, dirty]);

  const doLogin = async (credentials) => {
    try{
      setLoading(true);
      const user = await API.login(credentials);
      setLoggedIn(true);
      setCurrA(user.username);
      setCurrAId(user.id);
      setMessage({msg:`Benvenuto, ${user.username}!`, type: 'success'});
      setLoading(false);
      setDirty(true);
      setLoading(true);
    }catch(err) {
      setMessage({msg: " Email e/o password errati. Riprovare.", type: 'danger'});
      setLoading(false);
    }
  }
  const doLogout = async () => {
    setLoading(true);
    await API.logout().then(setMessage({msg: 'Logout avvenuto con successo.', type: 'success'}));
    setCurrAId('');
    setCurrA('');
    setMemes((m) => m.filter((s) => s.visibility === "public"));
    setLoggedIn(false);
    setLoading(false);
  }
  return (
    <Router>
      <Container fluid>
        {loading?<span>🕗In attesa del caricamento...</span>:<>
        <Row><MyNavbar loggedIn={loggedIn} doLogin={doLogin} doLogout={doLogout} /></Row>
        {message && <Row className="padAlert">
          <Alert closeLabel="" variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
        </Row> }     
        <Row className={message?"":"padt"}>
          <MyPage refresh={refresh} setRefresh={setRefresh} loading={loading} setLoading={setLoading} dirty={dirty} setDirty={setDirty} currAId={currAId} currA={currA} 
              loggedIn={loggedIn} databaseError={databaseError} setDatabaseError={setDatabaseError} memes={memes} setMemes={setMemes}/>
        </Row></>
        }
      </Container>
    </Router>
  );
}

export default App;
