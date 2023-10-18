import QuizCreation from '@/components/QuizCreation';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {
  searchParams: {
    topic?: string
  }
}

export const metadata = {
  title: "Quiz | Quizy",
  description: "Quiz yourself on anything!",
};

const page = async ({searchParams:{topic}}: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }
  return (
    <div>
      <QuizCreation topic={topic}/>
    </div>
  )
}


export default page

