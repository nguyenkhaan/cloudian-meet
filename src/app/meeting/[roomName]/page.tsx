import MeetingRoom from "@/components/meeting/MeetingRoom";

interface MeetingPageProps {
  params: Promise<{
    roomName: string;
  }>;
}


export default async function MeetingPage({
    params 
} : MeetingPageProps) {
    const {roomName} = await params 
    return (
        <main className="min-h-screen">
            <MeetingRoom roomName={roomName} /> 
        </main>
    )
}