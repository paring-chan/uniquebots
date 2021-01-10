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
}

export interface Category {
  id: string
  name: string
}

export enum Status {
  online = '온라인',
  idle = '자리 비움',
  dnd = '다른 용무중',
  offline = '오프라인',
}

export enum StatusColors {
  online = 'green-500',
  idle = 'yellow-300',
  dnd = 'red-500',
  offline = 'gray-600',
}
