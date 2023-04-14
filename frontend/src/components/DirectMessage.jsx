import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Input,
  Box,
} from '@chakra-ui/react';
import UserItem from "./UserItem";
import { useState, React } from 'react';
import axios from 'axios';

var timer
export default function DirectMessage({userList, isOpen, onClose, setUserList}){
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

  return (
    <>  
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} scrollBehavior={"inside"}>
      <ModalOverlay />
      <ModalContent>
      <ModalHeader>Users</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Input placeholder='search..' size="md" mb="5" onChange={searchChange} value={searchTerm}/>

        <Box maxH="300" p="4" onScroll={onScrollHandler} overflowY="scroll">
          {userList.map((u) => <UserItem user={u}/>)}
        </Box>
      </ModalBody>
  
      <ModalFooter>
        <Button colorScheme='blue' mr={3} onClick={onClose}>
        Close
        </Button>
      </ModalFooter>
      </ModalContent>
    </Modal>
    </>
  )
}