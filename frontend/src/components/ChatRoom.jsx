import { Avatar, Box, Button, Card, CardBody, CardFooter, CardHeader, Divider, Flex, Heading, Input, InputGroup, InputRightElement, Text, useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router";
import MessageItem from "./MessageItem";
import io from "socket.io-client";
import { Badge, IconButton } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import DirectMessage from "./DirectMessage";
import Logout from "./Logout";
import GroupMessage from "./GroupMessage";

var  socket;
var updateStatus;

const ChatRoom = () => {
  const logged_user = useSelector((state) => state.user.value);
  const [userOnline, setUserOnline] = useState(false);

  const [endUser, setEndUser] = useState(null);
  const [endGroupUser, setEndGroupUser] = useState(null);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [room, setRoom] = useState(null);
  const [selectedChat, setSelectedChat] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ userList, setUserList ] = useState([]);
  

  const navigate = useNavigate();


  const params = useParams();

  
  const dmHandler = async() => {
    if(userList.length == 0) {
      const result = await axios.get(`${process.env.REACT_APP_END_POINT}/api/user/list`);
      setUserList((prev) => [...prev, ...result.data]);
      console.log(result.data);
    }
  
    onOpen();
  }
  

  const updateChats = async () => {
    const data = await axios.get(`${process.env.REACT_APP_END_POINT}/api/chat/user-chats?userId=${logged_user._id}`);
    console.log(data.data);
    setChats(data.data);
  }

  const onChatSelect = async (chatId) => {
    try {
      console.log(chatId);
      const data = await axios.get(`${process.env.REACT_APP_END_POINT}/api/chat/view-chat?userId=${logged_user._id}&chatId=${chatId}`);
      console.log(data)
      navigate(`/chat/${chatId}`);
    }catch(err) {

    }
  }

  const getChatDetails = async () => {
    try{
      console.log(logged_user);
      await axios.get(`${process.env.REACT_APP_END_POINT}/api/chat/view-chat?userId=${logged_user._id}&chatId=${params.id}`);
      const data = await axios.get(`${process.env.REACT_APP_END_POINT}/api/chat/details?chatId=${params.id}`);
      const chatDetails = data.data;
      console.log(chatDetails);
      const chat = data.data.chat;
      const chatMessages = data.data.messages;
      var endU = null
      if(!chat.isGroupChat) {
        if(chat.users[0]._id == logged_user._id) {
          setEndUser(chat.users[1]);
          endU = chat.users[1]
        } else {
          setEndUser(chat.users[0]); 
          endU = chat.users[0]

        }
      } else {
        const others = []
        for(let i = 0; i < chat.users.length; i++) {
          if(chat.users[i]._id != logged_user._id) {
            others.push(chat.users[i])
          }
        }
        setEndGroupUser(others);
      }

      chatMessages.reverse()
      setMessages(chatMessages);
      setSelectedChat(chat);

      setLoading(false);
      if(chat && endU) {
        socket = io.connect(process.env.REACT_APP_END_POINT);

        socket.on("reload", async (data) => {
          console.log("poi")
          await socket.emit("join_room", logged_user._id);
          console.log(endU);
          socket.emit("end_user_connect", endU._id);
        });

        socket.on("online", (data) => {
          clearTimeout(updateStatus);
          console.log(endU);
          if(endU) {
            if(endU._id == data) {
              setUserOnline(true)
              console.log("online");
              updateStatus = setTimeout(() => setUserOnline(false), 5000);
            } else {
              setUserOnline(false)
            }
          }
        });

        socket.on("receive_message", (data) => {
          console.log(data)
          setMessages((prev_messages) => [data, ...prev_messages]);
        });

        socket.on("receive_chat", async (data) => {
          console.log(data)
          if(data.chat !== selectedChat._id) {
            updateChats();
          } else {
            await axios.get(`${process.env.REACT_APP_END_POINT}/api/chat/view-chat?userId=${logged_user._id}&chatId=${selectedChat._id}`);
            updateChats();
          }
        });
        setRoom(chat);
      } else {
        socket = io.connect(process.env.REACT_APP_END_POINT);
        socket.on("reload", async (data) => {
          console.log("poi")
          await socket.emit("join_room", logged_user._id);
        });


        socket.on("receive_message", (data) => {
          console.log(data)
          setMessages((prev_messages) => [data, ...prev_messages]);
        });
        setRoom(chat);

      }

    } catch(err) {

    }
    
  }
  const getChats = async () => {
    const data = await axios.get(`${process.env.REACT_APP_END_POINT}/api/chat/user-chats?userId=${logged_user._id}`);
    console.log(data.data);
    setChats(data.data);
  }
  useEffect(() => {
    getChats();
    onClose();
  }, [params.id])

  useEffect(() => {
    getChatDetails();
  }, [params.id]);

  const sendMessage = async () => {
    try {
      const data = await axios.post(`${process.env.REACT_APP_END_POINT}/api/message`, {sender: logged_user._id, content: message, chat: params.id});
      const receive_message = data.data.message;
      if(receive_message) {
        console.log(receive_message);
        console.log(socket)
        if(socket) {
          const data = {chatId: room._id, message: receive_message}
          await socket.emit("send_message", data);
        }
        setMessage('');
      } else {
        console.log("ppp");
      }
    }catch(err) {
      console.log(err);
    }
  }
  return(
   !loading ?

   <Box ml={[0, 50, 50, 100]} mr={[0, 50, 50, 100]} mt={[0, 5, 5, 10]} minH={["100vh", 750]} h={["100vh", 750]}>
    <DirectMessage userList={userList} onClose={onClose} isOpen={isOpen}/>
    <Flex minH="inherit" h="inherit">
      <Box minW="400px" display={["none","none", "none", "block"]} >
        <Flex justifyContent="space-between" pr="4" bg="#0316f98a" height="70px" borderRight="1px solid grey" flexWrap='wrap'>
        <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap' p="4">
          <Avatar name='Segun Adebayo' src='https://bit.ly/sage-adebayo' />
          
        </Flex>
        <GroupMessage/>
        <Logout/>
        <IconButton color="black" onClick={dmHandler}>
          <ChatIcon/>
        </IconButton>
        </Flex>


        <Box h="calc(100% - 70px)" minH="calc(100% - 70px)" overflowY="scroll">
          {chats.map((c) => {
            
            const chatUser = c.users[0]._id != logged_user._id ? c.users[0] : c.users[1];

            
            return(
            <>
            <Flex p="3" cursor="pointer" justifyContent="space-between" pr="10" bg={selectedChat == c._id ? "gray" : ""} onClick={() => onChatSelect(c._id)}>

            <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
            {c.isGroupChat ? <Avatar src='https://bit.ly/sage-adebayo' />
: <Avatar name={chatUser.firstName +" " + chatUser.lastName} src='https://bit.ly/sage-adebayo' />}
          
            <Box>
              {c.isGroupChat ? <Heading size='sm'>{c.chatName}</Heading> : <Heading size='sm'>{chatUser.firstName +" " + chatUser.lastName}</Heading>}
              <Text>{c.latestMessage.content}</Text>
            </Box>
            </Flex>
            {c.unreadMessages > 0 ?
            <Box alignSelf="center">

            <Badge color="secondary" badgeContent={c.unreadMessages} max={999} />
            </Box> : ""  }
          </Flex>

          <Divider/></>)})}
          
        </Box>
      </Box>
      <Box minW={["100%", "100%", "100%", "calc(100% - 400px)"]} minH="inherit">
      <Flex flex='1' gap='4' flexWrap='wrap'  p="4" bg="#f0ff2f8a" height="70px">
      {selectedChat.isGroupChat ?<Avatar name="" src='https://bit.ly/sage-adebayo' /> :  <Avatar name={endUser.firstName + " " + endUser.lastName} src='https://bit.ly/sage-adebayo' />}

        <Flex alignSelf="center" flexDirection="column">
          {selectedChat.isGroupChat ? <Heading size='sm'>{selectedChat.chatName}</Heading> : <Heading size='sm'>{endUser.firstName +" " + endUser.lastName}</Heading>}

          {selectedChat.isGroupChat ? "" : <Text>{userOnline ? "online" : ""}</Text>}
        </Flex>
      </Flex>

        <Flex bg="#f5e4e4" height="calc(100% - 145px)" overflowY="scroll" flexDir="column-reverse" pl="5" pr="5">
        {messages.map((m) => 
        <MessageItem message={m}/>
      )}
        </Flex>

        <Flex w="100%" mt="5" h="75px">
      <InputGroup size='lg'>
        <Input
        pr='4.5rem'
        placeholder='Enter password'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        />
      <InputRightElement width='4.5rem'>
        <Button h='1.75rem' size='sm'onClick={sendMessage} >
          sent
        </Button>
      </InputRightElement>
    </InputGroup>
    </Flex>


      </Box>

    </Flex>
    </Box>

   : ""
  
  
  )
}

export default ChatRoom;