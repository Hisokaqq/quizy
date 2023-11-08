'use client'
import { cn, formatTime } from '@/lib/utils'
import { Game, Question } from '@prisma/client'
import { differenceInSeconds } from 'date-fns'
import { BarChart, ChevronRight, Loader2, Timer } from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button, buttonVariants } from './ui/button'
import { useToast } from './ui/use-toast'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { checkAnswerSchema } from '@/app/schemas/form/quiz'
import axios from 'axios'
import BlankAnswer from './BlankAnswer'
import Link from 'next/link'

type Props = {
    game: Game & {questions: Pick<Question, "id" | "answer" | "question">[]}
}

const Openended = ({game}: Props) => {
    const [questionIndex, setQuestionIndex] = useState(0)
    const [blankAnswer, setBlankAnswer] = useState<string>("")
    const [hasEnded, setHasEnded] = useState<boolean>(false)
    const [now, setNow] = useState<Date>(new Date())
    const {toast} = useToast();
    const currentQuestion = useMemo(()=>{  
        return game.questions[questionIndex]
    } , [questionIndex, game.questions])

    const {mutate: checkAnswer, isLoading: isChecking} = useMutation({
        mutationFn: async () => {
          let filledAnswer = blankAnswer;
          document.querySelectorAll<HTMLInputElement>("#user-blank-input").forEach((input)=>{
            filledAnswer = filledAnswer.replace("_____", input.value)
            input.value = "";
            })
          const payload: z.infer<typeof checkAnswerSchema> = {
            questionId: currentQuestion.id,
            userAnswer: filledAnswer
          }
          const response = await axios.post("/api/checkAnswer", payload)
          return response.data;
        }
      })
      const handleNext = useCallback(()=>{
        if(isChecking) return;
        const updateTimeEnd = async () => {
            try {
                const response = await fetch('/api/endGame', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        gameId: game.id
                    })
                });
    
                const responseData = await response.json();
    
                if (!response.ok || responseData.error) {
                    console.error('Failed to update timeEnd:', responseData.error);
                } else {
                    console.log('timeEnd updated successfully!');
                }
            } catch (error) {
                console.error('Error updating timeEnd:', error);
            }
        };
        checkAnswer(undefined, {
            onSuccess: ({percentageSimilar})=>{
                toast({
                    title: `you answer is ${percentageSimilar}% similar to the correct answer`,
                    description: "answers are compared using cosine similarity"
                })
                if (questionIndex == game.questions.length - 1) {
                    setHasEnded(true)
                    updateTimeEnd(); // Call the async function here

                    return;
                }
                setQuestionIndex(prev => prev + 1)

            }
        })
      }, [checkAnswer, toast, isChecking, questionIndex, game.questions.length])

      useEffect(()=>{
        const handleKeyDown = (event: KeyboardEvent) => {
           if(event.key=="Enter"){
                handleNext();
            }
        }
        document.addEventListener("keydown", handleKeyDown)
        return () => {
            document.removeEventListener("keydown", ()=>{})
        }
      }, [handleNext])
      useEffect(()=>{
        const interval = setInterval(()=>{
            if(!hasEnded) setNow(new Date());
            
        }, 1000)
        return () => {
            clearInterval(interval)
        }
    }
    , [hasEnded])

    if(hasEnded || game.timeEnd){
        return(
            <div className='absolute flex flex-col justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                <div className='px-4 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap'>
                    You got completed the quiz in {formatTime(differenceInSeconds(now, game.timeStarted))}!
                </div>
                <Link href={`/statistics/${game.id}`} className={cn(buttonVariants(), "mt-2")}>
                    View Statistcs
                    <BarChart className='w-4 h-4 ml-2'/>
                </Link>
            </div>
        )
      }
  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw]'>
        <div className="flex flex-row justify-between">
            <div className='flex flex-col'>
            <p>
                <span className="text-slate-400">Topic</span>
                <span className='px-2 py-1 ml-2 text-white rounded-lg bg-slate-800'>{game.topic}</span>
            </p>
            <div className='flex self-start mt-3 text-slate-400'>
                <Timer className='mr-2'/>
                <span>{formatTime(differenceInSeconds(now, game.timeStarted))}</span>
            </div>
            </div>
            {/* <MCQCounter correct={correctAnswers} incorrect={wrongAnswers}/> */}

        </div>
        <Card className='w-full mt-4'>
            <CardHeader className='flex flex-row items-center'>
                <CardTitle className='mr-5 text-center divide-y divide-zinc-600/50'>
                    <div>
                        {questionIndex + 1}
                    </div>
                    <div className=" text-base text-slate-400">
                        {game.questions.length}
                    </div>
                </CardTitle>
                <CardDescription className='flex-grow text-lg'>
                    {currentQuestion?.question}
                </CardDescription>
            </CardHeader>
        </Card>
        <div className='flex flex-col items-center justify-center w-full mt-4'>
            <BlankAnswer setBlankAnswer={setBlankAnswer} answer={currentQuestion.answer}/>
            <Button disabled={isChecking || hasEnded} onClick={()=>handleNext()} className='mt-2'>
                {isChecking && <Loader2 className='w-4 h-4 mr-2 animate-spin'/>}
                Next <ChevronRight className='w-4 h-4 ml-2'/>
            </Button>
        </div>
    </div>
  )
}

export default Openended