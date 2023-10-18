import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import HistoryComponent from '../HistoryComponent'
import { getAuthSession } from '@/lib/nextauth'
import prisma from '@/lib/db'

type Props = {}

const RecentActivities = async (props: Props) => {
    const session = await getAuthSession();
    const gameCount = prisma.game.count({
        where: {
            userId: session?.user.id
        }
    })

    if(!session?.user) return null

  return (
    <Card className='col-span-4 lg:col-span-3'>
        <CardHeader >
            <CardTitle className='text-2xl font-bold'>
                Recent Activities
            </CardTitle>
            {
                gameCount ? (
                    <CardDescription>
                        {gameCount} games played
                    </CardDescription>
                ):
                    <CardDescription>
                        No games played yet
                    </CardDescription>
            }
        </CardHeader>
            <CardContent className='max-h-[500px] overflow-scroll'>
            <HistoryComponent limit={5} userId={session?.user.id as string}/>
        </CardContent>
    </Card>
  )
}

export default RecentActivities