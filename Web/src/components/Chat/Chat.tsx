import { useState } from "react";
import { useSelector } from "react-redux";
import { chatState } from "@/reducers/chatSlice";
import "./styles/Chat.css";

const Chat = () => {
    const [input, setInput] = useState<string>("");
    const chatMessages = useSelector((state: chatState) => state.messages);
 
    const renderMessages = () => {
        return chatMessages.map((message) =>
            <div className="chat-message">
                <p>{message}</p>
            </div>
        );
    };

    const onClickSend = () => {

    };

    return (
        <div className="chat-container">
            <div className="chat-messagesContainer">
                {renderMessages()}
            </div>
            <div className="chat-inputContainer">
                <input className="chat-input" type="text" placeholder="Send a message." value={input} onChange={(e) => setInput(e.target.value)}/>
                <button className="chat-sendButton" onClick={() => onClickSend()} disabled={input.length <= 0}>Send</button>
            </div>
        </div>
    );
};

export default Chat;