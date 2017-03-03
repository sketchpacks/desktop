import React from 'react'
import Button from '../components/Button'

describe('Button', () => {
  it('should render a button element', () => {
    const wrapper = shallow(
        <Button actionVerb={'Install'} />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
