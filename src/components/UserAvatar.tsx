
import { User } from 'next-auth'
import Image from 'next/image'
import React from 'react'
import { Avatar, AvatarFallback } from './ui/avatar'

type Props = {
    className: string,
    user: Pick<User, "name" | "image" >
}

const UserAvatar = ({className, user} : Props) => {
  return (
    <Avatar>
        {user.image ? (
            <div className='relative w-full h-full aspect-square'>
                <Image
                    src={user.image}
                    alt={user.name || 'User avatar'}
                    layout='fill'
                    objectFit='cover'
                    className={className}
                />
            </div>
        ):
        (
            <AvatarFallback>
                <span className="sr-only">{user?.name}</span>
            </AvatarFallback>
        )
    }
    </Avatar>
  )
}

export default UserAvatar