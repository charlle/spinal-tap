/*
    File: Router.js
    Author: Charleston Malkemus
    Date: 15 October 2017

    document.title = newTitle
    document.querySelector("meta[name='description']").setAttribute("content", var);
    var meta = document.createElement('meta');
    meta.httpEquiv = "X-UA-Compatible";
    meta.content = "IE=edge";
    document.getElementsByTagName('head')[0].appendChild(meta);
*/
import React, { Component } from 'react';
import Format from './lib/format';


export default class Router extends Component {
	constructor(props) {
    super(props);
    /*
      Make this the universal 
      state for your app.
    */
    this.state = {
      _path: '', // url path: /company/about-us
      _params: '', // url params: ?id=1234&name=john
      _width: null, // width of window
      _height: null, // height of window

    };

    this.format = new Format();

    this.Store = this.Store.bind(this);
    this.Tap = this.Tap.bind(this);
    this.Up = this.Up.bind(this);

    this.updateWindow = this.updateWindow.bind(this);
    this.updateHistory = this.updateHistory.bind(this);
  }

  /*
      Method: Store
      Params: value (object)
      application level storage
      sustains a universal state
      let auth = {auth: true}
      -> this.props.spine.auth == true

      ** DOESN'T WORK
  */
  Store(v) {
    console.log(v);
    this.setState(v);
  }

  /*
      Method: Tap
      Params: synthetic event
      creates a synthetic anchor tag
      * needs an href attribute
      <a href="home" onClick={this.props.spine.Tap}></a>
  */
  Tap(e) {
    e.preventDefault();
    let url = e.target.href;
    this.updateHistory(url);

    let path = window.location.pathname.substring(1);
    let search = window.location.search;
    let params = this.format.url(search);

    if(this.state._path !== path || 
      ( this.state._path === path && 
        this.state._params !== params) ) {
      this.setState({_path: path, _params: params});
    }
  }

  /*
      Method: Up
      Params: url (string)
      redirects to a url: checkout?cart=1234&user=clkjd834
      this.props.spine.Up('url: checkout?cart=1234&user=clkjd834')
  */
  Up(url) {
    this.updateHistory(url)
    let split = url.split("?");

    let path = split[0];
    let search = split[1];
    let params = this.format.url(search);

    if(this.state._path !== path || 
      ( this.state._path === path && 
        this.state._params !== params) ) {
      this.setState({_path: path, _params: params});
    }
  }
  
  updateWindow() {
    let path = window.location.pathname.substring(1);
    let search = window.location.search;
    let params = this.format.url(search);    
    this.setState({ 
      _width: window.innerWidth, 
      _height: window.innerHeight,
      _path: path, 
      _params: params,
    });
  }

  updateHistory(url) {
    window.history.pushState(null, null, url);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindow);
    window.removeEventListener('popstate', this.updateWindow);
  }

  componentWillMount() {
    this.updateWindow();
    window.addEventListener('resize', this.updateWindow);
    window.addEventListener('popstate', this.updateWindow);

    this.setState({
      Up: this.Up,
      Tap: this.Tap,
      Store: this.Store,
    });
  }

	render() {
    let spine = this.state;
    let children = React.Children.map(this.props.children, (c) => {
      if(this.state._path === c.props.path) {
        return React.cloneElement(c, { spine: spine });
      } else if(c.props.initial && 
          ( !this.state._path || 
            this.state._path === 'index' || 
            this.state._path === 'index.html')
        ) {
        return React.cloneElement(c, { spine: spine });
      } else { return; }
    });

    // if no match => send to initial || 404 page
    if(children.length === 0) {
      children = React.Children.map(this.props.children, (c) => {
        if(c.props.initial) return React.cloneElement(c, { spine: spine });
      });
    }

    return children;
	}
}

