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
} from 'react-native';

import List from './app/creation/index.js'
import Eidt from './app/eidt/index.js'
import Account from './app/account/index.js'

import Icon from 'react-native-vector-icons/Ionicons'

var TabBarG = React.createClass({
  getInitialState(){
    return{
      selectedTab : 'list',
      notifCount : 'eidt',
      presses : 'account'
    }
  },

  render(){
    console.log(this.props)
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
  //   console.log('saf')
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
