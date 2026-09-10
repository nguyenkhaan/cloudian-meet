import { generateRandomString } from "@/helper/generateRandom";
import { NextRequest } from "next/server";
export async function POST(request : NextRequest) {
    const body = await request.json() 

    const { title } = body 
    if (!title) 
        return Response.json(
            {
                error: "Title is required"
            }, {
                status : 400 
            }
        )
    //authenticated user - not do yet because this is only a MVP 
    const roomName = generateRandomString() 
    //save meeting to database - with expire time 
    return Response.json({
        id: "temporary-id", 
        title: "temporary-title", 
        roomName, 
        //TTL - 3 ngay -> meeting se bi expired neu nhu qua 3 ngay 
    })
}
//model Meeting - model user va model meeting 
