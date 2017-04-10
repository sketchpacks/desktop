import { schema, arrayOf, normalize } from 'normalizr'

export const userSchema = new schema.Entity('users')

export const getPluginSlug = (plugin) => `${plugin.owner.handle}/${plugin.name}`

export const pluginSchema = new schema.Entity('plugins', {
  owner: userSchema
}, { idAttribute: getPluginSlug })

export const pluginListSchema = new schema.Array(pluginSchema)
