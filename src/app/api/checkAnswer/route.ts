import { checkAnswerSchema } from "@/app/schemas/form/quiz";
import prisma from "@/lib/db";

import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req:Request, res:Response) {
    
    try{
        const body = await req.json();
        const {questionId, userAnswer} = checkAnswerSchema.parse(body);
        const question = await prisma.question.findUnique({
            where: {
                id: questionId
            }
        })
        if(!question) return NextResponse.json({error: "Question not found", status: 404})
        await prisma.question.update({
            where: {
                id: questionId
            },
            data: {
                userAnswer: userAnswer
            }
        })
        if(question.questionType == "mcq"){
            const isCorrect = question.answer.toLocaleLowerCase().trim() == userAnswer.toLocaleLowerCase().trim();
            await prisma.question.update({
                where: {
                    id: questionId
                },
                data: {
                    isCorrect: isCorrect
                }
            })
            return NextResponse.json({isCorrect, status: 200});
        }else if(question.questionType=="open_ended"){
            // let percentageSimilar = compareTwoStrings(userAnswer.toLocaleLowerCase().trim(), question.answer.toLocaleLowerCase().trim())
            let percentageSimilar = 3
            percentageSimilar = Math.round(percentageSimilar*100);
            await prisma.question.update({
                where: {
                    id: questionId
                },
                data: {
                    percentageCorrect: percentageSimilar
                }
            })
            return NextResponse.json({percentageSimilar, status: 200});
        }   
    }catch(error){
        if(error instanceof ZodError) return NextResponse.json({error: error.issues, status: 400})
    } 
}