'use client'
import {
    Mic,
    MicOff,
    MonitorUp,
    MonitorDown, 
    PhoneOff,
    Video,
    VideoOff,
    LoaderCircle,
} from "lucide-react"
import { useLocalParticipant } from "@livekit/components-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface ControlBarProps {
    roomName: string;
}

type MeetingSession = {
    roomName?: string;
    name?: string;
    password?: string;
}

export function ControlBar({ roomName }: ControlBarProps) {
    const router = useRouter()
    const [leaving, setLeaving] = useState(false)
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
        const savedSession = sessionStorage.getItem("cloudian-meet-session")
        let session: MeetingSession | null = null

        try {
            session = savedSession ? JSON.parse(savedSession) as MeetingSession : null
        } catch {
            toast.error("Unable to verify your meeting session")
            return
        }

        if (session?.roomName !== roomName || !session.name || !session.password) {
            toast.error("Unable to verify your meeting session")
            return
        }

        setLeaving(true)
        try {
            const response = await fetch(`/api/meeting/${encodeURIComponent(roomName)}/leave`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: session.name, password: session.password }),
            })
            const payload = await response.json().catch(() => ({})) as { error?: string }

            if (!response.ok) {
                throw new Error(payload.error ?? "Unable to leave meeting")
            }

            sessionStorage.removeItem("cloudian-meet-session")
            sessionStorage.removeItem("cloudian-meet-preferences")
            router.replace(`/meeting/${encodeURIComponent(roomName)}/ended`)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to leave meeting")
            setLeaving(false)
        }
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
                className={`grid size-10 place-items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--meeting-primary)] sm:size-11 ${isScreenShareEnabled ? "bg-[var(--meeting-selected)] text-[var(--meeting-primary)]" : "bg-[var(--meeting-control)] text-[var(--meeting-on-accent)] hover:bg-[var(--meeting-control-hover)]"}`}
            >
                {isScreenShareEnabled? <MonitorUp className="size-5"/> : <MonitorDown className="size-5" />}
            </button>
            <button
                onClick={leaveRoom}
                disabled={leaving}
                aria-label="Leave call"
                title="Leave call"
                className="grid size-10 place-items-center rounded-full bg-[var(--meeting-danger)] text-[var(--meeting-on-accent)] transition-colors hover:bg-[var(--meeting-danger-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--meeting-danger)] disabled:cursor-not-allowed disabled:opacity-60 sm:size-11"
            >
                {leaving ? <LoaderCircle className="size-5 animate-spin" /> : <PhoneOff className="size-5" />}
            </button>
        </div>
    )
}
