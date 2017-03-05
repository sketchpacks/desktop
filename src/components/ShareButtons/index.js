import React from 'react'

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
