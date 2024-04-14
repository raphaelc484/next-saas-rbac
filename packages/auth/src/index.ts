import {
  AbilityBuilder,
  CreateAbility,
  createMongoAbility,
  ForcedSubject,
  MongoAbility,
} from '@casl/ability'

import { User } from './models/user'
import { permissions } from './permission'

const actions = ['manage', 'invite', 'delete'] as const
const subjects = ['User', 'all'] as const

type AppAbilities = [
  (typeof actions)[number],
  (
    | (typeof subjects)[number]
    | ForcedSubject<Exclude<(typeof subjects)[number], 'all'>>
  ),
]

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export function defineAbilityFor(user: User) {
  // const { build, can, cannot } = new AbilityBuilder(createAppAbility)

  // can('invite', 'User')
  // /**
  //  * Por definição os User não possuem nenhuma permissão
  //  * Não seria nencessário passar o comando abaixo, mas para fim de didático será escrito
  //  */
  // cannot('delete', 'User')

  // export const ability = build()

  const builder = new AbilityBuilder(createAppAbility)

  if (typeof permissions[user.role] !== 'function') {
    throw new Error(`Permission for role ${user.role} not found`)
  }

  permissions[user.role](user, builder)

  const ability = builder.build()

  return ability
}