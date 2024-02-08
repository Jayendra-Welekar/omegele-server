import { Socket } from "socket.io"
import { RoomManager } from "./RoomManager"

export interface User {
    socket: Socket,
    name: string
}

export class UserManager {
    private users: User[]
    private queue: string[]
    private roomManager: RoomManager
    constructor(){
        this.users = []
        this.queue = []
        this.roomManager = new RoomManager()
    }

    addUser(user: string, socket: Socket){
        this.users.push({
            name: user , socket
        })
        this.queue.push(socket.id.toString())
        this.clearQueue()
        this.initHandlers(socket)
    }

    clearQueue(){
        console.log("Entered clearQueue")
        if(this.queue.length < 2){
            return
        }

        let top = this.queue.pop()
        const user2 = this.users.find(x => x.socket.id === top)
        top = this.queue.pop()
        const user1 = this.users.find(x => x.socket.id === top)

        if(!user1 || !user2){
            return 
        }
        console.log("creating room")
        this.roomManager.createRoom(user1, user2)
    }

    initHandlers(socket: Socket){
        socket.on("offer", ({sdp, roomId}:{sdp:string, roomId:string})=>{
            console.log("on offer backend")
            this.roomManager.onOffer(roomId, sdp, socket.id)
        })

        socket.on("answer", ({sdp, roomId}:{sdp:string, roomId:string})=>{
            console.log("on answer backend")
            this.roomManager.onAnswer(roomId, sdp, socket.id)
        })

        socket.on('add-ice-candidate', ({roomId, candidate, type})=>{
            console.log("on add-ice-candidate backend")
            this.roomManager.onIceCandidate(roomId, socket.id, candidate, type)
        })

    }

    removeUser(socket: Socket){
        const user = this.users.find(x => x.socket.id == socket.id)
        this.users = this.users.filter(x => x.socket.id != socket.id)
        if(user){
         this.roomManager.deleteRoom(user)
        }
    }
}