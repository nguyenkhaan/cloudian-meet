"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import VideoGrid from "./VideoGrid";
import MeetingControl from "./MeetingControl"
import MeetingSidebar from "./MeetingSidebar";

interface MeetingRoomProps {
    roomName: string;
}

export default function MeetingRoom({
  roomName,
}: MeetingRoomProps) {
    const [token, setToken] = useState<string | null>(null);
    const [serverUrl, setServerUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        async function fetchToken() {
            try {
                const response = await fetch("/api/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    roomName,
                    identity: `user-${crypto.randomUUID()}`,
                }),
                });

                if (!response.ok) {
                throw new Error("Failed to get LiveKit token");
                }

                const payload = await response.json();
                setToken(payload.token);
                setServerUrl(payload.serverUrl);
            } catch (error) 
            {
                console.error(error);
                setError("Failed to connect to meeting");
            }
        }

        fetchToken();
    }, [roomName]);

    if (error) {
        return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--meeting-page)] p-6 text-[var(--meeting-text)]">
            <p className="rounded-xl border border-[var(--meeting-border)] bg-[var(--meeting-surface)] px-5 py-4 shadow-sm">{error}</p>
        </div>
        );
    }
    if (!token || !serverUrl) {
        return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--meeting-page)] text-[var(--meeting-text-muted)]">
            Connecting to meeting…
        </div>
        );
    }

    return (
        <LiveKitRoom
        token={token}
        serverUrl={serverUrl}
        connect={true}
        audio={true}
        video={true}
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
