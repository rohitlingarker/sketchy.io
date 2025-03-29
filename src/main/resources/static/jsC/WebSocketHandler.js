export default class WebSocketHandler {
    constructor(roomId, username) {
        this.stompClient = null;
        this.roomId = roomId;
        this.username = username;
        this.turn = false;
        this.word = null;
    }

    connect(onConnectCallback, onErrorCallback) {
        const socket = new SockJS("/ws");
        this.stompClient = Stomp.over(socket);
        this.stompClient.connect({}, onConnectCallback, onErrorCallback);
    }

    subscribe(channel, callback) {
        this.stompClient.subscribe(channel, callback);
    }

    sendMessage(destination, message) {
        this.stompClient.send(destination, {}, JSON.stringify(message));
    }
}
