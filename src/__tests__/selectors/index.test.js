import {
  getLibrary,
  getSketchpack,
  getManagedPlugins,
  getReducedLibrary
} from '../../selectors'

const state = {
  library: {
    items: [
      {
        name: 'sketch-measure',
        version: '2.0.0',
        owner: {
          handle: 'utom',
          name: 'utom'
        }
      },
      {
        name: 'plugin-beta',
        version: '1.0.0',
        owner: {
          handle: 'author-beta',
          name: 'Author Beta'
        }
      }
    ]
  },
  sketchpack: {
    items: [
      {
        name: "sketch-measure",
        owner: "utom",
        version: "^2.0.0",
        version_range: [ ">=2.0.0", "<3.0.0" ]
      },

    ]
  }
}

describe('getReducedLibrary', () => {
  it('should return library items found in the sketchpack', () => {
    const library = getReducedLibrary(state)
    expect(library).toMatchSnapshot()
    expect(Object.keys(library).length).toEqual(2)
  })
})

describe('getManagedPlugins', () => {
  it('should return library items found in the sketchpack', () => {
    const managedPlugins = getManagedPlugins(state)
    expect(managedPlugins).toMatchSnapshot()
    expect(managedPlugins.length).toEqual(1)
    expect(managedPlugins[0].name).toEqual(state.sketchpack.items[0].name)
    expect(managedPlugins[0].owner).toEqual(state.sketchpack.items[0].owner)
  })
})
