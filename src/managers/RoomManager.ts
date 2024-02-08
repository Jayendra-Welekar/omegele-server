import { User } from "./UserManager";
let GLOBAL_ID = 1;

export interface Room{
    user1: User,
    user2: User
}

export class RoomManager {
    private rooms: Map<string, Room>
    constructor(){
        this.rooms = new Map<string, Room>()
    }

    createRoom(user1: User, user2: User){
        console.log("on createRoom")
        const roomId = this.generate().toString()
        this.rooms.set(roomId, {
            user1, 
            user2
        })
        console.log(this.rooms)
        user1.socket.emit("send-offer", ({roomId }))
        user2.socket.emit("send-offer", ({roomId}))
        
    }

    onOffer(roomId:string, sdp:string, senderSocketId:string){
        console.log("on offer")
        const room = this.rooms.get(roomId)
        if(!room){
            return
        }
        const receivingUser = room.user1.socket.id === senderSocketId ? room.user2 : room.user1
        receivingUser?.socket.emit('offer', {
            sdp,
            roomId
        })

        
    }

    deleteRoom(user: User){
        let roomId;
        console.log("on DeleteRoom")
        for( const [key, value] of this.rooms.entries()){
            if(value.user1 == user || value.user2 == user){
                roomId = key;
                break;
            }
        }
        if(roomId){
            const user1 = this.rooms.get(roomId)?.user1
            const user2 = this.rooms.get(roomId)?.user2
            user1?.socket.emit('exit')
            user2?.socket.emit('exit')
            this.rooms.delete(roomId?.toString())}
       }

    onAnswer(roomId:string, sdp:string, senderSocketId:string){
        console.log("on Answer")
        const room = this.rooms.get(roomId)
        if(!room){
            return
        }
        const receivingUser = room.user1.socket.id === senderSocketId ? room.user2 : room.user1
        receivingUser?.socket.emit('answer', {
            sdp,
            roomId
        })
    }

    onIceCandidate(roomId:string, senderSocket:string, candidate:any, type: "sender" | "receiver"){
        console.log("on onIceCandidate")
        const room = this.rooms.get(roomId)
        if(!room){
            return
        }
        const receivingUser = room.user1.socket.id === senderSocket ? room.user2 : room.user1
        receivingUser?.socket.emit('add-Ice-Candidate', {candidate, type})
    }


    generate(){
        return GLOBAL_ID++
    }
}