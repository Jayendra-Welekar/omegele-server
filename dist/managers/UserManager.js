"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
const RoomManager_1 = require("./RoomManager");
class UserManager {
    constructor() {
        this.users = [];
        this.queue = [];
        this.roomManager = new RoomManager_1.RoomManager();
    }
    addUser(user, socket) {
        this.users.push({
            name: user, socket
        });
        console.log("adding new user ", user);
        this.queue.push(socket.id.toString());
        socket.emit("lobby");
        console.log("sendin lobby");
        this.clearQueue();
        this.initHandlers(socket);
    }
    clearQueue() {
        console.log("Entered clearQueue");
        console.log("This is current set of users: ", this.users);
        if (this.queue.length < 2) {
            return;
        }
        let top = this.queue.pop();
        const user2 = this.users.find(x => x.socket.id === top);
        top = this.queue.pop();
        const user1 = this.users.find(x => x.socket.id === top);
        if (!user1 || !user2) {
            return;
        }
        console.log("creating room");
        this.roomManager.createRoom(user1, user2);
    }
    initHandlers(socket) {
        socket.on("offer", ({ sdp, roomId }) => {
            console.log("on offer backend");
            this.roomManager.onOffer(roomId, sdp, socket.id);
        });
        socket.on("answer", ({ sdp, roomId }) => {
            console.log("on answer backend");
            this.roomManager.onAnswer(roomId, sdp, socket.id);
        });
        socket.on('add-ice-candidate', ({ roomId, candidate, type }) => {
            console.log("on add-ice-candidate backend");
            this.roomManager.onIceCandidate(roomId, socket.id, candidate, type);
        });
    }
    removeUser(socket) {
        this.users = this.users.filter(x => x.socket.id != socket.id);
    }
}
exports.UserManager = UserManager;
