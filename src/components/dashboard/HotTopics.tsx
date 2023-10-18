import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import CustomWordCloud from '../CustomWordCloud'
import prisma from '@/lib/db'

type Props = {}

const HotTopics = async (props: Props) => {
  const topics = await prisma.topicCount.findMany({
    take: 50,
    orderBy: {
      count: 'desc'
    }
     
  })
  const formatedTopics = topics.map(topic => {
    return {
      text: topic.topic,
      value: topic.count
    }
  }
  )
  return (
    <Card className="col-span-4">
        <CardHeader>
            <CardTitle className='text-2xl font-bold'>Hot Topics 🔥</CardTitle>
                <CardDescription>
                    Click on a topic to start quizzing!
                </CardDescription>
        </CardHeader>
        <CardContent className='pl-2'>
            <CustomWordCloud  formatedTopics={formatedTopics}/>
        </CardContent>
    </Card>
  )
}

export default HotTopics