import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router';
import { IconButton } from '@chakra-ui/react';
const Logout = () => {
  const navigate = useNavigate();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/login")
  }
  return(
    <IconButton onClick={logoutHandler} bg="transparent" h="100%">
      <LogoutIcon/>
    </IconButton>
  )
}

export default Logout; 