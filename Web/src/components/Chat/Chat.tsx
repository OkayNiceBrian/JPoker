import { useState } from "react";
import "./styles/Chat.css";

const Chat = () => {
    const [input, setInput] = useState<string>("");
 
    const renderMessages = () => {
        return <div></div>;
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
                <button className="chat-sendButton" onClick={() => onClickSend()}>Send</button>
            </div>
        </div>
    );
};

export default Chat;