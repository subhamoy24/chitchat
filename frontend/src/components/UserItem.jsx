import { Card, Flex, Avatar, Box, IconButton, Heading, Text, Spacer } from "@chakra-ui/react"
import {ChatIcon} from "@chakra-ui/icons";
import axios from "axios";
import { useSelector } from "react-redux";
import { generatePath, useNavigate } from "react-router";

const UserItem = ({user}) => {
  const logged_user = useSelector((state) => state.user.value);
  const navigate = useNavigate();

  
  const chatHandler = async () => {

    try {
      const data = await axios.post(`${process.env.END_POINT}/api/chat`, {userId1: logged_user._id, userId2: user._id });
      const chat = data.data.chat;
      const chat_id = chat._id;
      console.log(chat_id);
      navigate(`/chat/${chat_id}`);
    } catch(err) {
      console.log(err);
    }

  }
  return(
    <Card overflow='hidden' variant='outline' marginBottom="2">
      <Flex justifyContent="space-between" p="2">
        <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
          <Avatar name={user.firstName +" "+ user.lastName} src={user.avatar} />
          <Box>
            <Heading size='sm'>{user.firstName +" "+ user.lastName}</Heading>
          </Box>
        </Flex>
        <IconButton
        variant='ghost'
        colorScheme='gray'
        aria-label='chat'
        onClick={chatHandler}
        icon={<ChatIcon/>}/>
      </Flex>
    </Card>
    )
}

export default UserItem;