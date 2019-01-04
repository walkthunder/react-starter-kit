import React from 'react';
import PropTypes from 'prop-types';
import emptyFunction from 'fbjs/lib/emptyFunction';
import s from './App.scss';

import Header from '../Header';
import Footer from '../Footer';
import ScrollTop from '../widgets/scrollTop';

import actions from '../../flux/actions';

import PlayerWrapper from '../Player.wrapper';
import Share from '../widgets/share-overlay';

function parseParms(str) {
  if (typeof str === 'string') {
    if (str.startsWith('#')) {
      str = str.slice(1);
    }
    var pieces = str.split("&"), data = {}, i, parts;
    for (i = 0; i < pieces.length; i++) {
      parts = pieces[i].split("=");
      if (parts.length < 2) {
        parts.push("");
      }
      data[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
    }
    return data;
  }
  return {};
}

function onCloseHistory() {
  actions.closePlaylist();
}

function setupQt() {
  if (global.process) return;
  window.qt = {
    pub(name, ...args) {
      actions.publish(name, ...args);
    },
  };
}

function selectedPathGen(url) {
  if (!url) {
    return undefined;
  }
  if (url === '/') {
    return 'recpage';
  }
  if (url.indexOf('categories') > 0) {
    return 'categories';
  }
  if (url.indexOf('radiopage') > 0) {
    return 'radiopage';
  }
  if (url.indexOf('user') > 0) {
    return 'user';
  }
  if (url.indexOf('search') > 0) {
    return 'search';
  }
  return undefined;
}

const ContextType = {
  // Enables critical path CSS rendering
  // https://github.com/kriasoft/isomorphic-style-loader
  insertCss: PropTypes.func.isRequired,
  // Universal HTTP client
  fetch: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
  query: PropTypes.object,
};

class App extends React.PureComponent {
  static propTypes = {
    context: PropTypes.shape(ContextType).isRequired,
    children: PropTypes.element.isRequired,
  };
  static childContextTypes = ContextType;

  constructor(props) {
    super(props);
    setupQt();
  }
  getChildContext() {
    return this.props.context;
  }

  componentWillMount() {
    const { insertCss } = this.props.context;
    this.removeCss = insertCss(s);
  }

  componentWillUnmount() {
    this.removeCss();
  }

  render() {
    const selectedPath = selectedPathGen(this.props.context.url);
    const queryObj = this.props.context.query || {};
    const hash = { ...this.props.context.hash };
    const hashObj = parseParms(hash);
    const hasFooter = queryObj.footer !== 'false';
    const player = <PlayerWrapper />;
    return !this.props.error ? (
      <div className={s.wrapper} role="presentation" onClick={onCloseHistory}>
        <Header
          pathIsHome={selectedPath}
          selectedPath={selectedPath}
          hash={hashObj}
          query={queryObj}
          path={this.props.context.url}
          role="menuitem"
        />
        {this.props.children}
        {!global.process ? player : ''}
        {hasFooter ? <Footer /> : <div className={s.placeholder} />}
        <Share />
        <ScrollTop />
      </div>
    ) : (
      this.props.children
    );
  }
}

export default App;
