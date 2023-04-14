import { useEffect } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";

const SentStatus = () => {
  const logged_user = useSelector((state) => state.user.value);

  useEffect(() => {
    if(logged_user) {
      const socket = io.connect(process.env.REACT_APP_END_POINT);
      const sent = () => {
        console.log("lop");
        socket.emit("online", logged_user._id);
      }
  
      setInterval(sent, 3000)
    }
  }, [])

  return(
    <></>
  )

}

export default SentStatus;
