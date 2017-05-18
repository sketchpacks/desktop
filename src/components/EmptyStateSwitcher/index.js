import React from 'react'

const EmptyManagedState = () => {
  return (
    <div className="empty-state empty-state--expanded">
      <span className="o-emoji o-emoji--xl">😐</span>
      <h4>No installed plugins</h4>

      <p>Managed plugins will appear here.</p>
    </div>
  )
}

const EmptyUnmanagedState = () => {
  return (
    <div className="empty-state empty-state--expanded">
      <span className="o-emoji o-emoji--xl">😐</span>
      <h4>No unmanaged plugins installed</h4>

      <p>Unidentified plugins will appear here.</p>
    </div>
  )
}

const EmptyUpdatesState = () => {
  return (
    <div className="empty-state empty-state--expanded">
      <span className="o-emoji o-emoji--xl">🖖🏽</span>

      <h4>No updates available</h4>

      <p>Available plugin updates will appear here.</p>
    </div>
  )
}

const EmptyBrowseState = () => {
  return (
    <div className="empty-state empty-state--expanded">
      <span className="o-emoji o-emoji--xl">⚡️</span>
      <h4>Fetching plugins</h4>
    </div>
  )
}

const EmptySearchResultsState = () => {
  return (
    <div className="empty-state empty-state--expanded">
      <span className="o-emoji o-emoji--xl">🔭</span>
      <h4>No results found</h4>
    </div>
  )
}


const STATES = {
  managed: EmptyManagedState,
  unmanaged: EmptyUnmanagedState,
  updates: EmptyUpdatesState,
  browse: EmptyBrowseState,
  search: EmptySearchResultsState
}

const EmptyStateSwitcher = ({ pathname }) => {
  const segments = pathname.split('/')
  const ctx = segments[segments.length-1]

  const EmptyState = STATES[ctx] || STATES['browse']

  return <EmptyState />
}

export default EmptyStateSwitcher
