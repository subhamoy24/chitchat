import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router"

const Authenticate = (props) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.value);

  useEffect(() => {
    console.log(user)
    if(!user || !user.token) {
      navigate("/login");
    }

    try {
     
      
    } catch (error) {
        navigate("/login")
    }
    
  }, []);
  
  return props.child;
}

export default Authenticate;