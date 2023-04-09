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

var  socket;

const ChatList = () => {
  const logged_user = useSelector((state) => state.user.value);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ userList, setUserList ] = useState([]);
  

  const navigate = useNavigate();

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
      const data = await axios.get(`${process.env.REACT_APP_END_POINT4}/api/chat/view-chat?userId=${logged_user._id}&chatId=${chatId}`);
      console.log(data)
      navigate(`/chat/${chatId}`);
    }catch(err) {

    }
  }

 
  const getChats = async () => {
    const data = await axios.get(`${process.env.REACT_APP_END_POINT}/api/chat/user-chats?userId=${logged_user._id}`);
    socket = io.connect(process.env.REACT_APP_END_POINT);
    await socket.emit("join_room", logged_user._id);
    socket.on("receive_chat", async (data) => {
      console.log(data)
      updateChats();
    });
    console.log(data.data);
    setChats(data.data);
  }
  useEffect(() => {
    console.log(process.env.REACT_APP_END_POINT, "ppp");
    if(!logged_user) {
      navigate('/login');
    }
    getChats();
    onClose();
  }, [])

 
  return(
   logged_user ?
   <Box ml={[0, 10, 100]} mr={[0, 10, 100]} mt={[0, 5, 10]} minH={["100vh", "100vh", "870"]}>
    <DirectMessage userList={userList} onClose={onClose} isOpen={isOpen}/>
    <Flex minH="inherit">
      <Box w="100%" >
        <Flex justifyContent="space-between" pr="4" bg="#f0ff2f8a" height="70px" flexWrap='wrap'>
        <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap' p="4">
          <Avatar name='Segun Adebayo' src='https://bit.ly/sage-adebayo' />
          
          <Box>
            <Heading size='sm'>{logged_user.name}</Heading>
          </Box>
        </Flex>
        <IconButton color="black" onClick={dmHandler}>
          <ChatIcon/>
        </IconButton>
        </Flex>


        <Box minH="calc(100% - 70px)" overflowY="scroll">
          {chats.map((c) => {
            
            const chatUser = c.users[0]._id != logged_user._id ? c.users[0] : c.users[1];

            
            return(
            <>
            <Flex p="3" justifyContent="space-between" pr="10" bg={selectedChat == c._id ? "gray" : ""} onClick={() => onChatSelect(c._id)}>

            <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
            <Avatar name={chatUser.firstName +" " + chatUser.lastName} src='https://bit.ly/sage-adebayo' />
          
            <Box>
              <Heading size='sm'>{chatUser.firstName +" " + chatUser.lastName}</Heading>
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
    
    </Flex>
    </Box> : "" 
  )
}

export default ChatList;
