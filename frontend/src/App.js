//import SingleChat from "./components/SingleChat"
import DirectMessage from "./components/DirectMessage";
import Signup from "./components/SignUp";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Authenticate from "./components/Authenticate";
import ChatRoom from "./components/ChatRoom";
import ChatList from "./components/ChatList";
import Notfound from "./components/Notfound";


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" exact element={<ChatList/>}/>
        <Route path="/dashboard" element={
          <Authenticate child={<Dashboard/>}/>
        } />
        <Route path="/chat/:id" element={
          <Authenticate child={<ChatRoom/>}/>
        } />
        <Route path="/sign-up" element={<Signup/>}/>
        <Route path="/login" element={<Login/>} />
        <Route  path= "/*" element={<Notfound/>} />
      </Routes>      
    </div>
  );
}

export default App;
