import React from 'react'
import { shallow } from 'enzyme'

import Home from './Home'

test('has a .home-background class name', () => {
  const wrapper = shallow(<Home />)
  expect(wrapper.hasClass('home-background')).toBeTruthy()
})
