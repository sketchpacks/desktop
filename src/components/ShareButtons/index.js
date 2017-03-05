import React from 'react'

// Facebook Like Button
export const LikeButton = ({ href, layout, action, size, showFaces, share }) => (
  <div
    className="fb-like"
    data-href={href}
    data-layout={layout}
    data-action={action}
    data-size={size}
    data-show-faces={showFaces}
    data-share={share}>
  </div>
)

LikeButton.propTypes = {
  href: React.PropTypes.string,
  layout: React.PropTypes.oneOf(['standard', 'button_count', 'button', 'box_count']),
  show_faces: React.PropTypes.bool,
  action: React.PropTypes.oneOf(['like', 'recommend']),
  size: React.PropTypes.oneOf(['small', 'large']),
  width: React.PropTypes.number,
  share: React.PropTypes.bool
}

// Twitter Tweet Button
export const TweetButton = ({ text, url, via, related, showCount }) => (
  <a href="https://twitter.com/share"
    className="twitter-share-button"
    data-text={text}
    data-url={url}
    data-via={via}
    data-related={related}
    data-show-count={showCount}
  >
    Tweet
  </a>
)

TweetButton.propTypes = {
  text: React.PropTypes.string,
  url: React.PropTypes.string,
  via: React.PropTypes.string,
  related: React.PropTypes.string,
  showCount: React.PropTypes.bool,
}
