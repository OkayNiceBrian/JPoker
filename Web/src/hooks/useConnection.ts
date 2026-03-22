import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr"
import { useEffect, useState } from "react"

const useConnection = () => {
    const [connection, setConnection] = useState<HubConnection | null>(null);

    useEffect(() => {
        const startConnection = async (connection: HubConnection) => {
            await connection.start().catch((e) => console.error(e));
        }

        const conn = new HubConnectionBuilder().withUrl("https://localhost:44392/gameHub").build();
        startConnection(conn);
        setConnection(conn);
    }, []);

    return connection;
};

export default useConnection;