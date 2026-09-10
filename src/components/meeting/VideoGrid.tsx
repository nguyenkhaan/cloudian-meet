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
    const screenShare = tracks.find((track) => track.source === Track.Source.ScreenShare)
    const cameraTracks = tracks.filter((track) => track.source === Track.Source.Camera)
    const tileClass = "relative min-h-0 overflow-hidden rounded-xl bg-[var(--meeting-video)] data-[lk-speaking=true]:ring-2 data-[lk-speaking=true]:ring-[var(--meeting-speaking)] data-[lk-video-muted=false]:[&_.lk-participant-placeholder]:hidden [&_.lk-video-track]:h-full [&_.lk-video-track]:w-full [&_.lk-participant-placeholder]:absolute [&_.lk-participant-placeholder]:inset-0 [&_.lk-participant-placeholder]:flex [&_.lk-participant-placeholder]:items-center [&_.lk-participant-placeholder]:justify-center [&_.lk-participant-placeholder_svg]:h-20 [&_.lk-participant-placeholder_svg]:w-20 [&_.lk-participant-placeholder_svg]:rounded-full [&_.lk-participant-placeholder_svg]:bg-[var(--meeting-video-muted)] [&_.lk-participant-metadata]:contents [&_.lk-participant-metadata-item:first-child]:contents [&_.lk-participant-name]:absolute [&_.lk-participant-name]:bottom-3 [&_.lk-participant-name]:left-3 [&_.lk-participant-name]:text-xs [&_.lk-participant-name]:font-medium [&_.lk-participant-name]:text-[var(--meeting-text)] sm:[&_.lk-participant-name]:text-sm [&_.lk-track-muted-indicator-microphone]:absolute [&_.lk-track-muted-indicator-microphone]:right-2.5 [&_.lk-track-muted-indicator-microphone]:top-2.5 [&_.lk-track-muted-indicator-microphone]:rounded-full [&_.lk-track-muted-indicator-microphone]:bg-[var(--meeting-overlay)] [&_.lk-track-muted-indicator-microphone]:p-1.5 [&_.lk-track-muted-indicator-microphone]:text-[var(--meeting-text)] [&_.lk-connection-quality]:absolute [&_.lk-connection-quality]:bottom-3 [&_.lk-connection-quality]:right-3 [&_.lk-connection-quality]:text-[var(--meeting-text)] [&_.lk-focus-toggle]:hidden"
    const layout = cameraTracks.length <= 1
        ? "grid-cols-1 max-w-5xl"
        : cameraTracks.length <= 2
            ? "grid-cols-1 sm:grid-cols-2 max-w-6xl"
            : cameraTracks.length <= 4
                ? "grid-cols-2 max-w-5xl"
                : cameraTracks.length <= 9
                    ? "grid-cols-2 sm:grid-cols-3 max-w-5xl"
                    : "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 max-w-6xl"

    if (screenShare) {
        return (
            <div className="flex h-full min-h-0 flex-col gap-2 p-2 sm:flex-row sm:p-3">
                <ParticipantTile
                    trackRef={screenShare}
                    className={`${tileClass} h-full min-w-0 flex-1 [&_.lk-video-track]:object-contain`}
                />
                <aside aria-label="Participant videos" className="h-24 shrink-0 overflow-x-auto sm:h-full sm:w-44 sm:overflow-x-hidden sm:overflow-y-auto lg:w-56 xl:w-64">
                    <div className="flex h-full gap-2 sm:h-auto sm:flex-col">
                        {cameraTracks.map((track) => (
                            <ParticipantTile
                                key={`${track.participant.identity}-${track.source}`}
                                trackRef={track}
                                className={`${tileClass} aspect-video h-full shrink-0 sm:h-auto sm:w-full [&_.lk-video-track]:object-cover`}
                            />
                        ))}
                    </div>
                </aside>
            </div>
        )
    }

    return (
        <div className={`mx-auto grid h-full w-full content-center gap-1.5 p-2 sm:gap-2 sm:p-3 ${layout}`}>
            {cameraTracks.map((track) => (
                <ParticipantTile 
                    key={`${track.participant.identity}-${track.source}`}
                    trackRef={track}
                    className={`${tileClass} aspect-video [&_.lk-video-track]:object-cover`}
                /> 
            ))}
        </div>
    )
}
