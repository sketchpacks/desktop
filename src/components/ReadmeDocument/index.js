import React from 'react'
import ReactMarkdown from 'react-markdown'

const ReadmeDocument = ({ markdown }) => (
  <div>
    <ReactMarkdown source={markdown} />
  </div>
)

export default ReadmeDocument
