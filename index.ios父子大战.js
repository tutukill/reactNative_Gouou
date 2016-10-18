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
  Image,
  TextInput,
  ScrollView,
  ListView
} from 'react-native';

class Son extends Component {
  constructor(props){
    super(props)
    this.state = {
      times : props.times
    }
  }

  componentWillMount(){
    console.log('Son','componentWillMount')
  }

  componentDidMount(){
    console.log('Son','componentDidMount')
  }

  componentWillReceiveProps(props){
    console.log(props)
    console.log('Son','componentWillReceivePros')
    this.setState({
      times: props.times

    })
    return true
  }

  shouldComponentUpdate(){
    console.log('Son','shouldComponentUpdate')
    return true
  }

  componentWillUpdate(){
    console.log('Son','componentWillUpdate')
  }

  componentDidUpdate(){
    console.log('Son','componentDidUpdate')
  }

  timePlus(){
    let times = this.state.times
    times ++
    this.setState({
      times : times
    })
  }

  timeReset(){
    this.props.timeReset
  }

  render() {
    console.log('Son','render')
    return (
        <View style={styles.contain}>
          <Text style={styles.rowtext} onPress = {this.timePlus.bind(this)}>
            儿子说：有本事你揍我啊
          </Text>
          <Text style={styles.rowtext}>
            你居然揍我 {this.state.times} 次了
          </Text>
          <Text style={styles.rowtext} onPress = {this.timeReset.bind(this)}>
            信不信我亲亲你
          </Text>
        </View>
    );
  }
}

class Gouou extends Component {
  constructor(props){
    super(props)
    this.state = {
      times : 2,
      hit : false
    }
  }

  componentWillMount(){
    console.log('father','componentWillMount')
  }

  componentDidMount(){
    console.log('father','componentDidMount')
  }

  shouldComponentUpdate(){
    console.log('father','shouldComponentUpdate')
    return true
  }

  componentWillUpdate(){
    console.log('father','componentWillUpdate')
  }

  componentDidUpdate(){
    console.log('father','componentDidUpdate')
  }

  timePlus(){
    let times = this.state.times
    times += 3
    this.setState({
      times :times
    })
  }

  timeReset(){
    this.setState({
      times : 0
    })
  }

  willHit(){
    this.setState({
      hit : !this.state.hit
    })
  }

  render() {
    console.log('father','render')
    return (
        <View style={styles.contain}>
          <Text style={styles.rowtext} onPress = {this.timeReset.bind(this)}>
            老子说：心情好就放你一马吧
          </Text>
          <Text style={styles.rowtext} onPress = {this.willHit.bind(this)}>
            到底揍不揍
          </Text>
          <Text style={styles.rowtext}>
            就揍了你 {this.state.times} 次而已
          </Text>
          <Text style={styles.rowtext} onPress = {this.timePlus.bind(this)}>
            不听话就揍 3 次 
          </Text>
          {
            this.state.hit 
            ? <Son times = {this.state.times} timeReset = {this.timeReset} />
            : null
          }
          
        </View>
    );
  }
}

const styles = StyleSheet.create({
  contain : {
    flex: 1,
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowtext:{
    height: 50,
  }
})

AppRegistry.registerComponent('Gouou', () => Gouou);
