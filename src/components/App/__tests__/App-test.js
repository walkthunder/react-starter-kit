jest.unmock('../App');

import App from '../App';
import React from 'react';
import { shallow } from 'enzyme';

describe('App', () => {
  it('renders children correctly', () => {
    const wrapper = shallow(
      <App context={{ insertCss: () => {} }}>
        <div className="child" />
      </App>
    );
    expect(wrapper.contains(<div className="child" />)).toBe(true);
  });
});


import tutils from 'react-addons-test-utils';

describe('App component', function() {
  beforeEach(function() {
      React = require('React');
      ReactDOM = require('ReactDOM');
  })
})
