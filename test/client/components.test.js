import React from 'react'
import { shallow } from 'enzyme'

import Home from '../../client/components/Home'

test('has a .home-background class name', () => {
  const wrapper = shallow(<Home />)
  expect(wrapper.hasClass('home-background')).toBeTruthy()
})
