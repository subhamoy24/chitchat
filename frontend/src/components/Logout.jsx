import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router';
import { IconButton } from "@material-ui/core";

const Logout = () => {
  const navigate = useNavigate();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    window.location.reload();
    navigate("/login")
  }
  return(
    <IconButton onClick={logoutHandler} bg="transparent" h="100%">
      <LogoutIcon/>
    </IconButton>
  )
}

export default Logout; 