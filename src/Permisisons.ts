import { registerEnumType } from 'type-graphql'

export enum Permission {
  ADMIN = 0x1,
  GENERAL = 0x0,
}

registerEnumType(Permission, {
  name: 'Permission',
  description: 'permission',
})

export default class Permissions {
  static has(perm: number, permission: Permission) {
    return (perm & permission) === permission
  }
}
