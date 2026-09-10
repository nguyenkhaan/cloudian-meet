import MeetingLobby from "@/components/lobby/MeetingLobby";

interface ReadyPageProps {
  params: Promise<{
    roomName: string;
  }>;
}

export default async function ReadyPage({ params }: ReadyPageProps) {
  const { roomName } = await params;

  return <MeetingLobby roomName={roomName} />;
}
