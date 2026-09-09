//Endpoint de lay token: http://localhost:3000/api/token
import {AccessToken} from 'livekit-server-sdk'

const API_KEY = process.env.LIVEKIT_API_KEY 
const API_SECRET = process.env.LIVEKIT_API_SECRET
const LIVEKIT_URL = process.env.LIVEKIT_PROJECT_URL

export async function POST(request : Request) {
    const body = await request.json() 
    const { identity , roomName} = body 
    console.log(identity)
    if (!identity || !roomName) 
        return Response.json({
            error: "roomName and identity are required"
        } , {
            status: 400 
        })
    //Su dung ham cua livekit de co the tao token 
    const token = new AccessToken(
        API_KEY , API_SECRET, {
            identity
        }
    ) 
    token.addGrant({
        canPublish: true, 
        canPublishData: true, 
        canSubscribe: true, 
        roomJoin: true, 
        room: roomName
    }) 
    const jwt = await token.toJwt() 
    return Response.json({
        token: jwt 
    })
}
