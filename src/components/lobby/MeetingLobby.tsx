"use client";

import { Camera, CameraOff, LoaderCircle, Mic, MicOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

interface MeetingLobbyProps {
  roomName: string;
}

type MeetingSession = {
  roomName: string;
  token: string;
  serverUrl: string;
};

const subscribeToStorage = () => () => {};

export default function MeetingLobby({ roomName }: MeetingLobbyProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const storedSession = useSyncExternalStore<string | null | undefined>(
    subscribeToStorage,
    () => sessionStorage.getItem("cloudian-meet-session"),
    () => undefined,
  );
  const session = useMemo(() => {
    try {
      return storedSession ? (JSON.parse(storedSession) as MeetingSession) : null;
    } catch {
      return null;
    }
  }, [storedSession]);
  const sessionReady = Boolean(
    session && session.roomName === roomName && session.token && session.serverUrl,
  );

  useEffect(() => {
    if (storedSession !== undefined && !sessionReady) {
      router.replace("/");
    }
  }, [router, sessionReady, storedSession]);

  useEffect(() => {
    if (!sessionReady || !navigator.mediaDevices?.getUserMedia) return;

    let isUnmounted = false;

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        if (isUnmounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => setPreviewError("Camera or microphone preview is unavailable."));

    return () => {
      isUnmounted = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [sessionReady]);

  useEffect(() => {
    streamRef.current?.getVideoTracks().forEach((track) => {
      track.enabled = cameraEnabled;
    });
  }, [cameraEnabled]);

  useEffect(() => {
    streamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = microphoneEnabled;
    });
  }, [microphoneEnabled]);

  const enterMeeting = () => {
    sessionStorage.setItem(
      "cloudian-meet-preferences",
      JSON.stringify({ cameraEnabled, microphoneEnabled }),
    );
    router.push(`/meeting/${encodeURIComponent(roomName)}`);
  };

  if (!sessionReady) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[var(--home-page)] text-[var(--home-text-muted)] [color-scheme:light]">
        <LoaderCircle className="size-6 animate-spin" aria-label="Loading" />
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[var(--home-page)] p-4 text-[var(--home-text)] [color-scheme:light] sm:p-6">
      <section className="w-full max-w-3xl rounded-2xl border border-[var(--home-border)] bg-[var(--home-surface)] p-4 shadow-sm sm:p-6">
        <div className="relative aspect-video overflow-hidden rounded-xl bg-[var(--meeting-page)]">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={`size-full object-cover ${cameraEnabled ? "" : "invisible"}`}
          />
          {!cameraEnabled && (
            <div className="absolute inset-0 grid place-items-center text-[var(--meeting-text-muted)]">
              <CameraOff className="size-12" />
            </div>
          )}
        </div>

        {previewError && <p className="mt-3 text-sm text-[var(--home-error-text)]">{previewError}</p>}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMicrophoneEnabled((enabled) => !enabled)}
              aria-label={microphoneEnabled ? "Turn microphone off" : "Turn microphone on"}
              className={`grid size-11 place-items-center rounded-full transition-colors ${microphoneEnabled ? "bg-[var(--meeting-control)] text-[var(--meeting-on-accent)] hover:bg-[var(--meeting-control-hover)]" : "bg-[var(--meeting-danger)] text-[var(--meeting-on-accent)] hover:bg-[var(--meeting-danger-hover)]"}`}
            >
              {microphoneEnabled ? <Mic className="size-5" /> : <MicOff className="size-5" />}
            </button>
            <button
              type="button"
              onClick={() => setCameraEnabled((enabled) => !enabled)}
              aria-label={cameraEnabled ? "Turn camera off" : "Turn camera on"}
              className={`grid size-11 place-items-center rounded-full transition-colors ${cameraEnabled ? "bg-[var(--meeting-control)] text-[var(--meeting-on-accent)] hover:bg-[var(--meeting-control-hover)]" : "bg-[var(--meeting-danger)] text-[var(--meeting-on-accent)] hover:bg-[var(--meeting-danger-hover)]"}`}
            >
              {cameraEnabled ? <Camera className="size-5" /> : <CameraOff className="size-5" />}
            </button>
          </div>
          <button
            type="button"
            onClick={enterMeeting}
            className="h-11 rounded-full bg-[var(--meeting-control)] px-6 text-sm font-medium text-[var(--meeting-on-accent)] transition-colors hover:bg-[var(--meeting-control-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--home-focus-ring)] focus:ring-offset-2"
          >
            Join now
          </button>
        </div>
      </section>
    </main>
  );
}
