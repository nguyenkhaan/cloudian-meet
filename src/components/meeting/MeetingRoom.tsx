"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import VideoGrid from "./VideoGrid";
import MeetingControl from "./MeetingControl"
import MeetingSidebar from "./MeetingSidebar";

interface MeetingRoomProps {
    roomName: string;
}

type MeetingSession = {
    roomName: string;
    token: string;
    serverUrl: string;
}

type MeetingPreferences = {
    cameraEnabled: boolean;
    microphoneEnabled: boolean;
}

const subscribeToStorage = () => () => {};

export default function MeetingRoom({
  roomName,
}: MeetingRoomProps) {
    const storedSession = useSyncExternalStore<string | null | undefined>(
        subscribeToStorage,
        () => sessionStorage.getItem("cloudian-meet-session"),
        () => undefined,
    );
    const storedPreferences = useSyncExternalStore(
        subscribeToStorage,
        () => sessionStorage.getItem("cloudian-meet-preferences"),
        () => null,
    );
    const session = useMemo(() => {
        try {
            return storedSession ? (JSON.parse(storedSession) as MeetingSession) : null;
        } catch {
            return null;
        }
    }, [storedSession]);
    const preferences = useMemo<MeetingPreferences>(() => {
        try {
            return storedPreferences
                ? { cameraEnabled: true, microphoneEnabled: true, ...JSON.parse(storedPreferences) }
                : { cameraEnabled: true, microphoneEnabled: true };
        } catch {
            return { cameraEnabled: true, microphoneEnabled: true };
        }
    }, [storedPreferences]);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (storedSession === undefined) {
        return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--meeting-page)] text-[var(--meeting-text-muted)]">
            Connecting to meeting…
        </div>
        );
    }
    if (!session || session.roomName !== roomName || !session.token || !session.serverUrl) {
        return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--meeting-page)] p-6 text-[var(--meeting-text)]">
            <p className="rounded-xl border border-[var(--meeting-border)] bg-[var(--meeting-surface)] px-5 py-4 shadow-sm">Join this meeting from the home page first.</p>
        </div>
        );
    }

    return (
        <LiveKitRoom
        token={session.token}
        serverUrl={session.serverUrl}
        connect={true}
        audio={preferences.microphoneEnabled}
        video={preferences.cameraEnabled}
        className="flex h-dvh flex-col overflow-hidden bg-[var(--meeting-page)]"
        >
            <RoomAudioRenderer /> 
            <div className="relative flex min-h-0 flex-1 pb-20 sm:pb-24">
                <div className="min-w-0 flex-1">
                    <VideoGrid />
                </div>
                {sidebarOpen && (
                    <MeetingSidebar
                        onClose={() => setSidebarOpen(false)}
                    />
                )}
            </div>
            <MeetingControl
                roomName={roomName}
                sidebarOpen={sidebarOpen}
                onSidebarToggle={() => setSidebarOpen((open) => !open)}
            />
        </LiveKitRoom>
    );
}
