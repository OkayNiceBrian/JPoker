import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectMessages, selectUserConnection } from "@/reducers/chatSlice";
import "./styles/Chat.css";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

const Chat = () => {
    const [input, setInput] = useState<string>("");
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const userConnection = useSelector(selectUserConnection);
    const chatMessages = useSelector(selectMessages);

    useEffect(() => {
        const conn = new HubConnectionBuilder().withUrl("https://localhost:44392/gameHub").build();
        conn.start().catch((e) => console.error(e));
        setConnection(conn);
    }, [])
 
    const renderMessages = () => {
        return chatMessages?.map((message) =>
            <div className="chat-message">
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
                <input className="chat-input" type="text" placeholder="Send a message." value={input} onChange={(e) => setInput(e.target.value)}/>
                <button className="chat-sendButton" onClick={() => onClickSend()} disabled={input.length <= 0}>Send</button>
            </div>
        </div>
    );
};

export default Chat;