import { db } from '@/db'

interface RouteContext {
    params: Promise<{
        roomName: string;
    }>;
}
export async function POST(
    request : Request, 
    { params } : RouteContext
) {
    const body = await request.json() 
    const {name , password} = body 
    if (!name || !password) 
    return Response.json({
        error: "Credential is required" 
    } , {
        status: 400 
    })
    const user = await db.orm.public.User.where({
        name, password
    }).first() 
    if (!user) 
        return Response.json({
            error: "Invalid credential"
        } , {
            status: 401 
        })
    const {roomName} = await params
    const meeting = await db.orm.public.Meeting.where({
        roomName, 
        hostId : user.id, 
    }).first() 
    if (!meeting) return Response.json({
        error: "Invalid room name"
    } , {
        status: 404
    }) 
    if (meeting.expireAt <= Temporal.Now.instant()) {
        return Response.json(
            { error: "Meeting has expired" },
            { status: 410 }
        );
    }
    return {
        roomName, 
        id : meeting.hostId, 

    }
}