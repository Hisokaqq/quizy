import prisma from '@/lib/db'
import { Clock, CopyCheck, Edit2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type Props = {
    limit: number,
    userId: string
}

const HistoryComponent = async ({limit, userId}: Props) => {
    const games = await prisma.game.findMany({
        take: limit,
        where: {
            userId: userId
        },
        orderBy: {
            timeStarted: 'desc'
        }
    })
  return (
    <div className='space-y-8'>
        {games.map((game) => (
            <div key={game.id} className='flex items-center justify-between'>
                <div className="flex items-center ">
                    {game.type === "mcq" ?(
                        <CopyCheck className='mr-3'/>
                    ):
                        <Edit2 className='mr-3'/>
                    }
                    <div className='ml-4 space-y-1'>
                        <Link href={`/statistics/${game.id}`} className='text-base font-medium leading-none underline'>
                            {game.topic}
                        </Link>
                        <p className='flex items-center  px-2  text-xs text-white rounded-lg w-fit h-8 bg-slate-800'>
                            <Clock className='m-4 h-4 m-0 mr-1 ' />
                            {new Date(game.timeStarted).toLocaleDateString()}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                            {game.type === "mcq" ?(
                                "MCQ"
                            ):
                                "Open Ended"
                            }
                        </p>
                    </div>
                </div>
            </div>
        ))}    
        

    </div>
  )
}

export default HistoryComponent