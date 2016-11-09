'use strict'

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TabBarIOS,
  TextInput,
  AlertIOS,
} from 'react-native';

import config from '../common/config'
import request from '../common/request'
import Button from 'react-native-button'
import {CountDownText} from 'react-native-sk-countdown'

var Login = React.createClass({
  getInitialState(){
    return {
      phoneNumber: '',
      codeSent: false,
      verifyCode: '',
      countingDone: false,
    }
  },

  _sendVerifyCode(){
    var that = this
    var phoneNumber = this.state.phoneNumber

    if(!phoneNumber){
      AlertIOS.alert('手机号不能为空')
      return false
    }

    var body = {
      phoneNumber : phoneNumber
    }

    var signupURL = config.api.base + config.api.signup
    request.post(signupURL, body)
      .then((data) => {
        if(data && data.success){
          that._showVerifyCode()
        }else{
          AlertIOS.alert('获取验证码失败')
        }
      })
      .catch((err) => {
        AlertIOS.alert('检查网络是否良好')
      })
  },

  _showVerifyCode(){
    this.setState({
      codeSent: true,
    })
  },

  _countingDone(){
    this.setState({
      countingDone: true
    })
  },

  _submit(){
    var that = this
    var phoneNumber = this.state.phoneNumber
    var verifyCode = this.state.verifyCode


    if(!phoneNumber || !verifyCode){
      return AlertIOS.alert('手机号或验证码不能为空')
    }

    var body = {
      phoneNumber : phoneNumber,
      verifyCode: verifyCode,
    }

    var verifyURL = config.api.base + config.api.verify

    request.post(verifyURL, body)
      .then((data) => {
        if(data && data.success){
          that.props.afterLogin(data.data)

        }else{
          AlertIOS.alert('获取验证码失败')
        }
      })
      .catch((err) => {
        AlertIOS.alert('检查网络是否良好')
      })
  },
  
  render(){
    return (
      <View style={styles.container}>
        <View style={styles.signupBox}>
          <Text style={styles.title}>快速登录</Text>
          <TextInput 
            placeholder = '输入手机号'
            autoCaptialize = {'none'}
            autoCorrect = {false}
            keyboardType ={'number-pad'}
            style={styles.inputField}
            onChangeText={(text)=>{
              this.setState({
                phoneNumber : text
              })
            }}
          />

          {
            this.state.codeSent
            ? <View style={styles.verifyCodeBox}>
                <TextInput
                  placeholder='输入验证码'
                  autoCaptialize={'none'}
                  autoCorrect={false}
                  keyboardType={'number-pad'}
                  style={styles.inputField}
                  onChangeText={(text) => {
                    this.setState({
                      verifyCode: text
                    })
                  }}
                />

                {
                  this.state.countingDone
                  ? <Text
                    style={styles.countBtn}
                    onPress={this._sendVerifyCode}>获取验证码</Text>
                  : <CountDownText
                      style={styles.countBtn}
                      countType='seconds' // 计时类型：seconds / date
                      auto={true} // 自动开始
                      afterEnd={this._countingDone} // 结束回调
                      timeLeft={60} // 正向计时 时间起点为0秒
                      step={-1} // 计时步长，以秒为单位，正数则为正计时，负数为倒计时
                      startText='获取验证码' // 开始的文本
                      endText='获取验证码' // 结束的文本
                      intervalText={(sec) => '剩余秒数:' + sec} // 定时的文本回调
                    />

                }
            </View>
            : null
          }

          {
            this.state.codeSent
            ? <Button
                style={styles.btn}
                onPress={this._submit}>登录</Button>
            : <Button
                style={styles.btn}
                onPress={this._sendVerifyCode}>获取验证码</Button>
          }
        </View>
      </View>
    )
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9'
  },

  signupBox:{
    marginTop: 30,
  },

  title:{
    marginBottom: 20,
    color: '#333',
    fontSize: 20,
    textAlign: 'center',
  },

  inputField:{
    flex: 1,
    height: 40,
    padding: 5,
    color: '#666',
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 4,
  },

  btn:{
    padding:10,
    textAlign: 'center',
    marginTop: 10,
    backgroundColor: 'transparent',
    borderColor:'#ee735c',
    borderWidth: 1,
    borderRadius: 4,
    color: '#ee735c'
  },

  verifyCodeBox: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  countBtn: {
    width: 110,
    height: 40,
    padding: 10,
    marginLeft: 8,
    backgroundColor: '#ee735c',
    borderColor: '#ee735c',
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 15,
    borderRadius: 2
  },
})

module.exports = Login