'use client'
import { useParticipants } from "@livekit/components-react";
import { Clock3, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { ControlBar } from "./ControlBar";

interface MeetingControlProps {
    roomName: string;
    sidebarOpen: boolean;
    onSidebarToggle: () => void;
}

export default function MeetingControl({ roomName, sidebarOpen, onSidebarToggle }: MeetingControlProps) {
    const participants = useParticipants()
    const [time, setTime] = useState("")

    useEffect(() => {
        const updateTime = () => setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
        updateTime()
        const timer = window.setInterval(updateTime, 30_000)
        return () => window.clearInterval(timer)
    }, [])

    return (
        <div className="pointer-events-none absolute inset-x-2 bottom-2 z-40 sm:inset-x-3 sm:bottom-3">
            <div className="pointer-events-auto mx-auto grid min-h-16 w-full grid-cols-[1fr_auto_1fr] items-center rounded-2xl border border-[var(--meeting-border)] bg-[var(--meeting-surface)]/95 px-2 shadow-2xl backdrop-blur-xl sm:rounded-full sm:px-3">
                <div className="hidden min-w-0 items-center gap-3 px-2 xl:flex">
                    <Clock3 className="size-4 shrink-0 text-[var(--meeting-text-muted)]" />
                    <span className="shrink-0 text-sm text-[var(--meeting-text)]">{time}</span>
                    <span className="text-[var(--meeting-text-muted)]">•</span>
                    <span className="truncate text-sm font-medium text-[var(--meeting-text)]">{roomName}</span>
                </div>
                <div className="col-start-2">
                    <ControlBar />
                </div>
                <div className="flex items-center justify-end gap-1">
                    <button
                        type="button"
                        onClick={onSidebarToggle}
                        aria-label="Toggle participants"
                        aria-pressed={sidebarOpen}
                        title="Participants"
                        className={`relative grid size-10 place-items-center rounded-full transition-colors ${sidebarOpen ? "bg-[var(--meeting-selected)] text-[var(--meeting-primary)]" : "text-[var(--meeting-text)] hover:bg-[var(--meeting-hover)]"}`}
                    >
                        <Users className="size-5" />
                        <span className="absolute -right-0.5 -top-0.5 min-w-4 rounded-full bg-[var(--meeting-surface-muted)] px-1 text-center text-[10px] leading-4 text-[var(--meeting-text)]">{participants.length}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
