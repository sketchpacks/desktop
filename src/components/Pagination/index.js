import React from 'react'

import segmentize from 'segmentize'
import Paginator from 'react-pagify'

import './style.scss'

const Pagination = ({ plugins, currentPage, onSelect }) => {
  const ellipsis = '...'
  const labels = {
    'next': 'Next',
    'previous': 'Previous'
  }
  const pages = parseInt(plugins.lastPage, 10)
  const page = parseInt(currentPage, 10)
  const handleClick = onSelect

  return (
    <nav className="pagination">
      <Paginator.Context
        tags={{
          container: {
            tag: 'ul'
          },
          segment: {
            tag: 'li'
          },
          ellipsis: {
            tag: 'li'
          },
          link: {
            tag: 'a',
            props: {
              className: `button`
            }
          }
        }}
        segments={segmentize({
          centerPage: parseInt(page, 10),
          page: parseInt(plugins.nextPage, 10) - 1,
          pages: parseInt(plugins.lastPage, 10),
          beginPages: 1,
          endPages: 1,
          sidePages: 1
        })} onSelect={handleClick}>

        <Paginator.Button
          className={parseInt(page, 10) > 1 ? '' : 'is-disabled'}
          page={parseInt(page, 10) - 1}>
          {labels.previous}
        </Paginator.Button>

        <Paginator.Segment field="beginPages" />

        <Paginator.Ellipsis className="ellipsis"
          previousField="beginPages" nextField="previousPages"><span>{ellipsis}</span></Paginator.Ellipsis>

        <Paginator.Segment field="previousPages" />
        <Paginator.Segment field="centerPage" />
        <Paginator.Segment field="nextPages" />

        <Paginator.Ellipsis className="ellipsis"
          previousField="nextPages" nextField="endPages"><span>{ellipsis}</span></Paginator.Ellipsis>

        <Paginator.Segment field="endPages" />

        <Paginator.Button
          className={parseInt(page, 10) + 1 < parseInt(pages, 10) ? '' : 'is-disabled'}
          page={parseInt(page, 10) + 1}>
          {labels.next}
        </Paginator.Button>

      </Paginator.Context>
    </nav>
  )
}

export default Pagination
