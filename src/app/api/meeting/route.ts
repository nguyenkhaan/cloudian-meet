import { generateRandomString } from "@/helper/generateRandom";
import { NextRequest } from "next/server";
import {db} from '@/db'
export async function POST(request : NextRequest) {
    const body = await request.json() 

    const { title , name , password } = body 
    if (!title) 
        return Response.json(
            {
                error: "Title is required"
            }, {
                status : 400 
            }
        )
    if (!name || !password) 
        return Response.json({
            error: "Credential is required" 
        } , {
            status: 400 
        })
    //authenticated user - not do yet because this is only a MVP 
    const user = await db.orm.public.User.where({
        name, password
    }).first() 
    if (!user) 
        return Response.json({
            error: "Invalid credential"
        } , {
            status: 401 
        })
    const roomName = generateRandomString() 
    //save meeting to database - with expire time 
    const expireAt = Temporal.Now.instant().add({
        days: 3,
    });
    const meeting = await db.orm.public.Meeting.create({
        roomName, 
        hostId : user.id, 
        title, 
        expireAt
    })
    return Response.json({
        id: meeting.id, 
        title: title, 
        roomName, //Duoc thuc hien de join vao phong 
        //TTL - 3 ngay -> meeting se bi expired neu nhu qua 3 ngay 
    })
}
//model Meeting - model user va model meeting 

export async function GET() {

}