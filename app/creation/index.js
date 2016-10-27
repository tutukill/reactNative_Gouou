'use strict'

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
  Image,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  AlertIOS,
  Navigator,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons'

import request from '../common/request'
import config from '../common/config'
import Detail from '../creation/detail'

let width = Dimensions.get('window').width

//翻页相关属性管理 
let cachedResults={
  nextPage:1,
  items:[],
  total:0
}

var Item = React.createClass({
  getInitialState(){
    var row = this.props.row
    return{
      up: row.voted,
      row: row
    }
  },
  _up(){
    var that = this
    var up = !this.state.up
    var row = this.state.row
    var url = config.api.base + config.api.up

    var body = {
      id: row._id,
      up: up ? "yes" : "no",
      accessToken: 'abc'
    }

    request.post(url,body)
        .then(function(data){
          if(data && data.success){
            that.setState({
              up: up
            })
          }else{
            AlertIOS.alert('点赞失败，稍后重试')
          }
        })
        .catch(function(err){
          console.log(err)
          AlertIOS.alert('点赞失败，稍后重试')
        })


  },
  render(){
    var row = this.state.row
    return (
      <TouchableHighlight onPress={this.props.onSelect}>
        <View style={styles.item}>
          <Text style={styles.title}>{row.title}</Text>
          <Image source={{uri:row.thumb}} 
                 style={styles.thumb}>
            <Icon name='ios-play'
                  size={28}
                  style={styles.play} />
          </Image>
          <View style={styles.itemFooter}>
            <View style={styles.handleBox}>
              <Icon name={!this.state.up ? 'ios-heart-outline' : 'ios-heart'}
                    size={28}
                    style={this.state.up ? styles.up : styles.down} 
                     onPress={this._up} />
              <Text style={styles.handleText} onPress={this._up}>喜欢</Text>
            </View>
            <View style={styles.handleBox}>
              <Icon name='ios-chatboxes-outline'
                    size={28}
                    style={styles.commentIcon} />
              <Text style={styles.handleText}>评论</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
})

var List = React.createClass({
  getInitialState() {
    const ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
    })
    return {
      isLoadingTail:false,//已经在加载中
      isRefreshing:false,//正在刷新中
      dataSource: ds.cloneWithRows([]),
    };
  },

  //列表结构
  _renderRow(row) {
    return <Item
      key={row._id}
      user={this.state.user}
      onSelect={() => this._loadPage(row)}
      row={row} />
  },

  componentDidMount(){
    this._fatchData(1)
  },

  //异步加载数据
  _fatchData(page){
    var that = this
    if( page !== 0 ){
      this.setState({
        isLoadingTail:true,
      })
    }else{
      this.setState({
        isRefreshing: true
      })
    }
    request.get(config.api.base + config.api.creations,{
      accessToken:'abc',
      page: page
    })
      .then((data) => {
        if(data.success){
          var items = cachedResults.items.slice()
          if(page !== 0){
            items = items.concat(data.data)
          }else{
            items = data.data.concat(items)
            cachedResults.nextPage += 1
          }
          
          cachedResults.items = items
          cachedResults.total = data.total
          
          if(page !== 0){
            that.setState({
              isLoadingTail: false,
              dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
            })
          }else{
            that.setState({
              isRefreshing: false,
              dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
            })
          }
        }
      })
      .catch((error) => {
        if(page !== 0){
          this.setState({
            isLoadingTail: false,
          })
        }else{
          this.setState({
            isRefreshing: false,
          })
        }
      
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

  _onRefresh() {
    if (!this._hasMore() || this.state.isRefreshing) {
      return
    }

    this._fatchData(0)
  },

  //底部刷新
  _renderFooter(){
    if(!this._hasMore() && cachedResults.total !== 0){
      return(
        <View style={styles.loadingMore}>
          <Text style={styles.LoadingText}>没有更多了</Text>
        </View>
      )
      console.log('adsfad')
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

  _loadPage(row) {
    const {navigator}=this.props.title
    navigator.push({
      name: 'detail',
      component: Detail,
      params: {
        data: row
      }
    })
  },

  render(){
    return (
      <View style={styles.tabContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>列表页面</Text>
        </View>
        <ListView 
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderFooter={this._renderFooter}
          onEndReached={this._fatchMoreData}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh}
              tintColor='#ff6600'
              title='玩命加载中...'
            />
          }
          onEndReachedThreshold={20}
          enableEmptySections={true}
          showsVerticalScrollIndicator={true}
          automaticallyAdjustContentInsets={false}
        />
        
      </View>
    )
  },
})

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    backgroundColor:'#f5fcff',
  },
  tabText: {
    color: 'black',
    margin: 50,
  },
  header: {
    paddingTop:25,
    paddingBottom:12,
    backgroundColor:'#ee735c',
  },
  headerTitle: {
    color:'#fff',
    fontSize:15,
    textAlign:'center',
    fontWeight:'600'
  },
  item:{
    width: width,
    marginBottom:10,
    backgroundColor: '#fff'
  },
  thumb:{
    width: width,
    height: width*0.56,
    resizeMode: 'cover'
  },
  title:{
    padding: 10,
    fontSize:18,
    color: '#333',
  },
  itemFooter:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eee'
  },
  handleBox:{
    padding: 10,
    flexDirection: 'row',
    width: width/2-0.5,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  play:{
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 46,
    height: 46,
    paddingTop:9,
    paddingLeft: 18,
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 23,
    color: '#ed7b66'
  },
  handleText:{
    paddingLeft:12,
    fontSize:18,
    color: '#333'
  },
  up:{
    fontSize:22,
    color: '#ed7b66'
  },
  down:{
    fontSize:22,
    color: '#333'
  },
  commentIcon:{
    fontSize: 22,
    color: '#333',
  },
  loadingMore:{
    marginVertical:20
  },
  LoadingText:{
    color: '#777',
    textAlign:'center',
  }
})

module.exports = List