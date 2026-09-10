"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom } from "@livekit/components-react";
import VideoGrid from "./VideoGrid";
import MeetingControl from "./MeetingControl"

interface MeetingRoomProps {
    roomName: string;
}

export default function MeetingRoom({
  roomName,
}: MeetingRoomProps) {
    const [token, setToken] = useState<string | null>(null);
    const [serverUrl, setServerUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

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
        <div className="flex min-h-screen items-center justify-center">
            {error}
        </div>
        );
    }
    if (!token || !serverUrl) {
        return (
        <div className="flex min-h-screen items-center justify-center">
            Connecting...
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
        className="flex min-h-screen flex-col"
        >
            <div className="flex-1">
                <VideoGrid />
            </div>
            <MeetingControl />
        </LiveKitRoom>
    );
}