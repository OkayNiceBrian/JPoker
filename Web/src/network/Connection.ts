import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

export class Connection {

    private static connection: Connection;
    private hubConnection: HubConnection = new HubConnectionBuilder().withUrl("https://localhost:44392/gameHub").build();

    private constructor() {
        Connection.connection = this;
    }

    public static getConnection(): Connection {
        return Connection.connection;
    }

    public getHubConnection(): HubConnection {
        return this.hubConnection;
    }
}