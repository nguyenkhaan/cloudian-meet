import { ParticipantTile, useTracks } from "@livekit/components-react";
import { Track } from "livekit-client";

export default function VideoGrid()  {
    const tracks = useTracks([
        {
            source: Track.Source.Camera, 
            withPlaceholder : true 
        }, 
        {
            source: Track.Source.ScreenShare,
            withPlaceholder: false,
        },
    ])
    return (
        <div className="grid h-full w-full grid-cols-1 gap-4 p-4 md:grid-cols-2">
            {tracks.map((track) => (
                <ParticipantTile 
                    key={`${track.participant.identity}-${track.source}`}
                    trackRef={track}
                /> 
            ))}
        </div>
    )
}