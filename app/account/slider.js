
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image
} from 'react-native';

import Button from 'react-native-button'
import Swiper from 'react-native-swiper'

var height = Dimensions.get('window').height
var width = Dimensions.get('window').width

var Slider = React.createClass({
  getInitialState(){
    return{
      loop: false,
      banners: [
        require('../assets/images/s1.jpg'),
        require('../assets/images/s2.jpg'),
        require('../assets/images/s3.jpg')
      ],
    }
  },

  _enter() {
    this.props.enterSlide()
  },

  render() {
    return (
      <Swiper
        style={styles.wrapper}
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />}
        paginationStyle={styles.pagination}>
        <View style={styles.slide}>
          <Image style={styles.image} source={this.state.banners[0]} />
        </View>
        <View style={styles.slide}>
          <Image style={styles.image} source={this.state.banners[1]} />
        </View>
        <View style={styles.slide}>
          <Image style={styles.image} source={this.state.banners[2]} />
          <Button
            style={styles.btn}
            onPress={this._enter}>马上体验</Button>
        </View>
      </Swiper>
    )
  }
})

const styles = StyleSheet.create({
  wrapper: {
  },

  slide: {
    flex: 1,
    width: width
  },

  image: {
    flex: 1,
    width: width,
    height: height
  },

  dot: {
    width: 14,
    height: 14,
    backgroundColor: 'transparent',
    borderColor: '#ff6600',
    borderRadius: 7,
    borderWidth: 1,
    marginLeft: 12,
    marginRight: 12
  },

  activeDot: {
    width: 14,
    height: 14,
    backgroundColor: '#ff6600',
    borderColor: '#ff6600',
    borderRadius: 7,
    borderWidth: 1,
    marginLeft: 12,
    marginRight: 12
  },

  pagination: {
    bottom: 30
  },

  btn: {
    position: 'absolute',
    width: width - 20,
    left: 10,
    bottom: 60,
    height: 50,
    padding: 10,
    backgroundColor: '#ee735c',
    borderColor: '#ee735c',
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 18,
    borderRadius: 3,
    color: '#fff'
  }
})

module.exports = Slider