import React from 'react';
import { createContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import { Landing } from './Landing';
import { AdminPage } from './AdminPage';
import { Channels } from './Channels';
import { Chatroom } from './Chatroom';

export const userContext = createContext(null)

function App() {

  const [loggedIn,setLoggedInUser] = useState({
    user_id:"",
    user_name:""
  })

  return (
    <userContext.Provider value={[loggedIn, setLoggedInUser]}>
      <Router>
          <Routes>
              <Route exact path='/' element={<Landing/>} />
              <Route path='/app' element={<AdminPage/>} />
              <Route path='/channels' element={<Channels/>} />
              <Route path='/channels/:channel_id' element={<Chatroom/>} />
          </Routes>
      </Router>
    </userContext.Provider>
  );
}

export default App;
