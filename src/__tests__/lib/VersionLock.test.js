import {
  setVersionLock,
  getVersionLock
} from '../../lib/VersionLock'

describe('getVersionLock', () => {
  const EXPECTATIONS = [
    { expected: 'unlocked', semver_range: ">=0.0.0" },
    { expected: 'unlocked', semver_range: ">=0.1.0" },
    { expected: 'unlocked', semver_range: ">=0.1.2" },
    { expected: 'unlocked', semver_range: ">=1.0.0" },
    { expected: 'unlocked', semver_range: ">=1.2.0" },
    { expected: 'unlocked', semver_range: ">=1.2.3" },

    { expected: 'locked', semver_range: "=0.0.0" },
    { expected: 'locked', semver_range: "=0.1.0" },
    { expected: 'locked', semver_range: "=0.1.2" },
    { expected: 'locked', semver_range: "=1.0.0" },
    { expected: 'locked', semver_range: "=1.2.0" },
    { expected: 'locked', semver_range: "=1.2.3" },

    { expected: 'minor', semver_range: "^0" },
    { expected: 'minor', semver_range: "^1.0.0" },
    { expected: 'minor', semver_range: "^1.2.0" },
    { expected: 'minor', semver_range: "^1.2.3" },

    { expected: 'patch', semver_range: "~0.1.0" },
    { expected: 'patch', semver_range: "~0.1.2" },
    { expected: 'patch', semver_range: "~1.2.0" },
    { expected: 'patch', semver_range: "~1.2.3" }
  ]

  EXPECTATIONS.forEach(t => {
    it(`"${t.semver_range}" is "${t.expected}"`, () => {
      expect(
        getVersionLock(t.semver_range)
      ).toEqual(t.expected)
    })
  })

})

describe('setVersionLock', () => {
    const EXPECTATIONS = [
      { semver: "0.0.0", lock: 'unlocked', expected: ">=0.0.0" },
      { semver: "0.1.0", lock: 'unlocked', expected: ">=0.1.0" },
      { semver: "0.1.2", lock: 'unlocked', expected: ">=0.1.2" },
      { semver: "1.0.0", lock: 'unlocked', expected: ">=1.0.0" },
      { semver: "1.2.0", lock: 'unlocked', expected: ">=1.2.0" },
      { semver: "1.2.3", lock: 'unlocked', expected: ">=1.2.3" },

      { semver: "0.0.0", lock: 'locked', expected: "=0.0.0" },
      { semver: "0.1.0", lock: 'locked', expected: "=0.1.0" },
      { semver: "0.1.2", lock: 'locked', expected: "=0.1.2" },
      { semver: "1.0.0", lock: 'locked', expected: "=1.0.0" },
      { semver: "1.2.0", lock: 'locked', expected: "=1.2.0" },
      { semver: "1.2.3", lock: 'locked', expected: "=1.2.3" },

      { semver: "0.0.0", lock: 'minor', expected: "^0" },
      { semver: "0.1.0", lock: 'minor', expected: "^0" },
      { semver: "0.1.2", lock: 'minor', expected: "^0" },
      { semver: "1.0.0", lock: 'minor', expected: "^1.0.0" },
      { semver: "1.2.0", lock: 'minor', expected: "^1.2.0" },
      { semver: "1.2.3", lock: 'minor', expected: "^1.2.3" },

      { semver: "0.0.0", lock: 'patch', expected: "~0.0.0" },
      { semver: "0.1.0", lock: 'patch', expected: "~0.1.0" },
      { semver: "0.1.2", lock: 'patch', expected: "~0.1.2" },
      { semver: "1.0.0", lock: 'patch', expected: "~1.0.0" },
      { semver: "1.2.0", lock: 'patch', expected: "~1.2.0" },
      { semver: "1.2.3", lock: 'patch', expected: "~1.2.3" }
    ]

    EXPECTATIONS.forEach(t => {
      it(`${t.lock} "${t.semver}" returns "${t.expected}"`, () => {
        expect(
          setVersionLock({
            semver: t.semver,
            lock: t.lock
          })
        ).toEqual(t.expected)
      })
    })
})
