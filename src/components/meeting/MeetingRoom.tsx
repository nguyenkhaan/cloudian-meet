'use client'
import { useEffect , useState } from 'react'
import {RemoteVideoTrack, Room, RoomEvent, Track} from 'livekit-client' 
import type {RemoteTrack , RemoteTrackPublication , RemoteParticipant, LocalVideoTrack} from 'livekit-client'
import VideoTile from './VideoTile';
import LocalVideoTile from './LocalVideoTile';
interface MeetingRoomProps {
    roomName : string 
} 

interface RemoteVideo {
    identity: string;
    track: RemoteVideoTrack;
}

export default function MeetingRoom({
    roomName 
} : MeetingRoomProps) {
    const [status , setStatus] = useState("Disconnected") 
    const [identity , setIdentity] = useState("") 
    const [remoteVideos , setRemoteVideos] = useState<RemoteVideo[]>([])
    const [localVideo , setLocalVideo] = useState<LocalVideoTrack | null>(null)
    //When a remote video track is subscribe 
    const trackSubscribeHandler = (track: RemoteTrack , publication : RemoteTrackPublication, participant : RemoteParticipant) => {
        if (track.kind != Track.Kind.Video) return 
        setRemoteVideos((current) => {
            const alreadyExists = current.some(
                (video) => video.identity === participant.identity &&
                video.track.sid === track.sid
            )
            if (alreadyExists) return current 
            return [{
                identity: participant.identity, 
                track 
            } , ...current] as RemoteVideo[] 
        })
    }
    //When remote video track unsubscribe => We have to delete all the remote videos have sid the same with that track 
    const trackUnsubscribeHandler = (track : RemoteTrack , publication: RemoteTrackPublication , participant : RemoteParticipant) => {
        if (track.kind != Track.Kind.Video) return 
        setRemoteVideos((current) => {
            return current.filter((video) => video.track.sid !== track.sid)
        })
    }
    //When a participant leaves the room 
    const leaveRoomHandler = (participant : RemoteParticipant) => {
        setRemoteVideos((current) => current.filter((video) => video.identity !== participant.identity))
    }
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
                        //Hien tai chi thuc hien mock user id 
                        identity: `$user-${crypto.randomUUID()}` 
                    })
                })
                if (!response.ok) 
                    throw new Error("Failed to get Livekit token")
                const payload = await response.json() 
                console.log("Payload la: " , payload)
                setStatus("...connecting") 
                //Ket noi vao trong room 
                room = new Room() 
                
                //Listening functions events
                //Video track subsrcibed  
                room.on(RoomEvent.TrackSubscribed , trackSubscribeHandler)
                //Video track unsubscribe 
                room.on(RoomEvent.TrackUnsubscribed , trackUnsubscribeHandler)
                //User leaves the room 
                room.on(RoomEvent.ParticipantDisconnected , leaveRoomHandler)
                
                await room.connect(
                    payload.serverUrl, payload.token 
                )
                //Thuc hien yeu cau browser cho phep chung ta bat camera va truy cap microphone 
                await room.localParticipant.setCameraEnabled(true) 
                //Sau khi enable camera thi dang ky track camera nay vao ben trong local video 
                const cameraPublication = room.localParticipant.getTrackPublication(
                    Track.Source.Camera, 
                ) 
                if (cameraPublication?.track) 
                    setLocalVideo(
                        cameraPublication.track as LocalVideoTrack
                    )
                await room.localParticipant.setMicrophoneEnabled(true)
                setIdentity(room.localParticipant.identity) 
                //Tuy nhien, sau buoc nay chung ta van chua co hinh video hient hi, chio moi hien len o de bao yeu cau permission tu nguoi dung 

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
        <div className="min-h-screen bg-zinc-950 text-white">
           
            <div className="border-b border-zinc-800 p-4"> 
                <h1 className="text-2xl font-bold">
                    Cloudian Meeting
                </h1>
                <p>Room: {roomName}</p>
                <p>Identity: {identity || "..."}</p>
                <p>Status: {status}</p>
            </div>
            {/* Giup hien thi cac remote Video */}
            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2" >
                
                {localVideo && (
                    <LocalVideoTile identity={identity} track={localVideo} /> 
                )}
                
                {remoteVideos.map((video) => (
                    <VideoTile key={video.track.sid} identity = {video.identity} track={video.track} /> 
                ))}
            </div>
            {/* Giup hien thi local video (Video cua chinh minh) */}
        </div>
    )
}