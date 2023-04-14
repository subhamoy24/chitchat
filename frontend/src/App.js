//import SingleChat from "./components/SingleChat"
import DirectMessage from "./components/DirectMessage";
import Signup from "./components/SignUp";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Authenticate from "./components/Authenticate";
import ChatRoom from "./components/ChatRoom";
import ChatList from "./components/ChatList";


function App() {
  return (
    <div className="App">
      
      <Routes>
        <Route path="/" exact element={<Signup/>}/>
        <Route path="/Login" exact element={<Login/>}/>

        <Route path="/signup" exact element={<Signup/>}/>

        <Route path="/dashboard" element={
          <Authenticate child={<Dashboard/>}/>
        } />
        <Route path="/chat/:id" element={
          <Authenticate child={<ChatRoom/>}/>
        } />
      </Routes>      
    </div>
  );
}

export default App;
