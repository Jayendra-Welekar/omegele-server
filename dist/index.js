"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const UserManager_1 = require("./managers/UserManager");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const httpServer = (0, http_1.createServer)();
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*"
    }
});
const userManger = new UserManager_1.UserManager();
io.on("connection", (socket) => {
    console.log("an io connection made");
    socket.on('new-user', ({ name }) => {
        const user = name;
        userManger.addUser(user, socket);
    });
});
io.on("disconnect", (socket) => {
    console.log("disconencted");
    userManger.removeUser(socket);
});
httpServer.listen(3000);
