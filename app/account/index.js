'use strict'

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TabBarIOS,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons'
import Login from '../account/login.js'

var Account = React.createClass({
  getInitialState(){
    return {
      
    }
  },
  
  componentDidMount(){

  },

  render(){
    return (
      <View style={styles.container}>
        
      </View>
    )
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

module.exports = Account