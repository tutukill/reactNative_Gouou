'use strict'

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  TabBarIOS,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  AlertIOS,
  AsyncStorage
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons'
import request from '../common/request'
import config from '../common/config'
var Video = require('react-native-video').default
var Button = require('react-native-button')
var util = require('../common/util')
var width = Dimensions.get('window').width

//翻页相关属性管理 
let cachedResults={
  nextPage:1,
  items:[],
  total:0
}

var Detail = React.createClass({
  getInitialState(){
    var data = this.props.data
    var ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
    })
    return{
      data:data,

      // comments
      dataSource: ds.cloneWithRows([]),

      behavior: 'padding',

      // video loads
      videoOk: true,
      videoLoaded: false,
      playing: false,
      paused: false,
      videoProgress: 0.01,
      videoTotal: 0,
      currentTime: 0,

      // modal
      content: '',
      animationType: 'none',
      modalVisible: false,
      isSending: false,

      // video player
      rate:1,
      muted:false,
      resizeMode:'contain',
      repeat:false,
    }
  },

  _renderRow(row){
    return(
      <View key={row.id} style={styles.replyBox}>
        <Image style={styles.replyAvatar} source={{uri:util.avatar(row.replyBy.avatar)}} />
        <View style={styles.reply}>
          <Text style={styles.replyNickname}>{row.replyBy.nickname}</Text>
          <Text style={styles.replyContent}>{row.content}</Text>
        </View>
      </View>
    )
  },

  _pop(){
    this.props.navigator.pop()
  },

  _onLoadState(){
    console.log('_onLoadState like you')
  },

  _onLoad(){
    console.log('_onLoad like you')
  },

  _onProgress(data){
    if(!this.state.videoLoaded){
      this.setState({
        videoLoaded: true
      })
    }

    var duration = data.playableDuration
    var currentTime = data.currentTime
    var percent = Number((currentTime / duration).toFixed(2))
    var newState = {
      videoTotal: duration,
      currentTime: Number(data.currentTime.toFixed(2)),
      videoProgress: percent
    }

    if (!this.state.videoLoaded) {
      newState.videoLoaded = true
    }
    if (!this.state.playing) {
      newState.playing = true
    }

    this.setState(newState)

  },

  _onEnd(){
    this.setState({
      videoProgress: 1,
      playing: false
    })
  },

  _onError(){
    console.log('i like you')
  },

  _rePlay() {
    this.refs.videoPlayer.seek(0)
  },

  _pause(){
    if(!this.state.paused){
      this.setState({
        paused: true
      })
    }
  },

  _resume(){
    if(this.state.paused){
      this.setState({
        paused: false
      })
    }
  },

  componentDidMount(){
    var that = this
    AsyncStorage.getItem('user')
      .then((data) => {
        var user
        console.log(data)
        if (data) {
          user = JSON.parse(data)
        }

        if (user && user.accessToken) {
          that.setState({
            user: user
          },function(){
            that._fatchData()
          })
        }
      })
  },

  //异步加载数据
  _fatchData(page){
    var that = this

    this.setState({
      isLoadingTail:true,
    })

    request.get(config.api.base + config.api.comment,{
      accessToken: this.state.user.accessToken,
      creation: this.state.data._id,
      page: page,
    })
      .then((data) => {
        if(data && data.success){
          if(data.data.length > 0){
            var items = cachedResults.items.slice()
            
            items = items.concat(data.data)
            // items = data.data.concat(items)
            cachedResults.nextPage += 1          
            cachedResults.items = items
            cachedResults.total = data.total
            
            that.setState({
              isLoadingTail: false,
              dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
            })
          }
        }
      })
      .catch((error) => {
        this.setState({
          isLoadingTail: false,
        })
      
      console.error(error);
    });
  },

  //是否有更多
  _hasMore() {
    return cachedResults.items.length !== cachedResults.total
  },

  //加载更多数据
  _fatchMoreData(page){
    if(!this._hasMore() || this.state.isLoadingTail){
      this.setState({
        isLoadingTail: false,
        page: page
      })
      return 
    }
    var page = cachedResults.nextPage
    this._fatchData(page)
  },

  //底部刷新
  _renderFooter(){
    if(!this._hasMore() && cachedResults.total !== 0){
      return(
        <View style={styles.loadingMore}>
          <Text style={styles.LoadingText}>没有更多了</Text>
        </View>
      )
    }
    if(!this.state.isLoadingTail){
      return <View style={styles.loadingMore} />
    }
    return (
      <ActivityIndicator 
        animating={true} 
        style={styles.loadingMore}
        size="large"
      />
    );
  },

  _renderHeader(){
    var data = this.props.data

    return(
      <View style={styles.infoxBox}>
        <Image style={styles.avatar} source={{uri: util.avatar(data.author.avatar)}} />
        <View style={styles.descBox}>
          <Text style={styles.nickname}>{data.author.nickname}</Text>
          <Text style={styles.title}>{data.title}</Text>
        </View>
      </View>
      )
  },

  _submit(){

    var that = this
    if(!this.state.content){
      return AlertIOS.alert('留言不能为空');
    };
    if(this.state.isSending){
      return AlertIOS.alert('正在评论中...');
    }
    this.setState({
      isSending: true,
    },function(){
      var body = {
        accessToken: this.state.user.accessToken,
        comment: {
          creation: this.state.data._id,
          content: this.state.content,
        }
      }

      var url= config.api.base + config.api.comment

      request.post(url,body)
        .then(function(data){
          if(data && data.success){
            var items = cachedResults.items.slice()
            var content = that.state.content

            items = data.data.concat(items)

            cachedResults.items = items
            cachedResults.total = cachedResults.total + 1
            that.setState({
              content: '',
              isSending: false,
              dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
            })

          }
        })
        .catch((err) => {
          console.log(err)
          that.setState({
            isSending: false,
          })
          AlertIOS.alert('留言失败，稍后从试')
        })
    })
  },

  render(){
    var data = this.props.data

    return (
      <View style={styles.tabContent}>
      <KeyboardAvoidingView behavior={this.state.behavior} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBox} onPress={this._pop}>
            <Icon name='ios-arrow-back' style={styles.backIcon} />
            <Text style={styles.backText}>返回</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOflines={1}>
            视频详情页</Text>
        </View>
        <View style={styles.videoBox}>
          <Video 
            ref='videoPlayer'
            source={{uri:util.video(data.qiniu_video)}}
            style={styles.video}
            volume={5}
            paused={this.state.paused}
            rate={this.state.rate}
            muted={this.state.muted}
            resizeMode={this.state.resizeMode}
            repeat={this.state.repeat}

            onLoadState={this._onLoadState}
            onLoad={this._onLoad}
            onProgress={this._onProgress}
            onEnd={this._onEnd}
            onError={this._onError} />
          
          {
            !this.state.videoOk && <Text style={styles.failText}>视频出错了！很抱歉</Text>
          }

          {
            !this.state.videoLoaded && <ActivityIndicator color='#ee735c' style={styles.loading} />
          }

          {
            this.state.videoLoaded && !this.state.playing
            ? <Icon
                onPress={this._rePlay}
                name='ios-play'
                size={48}
                style={styles.playIcon} />
            : null
          }

          {
            this.state.videoLoaded && this.state.playing
            ? <TouchableOpacity onPress={this._pause} style={styles.pauseBtn}>
                {
                  this.state.paused
                  ? <Icon onPress={this._resume} size={48} name='ios-play' style={styles.resumeIcon}/>
                  : <Text></Text>
                }
              </TouchableOpacity>
            : null
          }

          <View style={styles.progressBox}>
            <View style={[styles.progressBar, {width: width * this.state.videoProgress}]}></View>
          </View>
        </View>

        <ListView 
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderHeader={this._renderHeader}
          renderFooter={this._renderFooter}
          onEndReached={this._fatchMoreData}
          onEndReachedThreshold={20}
          enableEmptySections={true}
          showsVerticalScrollIndicator={true}
          automaticallyAdjustContentInsets={false}/>
        
          <View style={styles.commentBox}>
            <TextInput 
              placeholder='好喜欢这个狗狗啊'
              style={styles.content}
              multiline={true}
              onFocus={this._focus}
              defaultValue={this.state.content}
              onChangeText={(text) => {
                this.setState({
                  content: text
                })
              }}/>
            <Icon name='ios-paper-plane' style={styles.sendButton} onPress={this._submit}/>
          </View>
        </KeyboardAvoidingView>

      </View>
    )
  }
})

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    backgroundColor: '#f5fcff'
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: 64,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    backgroundColor: '#fff'
  },

  backBox: {
    position: 'absolute',
    left: 12,
    top: 32,
    width: 50,
    flexDirection: 'row',
    alignItems: 'center'
  },

  headerTitle: {
    width: width - 120,
    textAlign: 'center'
  },

  backIcon: {
    color: '#999',
    fontSize: 20,
    marginRight: 5
  },

  backText: {
    color: '#999'
  },

  videoBox:{
    width:width,
    height: width * 0.56,
    backgroundColor:'#000',
  },

  video:{
    width:width,
    height: width * 0.56,
    backgroundColor:'#000',
  },

  loading:{
    position:'absolute',
    left:0,
    top:80,
    width: width,
    alignSelf: 'center',
    backgroundColor: 'transparent'
  },

  playIcon: {
    position: 'absolute',
    top: 90,
    left: width / 2 - 30,
    width: 60,
    height: 60,
    paddingTop: 8,
    paddingLeft: 22,
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 30,
    color: '#ed7b66'
  },

  progressBox: {
    width: width,
    height: 2,
    backgroundColor: '#ccc'
  },

  progressBar: {
    width: 1,
    height: 2,
    backgroundColor: '#ff6600'
  },

  pauseBtn:{
    position: 'absolute',
    left: 0,
    top: 0,
    width: width,
    width: width,
    height: width * 0.56,
  },

  resumeIcon: {
    position: 'absolute',
    top: 80,
    left: width / 2 - 30,
    width: 60,
    height: 60,
    paddingTop: 8,
    paddingLeft: 22,
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 30,
    color: '#ed7b66'
  },

  failText: {
    position: 'absolute',
    left: 0,
    top: 90,
    width: width,
    textAlign: 'center',
    color: '#fff',
    backgroundColor: 'transparent'
  },

  infoxBox:{
    width:width,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },

  avatar:{
    width: 60,
    height: 60,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 30,
  },

  descBox:{
    flex: 1,
  },

  nickname:{
    fontSize: 18,
  },

  title:{
    marginTop: 9,
    fontSize: 16,
    lineHeight: 20,
    color: '#666',
  },

  replyBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
  },

  reply: {
    flex: 1,
    borderBottomWidth:1,
    paddingTop: 5,
    paddingBottom: 10,
    borderColor: '#e5e5e5'
  },

  replyAvatar: {
    width: 40,
    height: 40,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 10,
    borderRadius: 20
  },

  replyNickname: {
    color: '#666'
  },

  replyContent: {
    marginTop: 4,
    color: '#666',
    lineHeight: 20,
    marginRight: 10,
  },

  loadingMore:{
    marginVertical:20
  },

  LoadingText:{
    color: '#777',
    textAlign:'center',
  },

  commentBox:{
    flexDirection: 'row',
    padding: 8,
    width: width,
    backgroundColor: '#f5fcff',
  },

  content:{
    width: width * 0.9 - 20,
    paddingLeft:10,
    flexDirection: 'row',
    color:'#333',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    fontSize: 14,
    height: 40,
    paddingTop: 5,
    lineHeight: 40,
  },

  sendButton:{
    width: width * 0.1,
    flexDirection: 'row',
    textAlign:'center',
    color: '#4F8EF7',
    height: 40,
    lineHeight:40,
    fontSize: 25,
    borderRadius: 4,
  },

  container:{
    flex:1,
  }

})

module.exports = Detail