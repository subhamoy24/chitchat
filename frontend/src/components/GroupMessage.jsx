import {   Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Input,
  Box, useDisclosure, Flex, Tag, Avatar, TagLabel } from "@chakra-ui/react";
import { IconButton } from "@material-ui/core";

import GroupIcon from '@mui/icons-material/Group';
import axios from "axios";
import { useState } from "react";
import GroupUserItem from "./GroupUserItem";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";


const GroupMessage = () => {
  const logged_user = useSelector((state) => state.user.value);
  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userList, setUserList] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [selectedUserList, setSelectedUserList] = useState({});
  const [name, setName] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  console.log(setUserList);

  const onScrollHandler = async(e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 25;
		if(bottom && !loading){
      setLoading(true);
      const result = await axios.get(`${process.env.REACT_APP_END_POINT}/api/user/list?page=${page}&search=${e.target.value}`);
      let pg = page + 1;
			setPage(pg);
      setUserList([...userList, ...result.data]);
      setLoading(false);
		}

  }

  const searchChange = async (e) => {
    setSearchTerm(e.target.value);
    try {
    const result = await axios.get(`${process.env.REACT_APP_END_POINT}/api/user/list?page=1&search=${e.target.value}`);
    setPage(2);
    setUserList(result.data);
    } catch(e) {

    }
  }

  const groupHandler = async() => {
    if(userList.length == 0) {
      const result = await axios.get(`${process.env.REACT_APP_END_POINT}/api/user/list`);
      setUserList((prev) => [...prev, ...result.data]);
      console.log(result.data);
    }
  
    onOpen();
  }

  const selectedUser = () => {
    let arr = []
    for(const key in selectedUserList) {
      const user = selectedUserList[key]
      arr.push(user)
    }

    return arr.map((u) => (
      <Tag size='lg' colorScheme='blue' borderRadius='full'>
  <Avatar
    src='https://bit.ly/sage-adebayo'
    size='xs'
    name={u.firstName+" "+u.lastName}
    ml={-1}
    mr={2}
  />
  <TagLabel>{u.firstName+" "+u.lastName}</TagLabel>
</Tag>
    ))

  }

  const nameChange = async (e) => {
    setName(e.target.value);
  }

  const createGroup = async () => {
    if(name  == "") {
      return
    }

    let users = []
    for(let key in selectedUserList) {
      users.push(key)
    }
    
    setDisabled(true)
    const data = await axios.post(`${process.env.REACT_APP_END_POINT}/api/chat/group`, {chatName: name, users: users, admin: logged_user._id});
    const chat = data.data.chat;
    const chat_id = chat._id;
    console.log(chat_id);
    setDisabled(false)
    navigate(`/chat/${chat_id}`);
  }

  return(
  <>
  <IconButton color="black" onClick={groupHandler}>
    <GroupIcon/>
  </IconButton>
  <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} scrollBehavior={"inside"}>
  <ModalOverlay />
  <ModalContent>
  <ModalHeader>Create Group</ModalHeader>
  <ModalCloseButton />
  <ModalBody>
    <Input placeholder="name.." size="md" mb="5" onChange={nameChange} value={name}/>
    <small>{}</small>
    <Input placeholder='search..' size="md" mb="5" onChange={searchChange} value={searchTerm}/>
    <Flex>
      {selectedUser()}
    </Flex>

    <Box maxH="300" p="4" onScroll={onScrollHandler} overflowY="scroll">
      {userList.map((u) => <GroupUserItem selectedUserList={selectedUserList} setSelectedUserList={setSelectedUserList} userList={userList} setUserList={setUserList} user={u}/>)}
    </Box>
  </ModalBody>

  <ModalFooter>
    <Button colorScheme='blue' mr={3} onClick={createGroup} disabled={disabled}>
      create
    </Button>
  </ModalFooter>
  </ModalContent>
</Modal>
</>
)

}

export default GroupMessage;