'use client'
import { useEffect , useState } from 'react'
import {Room} from 'livekit-client' 

interface MeetingRoomProps {
    roomName : string 
} 

export default function MeetingRoom({
    roomName 
} : MeetingRoomProps) {
    const [status , setStatus] = useState("Disconnected") 
    const [identity , setIdentity] = useState("") 
    useEffect(() => {
        let room : Room | null =  null 
        async function connectRoom() {
            try {
                //Lay access token 
                const response = await fetch('/api/token' , {
                    headers: {
                        "Content-Type": "application/json"
                    }, 
                    method: "POST", 
                    body: JSON.stringify({
                        roomName, 
                        identity: "bob-123" 
                    })
                })
                console.log("ket qua la:" , response) 
                if (!response.ok) 
                    throw new Error("Failed to get Livekit token")
                const payload = await response.json() 
                console.log("Payload la: " , payload)
                setStatus("...connecting") 
                //Ket noi vao trong room 
                room = new Room() 
                await room.connect(
                    payload.serverUrl, payload.token 
                )
                setIdentity(payload.localParticipant.identity) 
                setStatus("Connected") 
                
            }
            catch (err) {
                console.log(err) 
                setStatus("Connected Failed")
            }
        }
        connectRoom() 
        return () => {
            if (room) room.disconnect() 
        }
    } , [roomName])
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">
                Cloudian Meeting
            </h1>

            <p>Room: {roomName}</p>

            <p>Identity: {identity || "..."}</p>

            <p>Status: {status}</p>
        </div>
    )
}