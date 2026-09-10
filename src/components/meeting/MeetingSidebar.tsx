"use client";

import { useParticipants } from "@livekit/components-react";
import { Mic, MicOff, X } from "lucide-react";

interface MeetingSidebarProps {
    onClose: () => void;
}

export default function MeetingSidebar({ onClose }: MeetingSidebarProps) {
    const participants = useParticipants()

    return (
        <aside className="absolute inset-x-3 bottom-24 top-3 z-30 flex flex-col overflow-hidden rounded-xl border border-[var(--meeting-border)] bg-[var(--meeting-surface)] shadow-2xl sm:relative sm:inset-auto sm:my-3 sm:mr-3 sm:w-80 sm:shrink-0 lg:w-96">
            <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--meeting-border)] px-4">
                <h2 className="font-medium text-[var(--meeting-text)]">Participants ({participants.length})</h2>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close side panel"
                    className="grid size-9 place-items-center rounded-full text-[var(--meeting-text-muted)] transition-colors hover:bg-[var(--meeting-hover)] hover:text-[var(--meeting-text)]"
                >
                    <X className="size-5" />
                </button>
            </header>
            <div className="flex-1 overflow-y-auto p-3">
                <p className="px-2 pb-2 pt-1 text-xs font-medium uppercase tracking-wide text-[var(--meeting-text-muted)]">In this meeting</p>
                {participants.map((participant) => {
                    const displayName = participant.name || participant.identity
                    const initials = displayName.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()
                    return (
                        <div key={participant.identity} className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-[var(--meeting-hover)]">
                            <div className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--meeting-avatar)] text-sm font-medium text-[var(--meeting-text)]">
                                {initials}
                            </div>
                            <span className="min-w-0 flex-1 truncate text-sm text-[var(--meeting-text)]">
                                {displayName}{participant.isLocal ? " (You)" : ""}
                            </span>
                            {participant.isMicrophoneEnabled
                                ? <Mic className="size-4 text-[var(--meeting-text-muted)]" />
                                : <MicOff className="size-4 text-[var(--meeting-danger)]" />}
                        </div>
                    )
                })}
            </div>
        </aside>
    )
}
