import semver from 'semver'
import { sanitizeSemVer } from './utils'

export const isFullLocked = (semver) => /^(\=)/.test(semver)

export const isUnlocked = (semver) => /^(\>=)/.test(semver)

export const isMinorLocked = (semver) => /^(\^)/.test(semver)

export const isPatchLocked = (semver) => /^(\~)/.test(semver)

export const getVersionLock = (semver) => {
  if (isPatchLocked(semver)) return 'patch'
  if (isMinorLocked(semver)) return 'minor'
  if (isFullLocked(semver)) return 'locked'
  if (isUnlocked(semver)) return 'unlocked'

  return 'custom'
}

export const unlockedSemver = (semver) => `>=${semver}`

export const lockedSemver = (semver) => `=${semver}`

export const patchLockedSemver = (semver) => `~${semver}`

export const minorLockedSemver = (version) => {
  const cleanSemVer = sanitizeSemVer(version)

  return (semver.major(cleanSemVer) === 0)
    ? `^${semver.major(cleanSemVer)}`
    : `^${cleanSemVer}`
}

export const setVersionLock = ({ semver, lock }) => {
  const cleanSemVer = sanitizeSemVer(semver)

  switch (lock) {
    case "minor":
      return minorLockedSemver(cleanSemVer)
    case "locked":
      return lockedSemver(cleanSemVer)
    case "unlocked":
      return unlockedSemver(cleanSemVer)
    case "patch":
      return patchLockedSemver(cleanSemVer)
  }
}
