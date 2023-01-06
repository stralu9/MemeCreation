import Meme from './Models/Meme';

const fetchMeme = async() =>{  
    const response = await fetch('/api/memes');
    const responseBody = await response.json();
    if(response.ok)
        return responseBody.map((co) => Meme.from(co));
    else
        throw responseBody;
}

const fetchImages = async() =>{  
    const response = await fetch('/api/images');
    const responseBody = await response.json();
    if(response.ok)
        return responseBody;
    else
        throw responseBody;
}

const fetchMemeAdmin = async() =>{  
    const response = await fetch('/api/memes?protected=1');
    const responseBody = await response.json();
    if(response.ok)
        return responseBody.map((co) => Meme.from(co));
    else
        throw responseBody;
};

const fetchInsertMeme = async (m) => {
    const response = await fetch('/api/memes',{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(m),
      });
    const body = await response.json();
    if(response.ok)
          return body;
    else
          throw body;
}

const fetchInsertSentences = async (s) => {
    const response = await fetch('/api/sentences',{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(s),
      });
    if(!response.ok)
        throw response;      
}

const fetchSentencesForMeme = async(id) => {
    const response = await fetch('/api/memes/'+id+"/sentences");
    const responseBody = await response.json();
    if(response.ok)
        return responseBody;
    else
        throw responseBody;
}

const deleteMeme = async (id) => {
    const response = await fetch("/api/memes/" + id, {
        method: 'DELETE'
    });
    if(response.ok)
        return response;
    else
        throw response; 
}

const login = async(credentials) =>{
    let response = await fetch('/api/sessions',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'},
      body: JSON.stringify(credentials),
    });

    if(response.ok){
      const user=await response.json();
      return user;
    }else{
      const errDetails=await response.text();
      throw errDetails;
    }
  }
  
  async function logout() {
    await fetch('/api/sessions/current', { method: 'DELETE' });
  }
  
  async function getUserInfo(){
    const res = await fetch('/api/sessions/current');
    const userInfo = await res.json();
    if(res.ok)
      return userInfo;
    else
      throw userInfo;
  }


const API = {fetchMeme, fetchImages, fetchInsertSentences, fetchInsertMeme, deleteMeme, login, logout, getUserInfo, fetchSentencesForMeme, fetchMemeAdmin}


export default API;