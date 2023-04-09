import { useEffect, useState } from "react";
import io from "socket.io-client"
var  socket = io.connect(process.env.REACT_APP_END_POINT);
const SingleChat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    
    useEffect(() => {
        socket.emit("join_room", "pop");
    }, [])

    useEffect(() => {
        socket.on("receive_message", (data) => {
            console.log(messages, data)
            setMessages((prev_messages) => [...prev_messages, data]);
        });
    }, [])


    const sendMessage = async () => {
        if(message && socket) {
            const data = {room_id: "pop", message: message}
            await socket.emit("send_message", data);

        }
    };

    const onChangeMessage = (value) => {
        setMessage(value);
    };

    return(
        <div>
            {messages.length > 0 ? messages.map((m) => <p>
                {m}
            </p>): ""}

            <input type="text" onChange={(e) => {onChangeMessage(e.target.value)}}/>
            <button onClick={() => sendMessage()}>send</button>
        </div>
    )
}

export default SingleChat;