'use client'
import {
    Room,
    RoomEvent,
    Track,
    type LocalTrackPublication,
} from "livekit-client"
import { useEffect, useState } from "react";
import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    MonitorUp,
    MonitorDown, 
    PhoneOff,
} from "lucide-react"
interface ControlBarProps {
    room: Room
}
export function ControlBar({room} : ControlBarProps) {
    const [isMicrophoneEnabled , setIsMicrophoneEnabled] = useState(
        room.localParticipant.isMicrophoneEnabled
    )
    const [isCameraEnabled, setIsCameraEnabled] = useState(
        room.localParticipant.isCameraEnabled,
    )

    const [isScreenShareEnabled, setIsScreenShareEnabled] = useState(
        room.localParticipant.isScreenShareEnabled,
    )
    useEffect(() => {
        const syncTrackState = (publication : LocalTrackPublication , enabled : boolean) => {
            switch (publication.source) {
                case Track.Source.Camera: 
                    setIsCameraEnabled(enabled) 
                    break 
                case Track.Source.ScreenShare: 
                    setIsScreenShareEnabled(enabled) 
                    break 
                case Track.Source.Microphone: 
                    setIsMicrophoneEnabled(enabled) 
                    break 
            }
        }
        const handleTrackPublished = (publication : LocalTrackPublication) => {
            syncTrackState(publication , true)
        }
        const handleTrackUnpublished = (publication : LocalTrackPublication) => {
            syncTrackState(publication , false)
        } 
        room.on(RoomEvent.LocalTrackPublished , handleTrackPublished) 
        room.on(RoomEvent.LocalTrackUnpublished , handleTrackUnpublished)
        return () => {
            room.off(
                RoomEvent.LocalTrackUnpublished, handleTrackUnpublished
            ) 
            room.off(
                RoomEvent.LocalTrackPublished , handleTrackPublished
            )
        }
    } , [room])
    //function pass to button     
    const toggleMicrophone = async () => {
        await room.localParticipant.setMicrophoneEnabled(
            !room.localParticipant.isMicrophoneEnabled,
        )
    }

    const toggleCamera = async () => {
        await room.localParticipant.setCameraEnabled(
            !room.localParticipant.isCameraEnabled,
        )
    }

    const toggleScreenShare = async () => {
        await room.localParticipant.setScreenShareEnabled(
            !room.localParticipant.isScreenShareEnabled,
        )
    }

    const leaveRoom = async () => {
        await room.disconnect()
    }
    return (
        <div className="flex items-center justify-center gap-3">
            <button
                onClick={toggleMicrophone}
                aria-label={isMicrophoneEnabled? "Microphone turn on" : "Microphone turn off"}
                className="rounded-full bg-gray-200 p-3 hover:bg-gray-300"
            >
                {isMicrophoneEnabled? <Mic className="size-5"/> : <MicOff className="size-5" />}
            </button>
            <button
                onClick={toggleCamera}
                aria-label={isCameraEnabled? "Camera turn on" : "Camera turn down"}
                className="rounded-full bg-gray-200 p-3 hover:bg-gray-300"
            >
                {isCameraEnabled? <Video className="size-5"/> : <VideoOff className="size-5" />}
            </button>
            <button
                onClick={toggleScreenShare}
                aria-label={isMicrophoneEnabled? "Monitor up" : "Monitor down"}
                className="rounded-full bg-gray-200 p-3 hover:bg-gray-300"
            >
                {isScreenShareEnabled? <MonitorUp className="size-5"/> : <MonitorDown className="size-5" />}
            </button>

            <button
                onClick={leaveRoom}
                aria-label={isMicrophoneEnabled? "Microphone turn on" : "Microphone turn off"}
                className="rounded-full bg-gray-200 p-3 hover:bg-gray-300"
            >
                <PhoneOff /> 
            </button>
        </div>
    )
}