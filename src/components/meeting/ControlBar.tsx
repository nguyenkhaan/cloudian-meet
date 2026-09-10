'use client'
import {
    Mic,
    MicOff,
    MonitorUp,
    MonitorDown, 
    PhoneOff,
    Video,
    VideoOff,
} from "lucide-react"
import { useLocalParticipant, useRoomContext } from "@livekit/components-react";

export function ControlBar() {
    const room = useRoomContext()
    const {
        localParticipant,
        isMicrophoneEnabled,
        isCameraEnabled,
        isScreenShareEnabled,
    } = useLocalParticipant()

    const toggleMicrophone = async () => {
        await localParticipant.setMicrophoneEnabled(
            !localParticipant.isMicrophoneEnabled,
        )
    }

    const toggleCamera = async () => {
        await localParticipant.setCameraEnabled(
            !localParticipant.isCameraEnabled,
        )
    }

    const toggleScreenShare = async () => {
        await localParticipant.setScreenShareEnabled(
            !localParticipant.isScreenShareEnabled,
        )
    }

    const leaveRoom = async () => {
        await room.disconnect()
    }
    return (
        <div className="flex items-center justify-center gap-1 sm:gap-2">
            <button
                onClick={toggleMicrophone}
                aria-label={isMicrophoneEnabled ? "Turn microphone off" : "Turn microphone on"}
                title={isMicrophoneEnabled ? "Turn microphone off" : "Turn microphone on"}
                className={`grid size-10 place-items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--meeting-primary)] sm:size-11 ${isMicrophoneEnabled ? "bg-[var(--meeting-control)] text-[var(--meeting-on-accent)] hover:bg-[var(--meeting-control-hover)]" : "bg-[var(--meeting-danger)] text-[var(--meeting-on-accent)] hover:bg-[var(--meeting-danger-hover)]"}`}
            >
                {isMicrophoneEnabled? <Mic className="size-5"/> : <MicOff className="size-5" />}
            </button>
            <button
                onClick={toggleCamera}
                aria-label={isCameraEnabled ? "Turn camera off" : "Turn camera on"}
                title={isCameraEnabled ? "Turn camera off" : "Turn camera on"}
                className={`grid size-10 place-items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--meeting-primary)] sm:size-11 ${isCameraEnabled ? "bg-[var(--meeting-control)] text-[var(--meeting-on-accent)] hover:bg-[var(--meeting-control-hover)]" : "bg-[var(--meeting-danger)] text-[var(--meeting-on-accent)] hover:bg-[var(--meeting-danger-hover)]"}`}
            >
                {isCameraEnabled? <Video className="size-5"/> : <VideoOff className="size-5" />}
            </button>
            <button
                onClick={toggleScreenShare}
                aria-label={isScreenShareEnabled ? "Stop presenting" : "Present now"}
                title={isScreenShareEnabled ? "Stop presenting" : "Present now"}
                className={`hidden size-10 place-items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--meeting-primary)] sm:grid sm:size-11 ${isScreenShareEnabled ? "bg-[var(--meeting-selected)] text-[var(--meeting-primary)]" : "bg-[var(--meeting-control)] text-[var(--meeting-on-accent)] hover:bg-[var(--meeting-control-hover)]"}`}
            >
                {isScreenShareEnabled? <MonitorUp className="size-5"/> : <MonitorDown className="size-5" />}
            </button>
            <button
                onClick={leaveRoom}
                aria-label="Leave call"
                title="Leave call"
                className="grid size-10 place-items-center rounded-full bg-[var(--meeting-danger)] text-[var(--meeting-on-accent)] transition-colors hover:bg-[var(--meeting-danger-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--meeting-danger)] sm:size-11"
            >
                <PhoneOff className="size-5" />
            </button>
        </div>
    )
}
