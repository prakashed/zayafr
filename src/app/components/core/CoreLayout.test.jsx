import React from 'react';
import { mount } from 'enzyme';
import CoreLayout from './CoreLayout';

const wrapper = mount(<CoreLayout />);

test('CoreLayout renders hello world', () => {
  const h1 = wrapper.find('h1');
  expect(h1.text()).toBe('Hello World, get started');
});
