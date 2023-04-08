import { useSelector } from "react-redux";

const { Box, Flex, Avatar } = require("@chakra-ui/react")

const MessageItem = ({message}) => {
  const user = useSelector((state) => state.user.value);
  return(
    <Box mb="4" ml= {user._id == message.sender._id ? "auto": "0"}>
      <Flex gap='4' flexWrap='wrap' w="100%">
        <Avatar name={message.sender.firstName +" " +  message.sender.lastName} src='https://bit.ly/sage-adebayo' maxW="50px" />
        <Box p="4" bg={user._id == message.sender._id ? "grey": "#7ed7f3"} borderRadius="20">{message.content}</Box>
      </Flex>
    </Box>
  )
}

export default MessageItem;