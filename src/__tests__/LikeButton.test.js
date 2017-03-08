import React from 'react'
import {LikeButton} from '../components/ShareButtons'

describe('LikeButton', () => {
  it('should render a Facebook Like button', () => {
    const wrapper = shallow(
      <LikeButton
        href="https://sketchpacks.com"
        layout={"button_count"}
        action={"like"}
        size={"small"}
        showFaces={"false"}
        share />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
