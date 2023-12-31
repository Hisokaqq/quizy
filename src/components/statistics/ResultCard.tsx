import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Award, Trophy } from 'lucide-react'

type Props = {
  accuracy: number
}

const ResultCard = ({accuracy}: Props) => {
  console.log(accuracy)
  return (
    <Card className="md:col-span-7">
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-7'>
        <CardTitle className='text-2xl font-bold'>
          Result
          <Award/>
        </CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col items-center justify-center h-3/5'>
        {accuracy > 90 ? (
          <>
            <Trophy className='mr-4' stroke="gold" size={50} />
            <div className='flex flex-col items-center text-2xl font-semibold text-yellow-400'>
              <span>Impressive!</span>
              <span className='text-sm text-center text-black opacity-50'>
                You got more than 90% accuracy correct!
              </span>
            </div>
          </>
        )
        : accuracy > 75 ? (
          <>
            <Trophy className='mr-4' stroke="gold" size={50} />
            <div className='flex flex-col items-center text-2xl font-semibold text-yellow-400'>
              <span>Good Job!</span>
              <span className='text-sm text-center text-black opacity-50'>
                You got more than 75% accuracy correct!
              </span>
            </div>
          </>
        )
        :
        <>
            <Trophy className='mr-4' stroke="gold" size={50} />
            <div className='flex flex-col items-center text-2xl font-semibold text-yellow-400'>
              <span>Nice Try!</span>
              <span className='text-sm text-center text-black opacity-50'>
                But you can do better!
              </span>
            </div>
          </>
        }
      </CardContent>
    </Card>
  )
}

export default ResultCard