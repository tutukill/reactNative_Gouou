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
  ActivityIndicator,
  Dimensions
} from 'react-native';

import List from './app/creation/index.js'
import Eidt from './app/eidt/index.js'
import Account from './app/account/index.js'
import Login from './app/account/login.js'
import Slider from './app/account/slider.js'

import Icon from 'react-native-vector-icons/Ionicons'
var height = Dimensions.get('window').height
var width = Dimensions.get('window').width


var TabBarG = React.createClass({
  getInitialState(){
    return{
      user: null,
      selectedTab : 'list',
      entered: false,
      booted: false,
      logined: false,
    }
  },

  componentDidMount(){
    AsyncStorage.removeItem('entered')
    this._asyncAppStatus()
  },

  _logout(){
    AsyncStorage.removeItem('user')

    this.setState({
      logined: false,
      user: null
    })
  },

  _asyncAppStatus(){
    var that = this

    AsyncStorage.multiGet(['user', 'entered'])
      .then((data) => {
        var userData = data[0][1]
        var entered = data[1][1]
        var user
        var newState = {
          booted: true
        }

        if(userData){
          user = JSON.parse(userData)
        }

        if(user && user.accessToken){
          newState.user = user
          newState.logined = true
        }else{
          newState.logined = false
        }

        if(entered === 'yes'){
          newState.entered = true
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

  _enterSlide(){
    this.setState({
      entered: true
    },function(){
      AsyncStorage.setItem('entered', 'yes')
    })
  },

  render(){
    if(!this.state.booted){
      return(
        <View style={styles.bootPage}>
          <ActivityIndicator color='#ee735c' />
        </View>
      )
    }

    if(!this.state.entered){
      return <Slider enterSlide={this._enterSlide} />
    }

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
          <Account user={this.state.user} logout={this._logout}/>
        </Icon.TabBarItemIOS>
      </TabBarIOS>
    )
  }
})

var Gouou = React.createClass ({

  render() {
    return (
      <View style={styles.container}>
        <Navigator
          stateUP={this.state}
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
      </View>
    )
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bootPage: {
    width: width,
    height: height,
    backgroundColor: '#fff',
    justifyContent: 'center'
  }
})

AppRegistry.registerComponent('Gouou', () => Gouou);







