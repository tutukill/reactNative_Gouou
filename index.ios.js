/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TabBarIOS,
  Navigator,
  AsyncStorage,
} from 'react-native';

import List from './app/creation/index.js'
import Eidt from './app/eidt/index.js'
import Account from './app/account/index.js'
import Login from './app/account/login.js'

import Icon from 'react-native-vector-icons/Ionicons'

var TabBarG = React.createClass({
  getInitialState(){
    return{
      user: null,
      selectedTab : 'list',
      logined: false,
    }
  },

  componentDidMount(){
    this._asyncAppStatus()
  },

  _asyncAppStatus(){
    var that = this

    AsyncStorage.getItem('user')
      .then((data) => {
        var user
        var newState = {}

        if(data){
          user = JSON.parse(data)
        }

        if(user && user.accessToken){
          newState.user = user
          newState.logined = true
        }else{
          newState.logined = false
        }

        that.setState(newState)
      })
  },

  _afterLogin(user){
    var that = this

    user = JSON.stringify(user)

    AsyncStorage.setItem('user', user)
      .then(() => {
        that.setState({
          logined: true,
          user: user
        })
      })
  },

  render(){

    if(!this.state.logined){
      return <Login afterLogin={this._afterLogin} title='true' />
    }

    return(
      <TabBarIOS tintColor="#ee735c">
        <Icon.TabBarItemIOS
          iconName='ios-videocam-outline'
          selectedIconName = 'ios-videocam'
          selected={this.state.selectedTab === 'list'}
          onPress={() => {
            this.setState({
              selectedTab: 'list',
            });
          }}>
          <List title={this.props} />
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          iconName= 'ios-recording-outline'
          selectedIconName = 'ios-recording'
          selected={this.state.selectedTab === 'eidt'}
          onPress={() => {
            this.setState({
              selectedTab: 'eidt'
            });
          }}>
          <Eidt />
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          iconName= 'ios-more-outline'
          selectedIconName = 'ios-more'
          renderAsOriginal 
          selected={this.state.selectedTab === 'account'}
          onPress={() => {
            this.setState({
              selectedTab: 'account'
            });
          }}>
          <Account />
        </Icon.TabBarItemIOS>
      </TabBarIOS>
    )
  }
})

var Gouou = React.createClass ({
  // getInitialState(){
  // },

  render() {
    return (
      <Navigator
        initialRoute={{
          name: 'TabBarG',
          component: TabBarG
        }}
        configureScene={(route) => {
          return Navigator.SceneConfigs.FloatFromRight
        }}
        renderScene={(route, navigator) => {
          var Component = route.component

          return <Component {...route.params} navigator={navigator} />
        }} />
    );
  }
})

AppRegistry.registerComponent('Gouou', () => Gouou);
