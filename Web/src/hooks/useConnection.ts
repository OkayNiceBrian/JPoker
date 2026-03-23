import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr"
import { useEffect, useState } from "react"

const useConnection = () => {
    const [connection, setConnection] = useState<HubConnection | null>(null);

    useEffect(() => {
        const conn = new HubConnectionBuilder().withUrl("https://localhost:44392/gameHub").build();
        
        conn.start().then(() => {
            setConnection(conn);
        }).catch((e) => console.error(e));
    }, []);

    return connection;
};

export default useConnection;