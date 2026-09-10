'use client' 
//Nhan mot video track va render no len man hinh 

import {useEffect , useRef} from 'react' 
import type {LocalVideoTrack} from 'livekit-client' 

interface VideoTileProps {
    identity: string 
    track: LocalVideoTrack
} 

export default function LocalVideoTile({
    identity, track 
} : VideoTileProps) 
{
    const videoRef = useRef<HTMLVideoElement>(null) 
    useEffect(() => {
        const element = videoRef.current  
        if (!element) return 
        track.attach(element) 
        return () => {
            track.detach(element) 
        }
    } , [track]) 
    return (
        <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-900"> 
            <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover"  />
            <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-sm text-white">
                {identity} (You)
            </div>
        </div>
    )
}