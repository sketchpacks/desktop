import { schema, arrayOf, normalize } from 'normalizr'

export const userSchema = new schema.Entity('users')

export const getPluginIdentifier = (plugin) => plugin.identifier

export const pluginSchema = new schema.Entity('plugins', {
  owner: userSchema
}, { idAttribute: getPluginIdentifier })

export const manifestSchema = new schema.Entity('plugins', {}, { idAttribute: getPluginIdentifier })

export const pluginListSchema = new schema.Array(pluginSchema)
