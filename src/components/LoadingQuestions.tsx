'use client'
import Image from 'next/image'
import React from 'react'
import { Progress } from './ui/progress'
import { set } from 'date-fns'

type Props = {
    finished: boolean
}

const loadingTexts = [
    "Generating questions...",
    "Unleasing the power of AI...",
    "Are you ready for the challenge?",
    "It might take a while...",
    "Challenge accepted!",
]

const LoadingQuestions = ({finished}: Props) => {
    const [progress, setProgress] = React.useState(0)
    const [loadingText, setLoadingText] = React.useState(loadingTexts[0])
    React.useEffect(() => {
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * loadingTexts.length)
            setLoadingText(loadingTexts[randomIndex])
        }, 5000)
        return () => {
            clearInterval(interval)
        }
    }, [])
    React.useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (finished) return 100
                if (prev >= 100) return 0
                if(Math.random()<.0){
                    return prev + 2
                }
                return prev + .5
            }
            )
        }, 100)
        return () => {
            clearInterval(interval)
        }
    }, [progress, finished])
  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[60vw] flex flex-col items-center'>
        <Image src={'/loading.gif'} width={400} height={400} alt='Loading'/>
        <Progress value={progress} className='w-full mt-4'/>
        <h1 className='mt-2 text-xl'>{loadingText}</h1>
    </div>
  )
}

export default LoadingQuestions