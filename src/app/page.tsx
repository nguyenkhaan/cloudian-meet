"use client";

import { Copy, LoaderCircle, LogIn, Plus, Video, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

type JoinResponse = {
  error?: string;
  token?: string;
  serverUrl?: string;
};

export default function HomePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [roomName, setRoomName] = useState("");
  const [createdRoomName, setCreatedRoomName] = useState<string | null>(null);
  const [pending, setPending] = useState<"create" | "join" | null>(null);

  const showToast = (message: string, type: "error" | "success") => {
    toast[type](message);
  };

  const hasCredentials = () => {
    if (name.trim() && password) return true;

    showToast("Enter your name and password", "error");
    return false;
  };

  const createMeeting = async () => {
    if (!hasCredentials()) return;

    setPending("create");
    try {
      const response = await fetch("/api/meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          password,
          title: `${name.trim()}\u2019s meeting`,
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        roomName?: string;
      };

      if (!response.ok || !payload.roomName) {
        throw new Error(payload.error ?? "Unable to create meeting");
      }

      setCreatedRoomName(payload.roomName);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to create meeting", "error");
    } finally {
      setPending(null);
    }
  };

  const joinMeeting = async () => {
    if (!hasCredentials()) return;

    const normalizedRoomName = roomName.trim();
    if (!normalizedRoomName) {
      showToast("Enter a room name", "error");
      return;
    }

    setPending("join");
    try {
      const response = await fetch(
        `/api/meeting/${encodeURIComponent(normalizedRoomName)}/join`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, password }),
        },
      );
      const payload = (await response.json().catch(() => ({}))) as JoinResponse;

      if (!response.ok || !payload.token || !payload.serverUrl) {
        throw new Error(payload.error ?? "Unable to join meeting");
      }

      sessionStorage.setItem(
        "cloudian-meet-session",
        JSON.stringify({
          roomName: normalizedRoomName,
          token: payload.token,
          serverUrl: payload.serverUrl,
          name,
          password,
        }),
      );
      router.push(`/${encodeURIComponent(normalizedRoomName)}/ready`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to join meeting", "error");
      setPending(null);
    }
  };

  const isLoading = pending !== null;

  const copyMeetingCode = async () => {
    if (!createdRoomName) return;

    try {
      await navigator.clipboard.writeText(createdRoomName);
      toast.success("Meeting code copied");
    } catch {
      toast.error("Unable to copy meeting code");
    }
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[var(--home-page)] p-4 text-[var(--home-text)] [color-scheme:light] sm:p-6">
      <div className="w-full max-w-2xl rounded-2xl border border-[var(--home-border)] bg-[var(--home-surface)] p-5 shadow-sm sm:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-[var(--meeting-control)] text-[var(--meeting-on-accent)]">
            <Video className="size-6" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Cloudian Meet</h1>
        </div>

        <div className="flex flex-col justify-between gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="name">Name</label>
          <input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            autoComplete="username"
            className="h-12 w-full rounded-lg border border-[var(--home-border)] bg-[var(--home-surface)] px-4 text-sm outline-none transition-colors placeholder:text-[var(--home-text-muted)] focus:border-[var(--meeting-control)] focus:ring-2 focus:ring-[var(--home-focus-ring)] sm:w-1/2"
          />
          <label className="sr-only" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            className="h-12 w-full rounded-lg border border-[var(--home-border)] bg-[var(--home-surface)] px-4 text-sm outline-none transition-colors placeholder:text-[var(--home-text-muted)] focus:border-[var(--meeting-control)] focus:ring-2 focus:ring-[var(--home-focus-ring)] sm:w-1/2"
          />
        </div>

        <div className="mt-5 grid gap-5 border-t border-[var(--home-border)] pt-5 sm:grid-cols-2 sm:divide-x sm:divide-[var(--home-border)] sm:gap-0 sm:pt-6">
          <div className="space-y-3 sm:pr-5">
            <label className="sr-only" htmlFor="room-name">Room name</label>
            <input
              id="room-name"
              value={roomName}
              onChange={(event) => setRoomName(event.target.value)}
              placeholder="Enter a room name"
              autoComplete="off"
              className="h-12 w-full rounded-lg border border-[var(--home-border)] bg-[var(--home-surface)] px-4 text-sm outline-none transition-colors placeholder:text-[var(--home-text-muted)] focus:border-[var(--meeting-control)] focus:ring-2 focus:ring-[var(--home-focus-ring)]"
            />
            <button
              type="button"
              onClick={joinMeeting}
              disabled={isLoading}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[var(--meeting-control)] px-5 text-sm font-medium text-[var(--meeting-on-accent)] transition-colors hover:bg-[var(--meeting-control-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--home-focus-ring)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending === "join" ? <LoaderCircle className="size-4 animate-spin" /> : <LogIn className="size-4" />}
              Join
            </button>
          </div>

          <div className="flex sm:pl-5">
            <button
              type="button"
              onClick={createMeeting}
              disabled={isLoading}
              className="inline-flex h-11 w-full items-center justify-center gap-2 self-end rounded-full bg-[var(--meeting-control)] px-5 text-sm font-medium text-[var(--meeting-on-accent)] transition-colors hover:bg-[var(--meeting-control-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--home-focus-ring)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending === "create" ? <LoaderCircle className="size-4 animate-spin" /> : <Plus className="size-4" />}
              Create meeting
            </button>
          </div>
        </div>
      </div>

      {createdRoomName && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[var(--home-dialog-backdrop)] p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="meeting-created-title"
            className="relative w-full max-w-md rounded-2xl border border-[var(--home-border)] bg-[var(--home-surface)] p-6 shadow-xl"
          >
            <button
              type="button"
              onClick={() => setCreatedRoomName(null)}
              aria-label="Close meeting code dialog"
              className="absolute right-3 top-3 grid size-10 place-items-center rounded-full text-[var(--home-text-muted)] transition-colors hover:bg-[var(--home-dialog-code)] hover:text-[var(--home-text)]"
            >
              <X className="size-5" />
            </button>
            <h2 id="meeting-created-title" className="pr-10 text-xl font-medium">Your meeting is ready</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--home-text-muted)]">Share this meeting code with people you want to invite.</p>
            <div className="mt-5 flex items-center gap-3 rounded-xl bg-[var(--home-dialog-code)] p-3">
              <span className="min-w-0 flex-1 break-all font-mono text-sm font-medium">{createdRoomName}</span>
              <button
                type="button"
                onClick={copyMeetingCode}
                aria-label="Copy meeting code"
                className="grid size-10 shrink-0 place-items-center rounded-full text-[var(--meeting-control)] transition-colors hover:bg-[var(--home-surface)]"
              >
                <Copy className="size-5" />
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
