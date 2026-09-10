'use client'
import {TrackToggle} from "@livekit/components-react";

import {Track} from 'livekit-client' 

export default function MeetingControl() {
    return (
        <div className="flex items-center justify-center gap-4 border-t border-zinc-800 bg-zinc-950 p-4">
            <TrackToggle source={Track.Source.Microphone} /> 
            <TrackToggle source={Track.Source.Camera} /> 
        </div>
    )
}