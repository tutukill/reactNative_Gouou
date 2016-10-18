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
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons'

import request from '../common/request'
import config from '../common/config'

let width = Dimensions.get('window').width

//翻页相关属性管理 
let cachedResults={
  nextPage:1,
  items:[],
  total:0
}

class List extends Component {
  constructor(props){
    super(props)
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })
    this.state = {
      isLoadingTail:false,
      isRefreshing:false,
      dataSource: ds.cloneWithRows([]),
    }
  }

  //列表结构
  _renderRow(row){
    return (
      <TouchableHighlight>
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
              <Icon name='ios-heart-outline'
                    size={28}
                    style={styles.up} />
              <Text style={styles.handleText}>喜欢</Text>
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

  componentDidMount(){
    this._fatchData(1)
  }

  //异步加载数据
  _fatchData(page){
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
          this.setState({
            isLoadingTail: false,
            dataSource: this.state.dataSource.cloneWithRows(cachedResults.items)
          })
        }else{
          this.setState({
            isRefreshing: false,
            dataSource: this.state.dataSource.cloneWithRows(cachedResults.items)
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
  }

  //是否有更多
  _hasMore() {
    return cachedResults.items.length !== cachedResults.total
  }

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
  }

  _onRefresh() {
    if (!this._hasMore() || this.state.isRefreshing) {
      return
    }

    this._fetchData(0)
  }

  //底部刷新
  _renderfooter(){
    if(!this._hasMore() && cachedResults.total !== 0){
      return(
        <View style={styles.LoadingMore}>
          <Text style={styles.LoadingText}>没有更多</Text>
        </View>
      )
    }
    if(!this.state.isLoadingTail){
      return <View style={styles.LoadingMore} />
    }
    return <ActivityIndicator style={styles.LoadingMore} />;
  }

  render(){
    return (
      <View style={styles.tabContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>列表页面</Text>
        </View>
        <ListView 
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderfooter={this._renderfooter}
          onEndReached={this._fatchMoreData}
          onEndReachedThreshold={20}
          enableEmptySections={true}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh}
              title="玩命加载中..."
              titleColor="#ff6600"
            />
          }
          showVeticalScollIndicator={false}
          automaticallyAdjustContentInsets={false}/>
      </View>
    )
  }
}

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
    color: '#333'
  },
  commentIcon:{
    fontSize: 22,
    color: '#333',
  },
  LoadingMore:{
    marginVertical:20
  },
  LoadingText:{
    color: '#777',
    textAlign:'center',
  }
})

module.exports = List