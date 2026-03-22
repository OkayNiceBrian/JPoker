import useConnection from "@/hooks/useConnection";
import { selectMessages, selectUserConnection } from "@/reducers/chatSlice";
import { useState } from "react";
import { useSelector } from "react-redux";
import "./styles/Chat.css";

const Chat = () => {
    const [input, setInput] = useState<string>("");
    const connection = useConnection();
    const userConnection = useSelector(selectUserConnection);
    const chatMessages = useSelector(selectMessages);
 
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