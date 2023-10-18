


import Openended from '@/components/Openended'
import prisma from '@/lib/db'
import { getAuthSession } from '@/lib/nextauth'
import { redirect } from 'next/navigation'
import React from 'react'



type Props = {
    params: {
        gameid: string
    }
}

const OpenEndedPage = async ({params:{gameid}}: Props) => {
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
                    answer: true,
                }
            }
        }
    })
    if(!game || game?.type !=="open_ended") redirect("/quiz")
  return (
    <Openended game={game}/>
 )
}

export default OpenEndedPage 