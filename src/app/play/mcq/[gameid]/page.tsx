import MCQ from '@/components/MCQ'
import prisma from '@/lib/db'
import { getAuthSession } from '@/lib/nextauth'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    params: {
        gameid: string
    }
}

const MsqPage = async ({params:{gameid}}: Props) => {
    const session = await getAuthSession()
    if(!session?.user){
        return redirect("/login")
    }
    const game = await prisma.game.findUnique({
        where: {
            id: gameid
        },
        include: {
            questions: {
                select: {
                    id: true,
                    question: true,
                    options: true,
                }
            }
        }
    })
    if(!game || game?.type !=="mcq") redirect("/quiz")
  return (
    <MCQ game={game}/>
 )
}

export default MsqPage 