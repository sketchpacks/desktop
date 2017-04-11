import { schema, arrayOf, normalize } from 'normalizr'

export const userSchema = new schema.Entity('users')

export const getPluinNamespace = (plugin) => plugin.identifier

export const pluginSchema = new schema.Entity('plugins', {
  owner: userSchema
}, { idAttribute: getPluinNamespace })

export const pluginListSchema = new schema.Array(pluginSchema)
