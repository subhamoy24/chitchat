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
} from '@chakra-ui/react';
import UserItem from "./UserItem";


const DirectMessage = ({userList, isOpen, onClose}) => {

  return (
    <>  
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} scrollBehavior={"inside"}>
      <ModalOverlay />
      <ModalContent>
      <ModalHeader>Users</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {userList.map((u) => <UserItem user={u}/>)}
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
export default DirectMessage;