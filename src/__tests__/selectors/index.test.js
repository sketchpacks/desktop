import {
  getLibrary,
  getSketchpack,
  getManagedPlugins,
  getReducedLibrary,
  getUnmanagedPlugins,
  getLockedPlugins,
  getUnlockedPlugins
} from '../../selectors'

const state = {
  library: {
    items: [
      {
        name: 'managed-unlocked',
        version: '2.0.0',
        owner: {
          handle: 'utom',
          name: 'utom'
        }
      },
      {
        name: 'unmanaged',
        version: '1.0.0',
        owner: {
          handle: 'author-beta',
          name: 'Author Beta'
        }
      },
      {
        name: 'managed-locked',
        version: '1.0.0',
        owner: {
          handle: 'animaapp',
          name: 'Anima App'
        }
      }
    ]
  },
  sketchpack: {
    items: [
      {
        name: "managed-unlocked",
        owner: "utom",
        version: "^2.0.0",
        version_range: [ ">=2.0.0", "<3.0.0" ]
      },
      {
        name: "managed-locked",
        owner: "animaapp",
        version: "1.0.0",
        version_range: [ "1.0.0" ]
      },
    ]
  }
}

describe('getReducedLibrary', () => {
  it('should return library items found in the sketchpack', () => {
    const library = getReducedLibrary(state)
    expect(library).toMatchSnapshot()
    expect(Object.keys(library).length).toEqual(3)
  })
})

describe('getManagedPlugins', () => {
  it('should return library items found in the sketchpack', () => {
    const managedPlugins = getManagedPlugins(state)
    expect(managedPlugins).toMatchSnapshot()
    expect(managedPlugins.length).toEqual(2)
  })
})

describe('getUnmanagedPlugins', () => {
  it('should return library items NOT found in the sketchpack', () => {
    const unmanagedPlugins = getUnmanagedPlugins(state)
    expect(unmanagedPlugins).toMatchSnapshot()
    expect(unmanagedPlugins.length).toEqual(1)
  })
})

describe('getLockedPlugins', () => {
  it('should return locked library items found in the sketchpack', () => {
    const lockedPlugins = getLockedPlugins(state)
    expect(lockedPlugins).toMatchSnapshot()
    expect(lockedPlugins.length).toEqual(1)
  })
})

describe('getUnlockedPlugins', () => {
  it('should return unlocked library items found in the sketchpack', () => {
    const unlockedPlugins = getUnlockedPlugins(state)
    expect(unlockedPlugins).toMatchSnapshot()
    expect(unlockedPlugins.length).toEqual(1)
  })
})
