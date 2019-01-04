import React, { Component } from 'react';
import store from '../../flux/stores';

class QComponent extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.unsub = store.listen(this.onTrigger.bind(this)); 
  }
  
  componentWillUnmount() {
    this.unsub();
  }

  onTrigger(key, data) {
    this._triggerMap(key) && this._triggerMap(key)(data);
  }

  _triggerMap(key) {
    let self = this;
    let map = this.listenerMap ? this.listenerMap() : {};
    return map[key];
  }
  

}

export default QComponent
