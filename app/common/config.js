'use strict'

module.exports = {
  header:{
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  },

  backup: {
    avatar: 'http://res.cloudinary.com/gouou/image/upload/v1479286263/avatar/brpzk0j4ie2td2ewedsk.jpg'
  },

  qiniu: {
    video: 'http://ohfvdshmc.bkt.clouddn.com/',
    thumb: 'http://ohfvdshmc.bkt.clouddn.com/',
    avatar: 'http://ogrz9f51j.bkt.clouddn.com/',
    upload: 'http://upload.qiniu.com'
  },
  cloudinary: {
    cloud_name: 'gouou',  
    api_key: '963216299138421',  
    base: 'http://res.cloudinary.com/gouou',
    image: 'https://api.cloudinary.com/v1_1/gouou/image/upload',
    video: 'https://api.cloudinary.com/v1_1/gouou/video/upload',
    audio: 'https://api.cloudinary.com/v1_1/gouou/raw/upload',
  },
  api:{
    // base:'http://rap.taobao.org/mockjs/8425/',
    // base:'http://rap.taobao.org/mockjs/4230/',
    base: 'http://localhost:1234/',
    creations: 'api/creations',
    comment: 'api/comments',
    up: 'api/up',
    video: 'api/creations/video',
    audio: 'api/creations/audio',
    signup: 'api/u/signup',
    verify: 'api/u/verify',
    update: 'api/u/update',
    signature: 'api/signature'
  }
}