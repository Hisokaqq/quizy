"use client";
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { checkAnswerSchema, quizCreationSchema } from '@/app/schemas/form/quiz'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import { Input } from "@/components/ui/input"
import { Button } from './ui/button';
import { BookOpen, CopyCheck } from 'lucide-react';
import { Separator } from './ui/separator';
import {useMutation} from "@tanstack/react-query"
import axios from 'axios';
import { useRouter } from 'next/navigation';
import LoadingQuestions from './LoadingQuestions';
type Props = {
  topic?: string
}

type Input = z.infer<typeof quizCreationSchema>

const QuizCreation = ({topic}: Props) => {
  
  const router = useRouter()
  const [showLoading, setShowLoading] = React.useState(false)
  const [finished, setFinished] = React.useState(false)
    const {mutate: getQuestions, isLoading} = useMutation({
      mutationFn: async ({amount, topic, type}: Input) => {
        console.log({type})
        const response = await axios.post("/api/game",{
          amount,
          topic,
          type
        } )
        return response.data;
      }
    })
    const form = useForm<Input>({
        resolver: zodResolver(quizCreationSchema),
        defaultValues: {
            amount: 3,
            topic: topic || "",
            type: "mcq",
        }
    })

    function onSubmit(input: Input) {
      setShowLoading(true)
      getQuestions({
        amount: input.amount,
        topic: input.topic,
        type: input.type
      },{
        onSuccess: ({gameId})=>{
          setFinished(true)
          setTimeout(() => {
          if(form.getValues("type")=="mcq") router.push(`/play/mcq/${gameId}`)
          else router.push(`/play/open-ended/${gameId}`)
          }
          , 1000);
        },
        onError: () =>{
          setShowLoading(false)
        }
      },
      )
    }
    form.watch();
    if(showLoading) return <LoadingQuestions finished={finished}/>;
  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <Card>
            <CardHeader>
                <CardTitle className='text-2xl font-bold'>Quiz Creation</CardTitle>
                <CardDescription>Chose a topic</CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topic</FormLabel>
              <FormControl>
                <Input placeholder="enter a topic..." {...field} />
              </FormControl>
              <FormDescription>
                Please provide a topic
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of questions</FormLabel>
              <FormControl>
                <Input type='number' min={1} max={10} {...field} onChange={(e)=>{
                    form.setValue("amount", parseInt(e.target.value))
                }} placeholder="enter an amount..."  />
              </FormControl>
            
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
            <Button 
                type='button'
                className='w-1/2 rounded-none rounded-l-lg' 
                variant={form.getValues("type") === "mcq" ? "default" : "secondary"} 
                onClick={()=>{
                    form.setValue("type", "mcq")
                }}
                >
                <CopyCheck className="h-4 w-4 m-2"/> Multiple Choice
            </Button>
            <Separator orientation="vertical" />
            <Button  
                type='button'
                className='w-1/2 rounded-none rounded-r-lg' 
                variant={form.getValues("type") === "open_ended" ? "default" : "secondary"} 
                onClick={()=>{
                    form.setValue("type", "open_ended")
                }}
            >
                <BookOpen className="h-4 w-4 m-2"/> Open Ended
            </Button>
        </div>
        <Button disabled={isLoading} type="submit">Submit</Button>
      </form>
    </Form>
            </CardContent>
        </Card>
    </div>
  )
}

export default QuizCreation