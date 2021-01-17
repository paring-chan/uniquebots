export interface Bot {
  id: string
  name: string
  brief: string
  description: string
  avatarURL: string
  guilds: number
  status: 'online' | 'idle' | 'dnd' | 'offline'
  categories: Category[]
  invite: string
  trusted: boolean
  discordVerified: boolean
  website: string
  bot: string
  git: string
  isOwner: boolean
  owners: User[]
  library: Library
  support: string
  prefix: string
  token: string
  hearts: Heart[]
}

export interface User {
  id: string
  tag: string
}

export interface Heart {
  from: User
  to: Bot
}

export interface Library {
  id: string
  name: string
  bots: Bot[]
}

export interface Category {
  id: string
  name: string
  bots: Bot[]
}

export enum Status {
  online = '온라인',
  idle = '자리 비움',
  dnd = '다른 용무중',
  offline = '오프라인',
}

export enum StatusColors {
  online = 'bg-green-500',
  idle = 'bg-yellow-300',
  dnd = 'bg-red-500',
  offline = 'bg-gray-600',
}
