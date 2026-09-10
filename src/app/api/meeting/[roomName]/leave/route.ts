import { RoomServiceClient, ServerError } from "livekit-server-sdk";

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

  if (!API_KEY || !API_SECRET || !LIVEKIT_URL) {
    return Response.json({ error: "LiveKit is not configured" }, { status: 500 });
  }

  const roomService = new RoomServiceClient(
    LIVEKIT_URL.replace(/^ws/, "http"),
    API_KEY,
    API_SECRET,
  );

  try {
    await roomService.removeParticipant(roomName, user.id);
  } catch (error) {
    if (!(error instanceof ServerError) || error.status !== 404) {
      return Response.json({ error: "Unable to leave meeting" }, { status: 502 });
    }
  }

  return Response.json({ roomName, left: true });
}
