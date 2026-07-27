import React from 'react'
import logoSrc from '../assets/groupchat_logo.svg'

export function GroupChatLogo(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src={logoSrc}
      alt="groupchat logo"
      {...props}
    />
  )
}
