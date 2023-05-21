import { Card, Flex, Avatar, Box, IconButton, Heading, Text, Spacer } from "@chakra-ui/react"
import {ChatIcon} from "@chakra-ui/icons";
import axios from "axios";
import { useSelector } from "react-redux";
import { generatePath, useNavigate } from "react-router";

const GroupUserItem = ({userList, setUserList, selectedUserList, setSelectedUserList, user}) => {
  const logged_user = useSelector((state) => state.user.value);
  const navigate = useNavigate();

  
  const chatHandler = (userId) => {

    for(let i = 0; i < userList.length; i++) {
      if(userList[i]._id == userId) {
        if(userId in selectedUserList) {
          delete selectedUserList[userId]
          setSelectedUserList({...selectedUserList})
        } else {
          selectedUserList[userId] = userList[i];
          setSelectedUserList({...selectedUserList});
        }
      }
    }
    console.log(selectedUserList);
  }

  return(
    <Card overflow='hidden' variant='outline' marginBottom="2" onClick={() => chatHandler(user._id)} cursor="pointer">
      <Flex justifyContent="space-between" p="2" bg={user._id in selectedUserList? "green" : ""}>
        <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
          <Avatar name={user.firstName +" "+ user.lastName} src={user.avatar} />
          <Box>
            <Heading size='sm'>{user.firstName +" "+ user.lastName}</Heading>
          </Box>
        </Flex>
      </Flex>
    </Card>
    )
}

export default GroupUserItem;