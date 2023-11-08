
import prisma from "@/lib/db";

import { NextResponse } from "next/server";

export async function POST(req:Request, res:Response) {
    try{
        const body = await req.json();
        const {gameId} = body;
        const game = await prisma.game.findUnique({
            where: {
                id: gameId
            }
        })
        if(!game) return NextResponse.json({error: "game not found", status: 404})
        await prisma.game.update({
            where: {
                id: gameId
            },
            data: {
                timeEnd: new Date()
            }
        })
        return NextResponse.json({"message": "time updated", status: 200});

    }catch(error){
        return NextResponse.json({error: "Error", status: 400})
    }
        
}