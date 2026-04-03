import useConnection from "@/hooks/useConnection";
import { addMessage, selectMessages, selectUserConnection } from "@/reducers/chatSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./styles/Chat.css";

const Chat = () => {
    const dispatch = useDispatch();

    const [input, setInput] = useState<string>("");
    const connection = useConnection();
    const userConnection = useSelector(selectUserConnection);
    const chatMessages = useSelector(selectMessages);

    useEffect(() => {
        if (connection) {
            connection.on("ReceiveMessage", (username: string, message: string) => {
                console.log(username + ": " + message);
                dispatch(addMessage(`${username}: ${message}`));
            });
        }
    }, [connection]);
 
    const renderMessages = () => {
        return chatMessages?.map((message, index) =>
            <div key={index} className="chat-message">
                <p>{message}</p>
            </div>
        );
    };

    const onClickSend = () => {
        if (connection && userConnection && input.trim() != "") {
            connection.invoke("SendMessage", userConnection, input.trim());
            setInput("");
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-messagesContainer">
                {renderMessages()}
            </div>
            <div className="chat-inputContainer">
                <input className="chat-input" type="text" placeholder="Send a message." value={input} onKeyDown={(e) => e.key == "Enter" ? onClickSend() : null} onChange={(e) => setInput(e.target.value)}/>
                <button className="chat-sendButton" onClick={() => onClickSend()} disabled={input.length <= 0}>Send</button>
            </div>
        </div>
    );
};

export default Chat;