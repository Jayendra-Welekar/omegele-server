import express from "express"
import { Server, Socket } from "socket.io";
import { createServer } from "http"
import cors from "cors"
import { UserManager } from "./managers/UserManager";

const app = express()
app.use(express.json())
app.use(cors())

const httpServer = createServer()
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
})

const userManger = new UserManager()

io.on("connection", (socket: Socket)=>{
    console.log("an io connection made")

    socket.on('new-user', ({name}:{name:string})=>{
        const user = name
        userManger.addUser(user, socket)
    })
    io.on("disconnect", (socket: Socket)=>{
        console.log("disconencted")
        userManger.removeUser(socket)
    })

})

httpServer.listen(3000, ()=>{
    console.log("listening httpServer on port 3000")
})