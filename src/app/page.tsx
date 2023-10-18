import SignInButton from '@/components/SignInButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getAuthSession } from '@/lib/nextauth'
import Image from 'next/image'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await getAuthSession()
  if(session?.user){
    return redirect('/dashboard')
  }
  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
      <Card className='w-[300px]'>
        <CardHeader>
          <CardTitle>Welcome to Quizy 👋</CardTitle>
          <CardDescription>Quizy is a quiz app that allows you to create and play quizzes.</CardDescription>
        </CardHeader>
        <CardContent>
          <SignInButton text='Sign In with Google' />
        </CardContent>
      </Card>
    </div>
  )
}
