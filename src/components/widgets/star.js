import React, { Component } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './widgets.scss';

class Paging extends Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
  }

  render() {
    let stars = []
    let star = this.props.star || 0;
    let fullStar = Math.floor(star / 2);
    let halfStar = star - fullStar * 2;
    let emptyStar = 5 - fullStar - halfStar;
    
    let size = this.props.big ? 'big' : 'small';

    for (let i = 0; i < fullStar; i++) {
      stars.push(
        <span key={`star-${i}`} className={`sprite sprite-${size}-fillstar`}></span>
      )
    }
    for (let j = 0; j < halfStar; j++) {
      stars.push(
        <span key={`halfStar${j}`} className={`sprite sprite-${size}-halfstar`}></span>
      )
    }
    for (let k = 0; k < emptyStar; k++) {
      stars.push(
        <span key={`emptyStar${k}`} className={`sprite sprite-${size}-graystar`}></span>
      )
    }
    return (
      <div>
        {stars}
      </div>
    )
  }
}

export default withStyles(s)(Paging);