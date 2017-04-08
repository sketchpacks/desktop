import {
  sanitizeSemVer,
  hasSemanticRange
} from '../../lib/utils'

describe('sanitizeSemVer', () => {
  const EXPECTATIONS = [
    { given: "", expected: "0.0.0" },
    { given: "1.5", expected: "1.5.0" },
    { given: "v1.5", expected: "1.5.0" },
    { given: "1.5a", expected: "1.5.0" },
    { given: "v1.5a", expected: "1.5.0" },
    { given: "1.5.x", expected: "1.5.0" },
    { given: "1.5.2", expected: "1.5.2" },
    { given: " 1.5.2", expected: "1.5.2" },
    { given: "1.5.2-foo", expected: "1.5.2" },
    { given: "1.5.2-foo.10", expected: "1.5.2" },
    { given: "v1.5.2", expected: "1.5.2" },
    { given: 1.5, expected: "1.5.0" },
    { given: 1, expected: "1.0.0" }
  ]

  EXPECTATIONS.forEach(t => {
    it(`should sanitize "${t.given}" as "${t.expected}"`, () => {
      expect(sanitizeSemVer(t.given)).toEqual(t.expected)
    })
  })
})

describe('hasSemanticRange', () => {
  it('should return true with a caret (^)', () => {
    let plugin = { version: '^1.0.0' }
    expect(hasSemanticRange(plugin)).toEqual(true)
  })

  it('should return true with a tilde (~)', () => {
    let plugin = { version: '~1.0.0' }
    expect(hasSemanticRange(plugin)).toEqual(true)
  })

  it('should return false without range flags', () => {
    let plugin = { version: '1.0.0' }
    expect(hasSemanticRange(plugin)).toEqual(false)
  })
})
