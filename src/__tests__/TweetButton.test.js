import React from 'react'
import {TweetButton} from '../components/ShareButtons'

describe('TweetButton', () => {
  it('should render a Twitter Tweet button', () => {
    const wrapper = shallow(
      <TweetButton url="https://sketchpacks.com"
        text="Sketchpacks for macOS — Manage your Sketch plugins from the menu bar"
        via="sketchpacks"
        related="adamkirkwood"
        showCount />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
