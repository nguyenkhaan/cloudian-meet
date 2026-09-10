import { AccessToken } from "livekit-server-sdk";

import { db } from "@/db";

interface RouteContext {
  params: Promise<{
    roomName: string;
  }>;
}

const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_PROJECT_URL;

export async function POST(request: Request, { params }: RouteContext) {
  const { name, password } = await request.json();

  if (!name || !password) {
    return Response.json({ error: "Credential is required" }, { status: 400 });
  }

  const user = await db.orm.public.User.where({ name, password }).first();

  if (!user) {
    return Response.json({ error: "Invalid credential" }, { status: 401 });
  }

  const { roomName } = await params;
  const meeting = await db.orm.public.Meeting.where({ roomName }).first();

  if (!meeting) {
    return Response.json({ error: "Invalid room name" }, { status: 404 });
  }

  if (meeting.expireAt.epochMilliseconds <= Date.now()) {
    return Response.json({ error: "Meeting has expired" }, { status: 410 });
  }

  if (!API_KEY || !API_SECRET || !LIVEKIT_URL) {
    return Response.json({ error: "LiveKit is not configured" }, { status: 500 });
  }

  const token = new AccessToken(API_KEY, API_SECRET, {
    identity: user.id,
    name: user.name,
  });

  token.addGrant({
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
    roomJoin: true,
    room: roomName,
  });

  return Response.json({
    token: await token.toJwt(),
    serverUrl: LIVEKIT_URL,
    localParticipant: {
      identity: user.id,
      name: user.name,
    },
  });
}
