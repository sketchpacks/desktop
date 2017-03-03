import React from 'react'
import Avatar from '../components/Avatar'

describe('Avatar', () => {
  it('should render an avatar', () => {
    const wrapper = shallow(
        <Avatar handle={'sketchpacks'} width={24} height={24} />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
