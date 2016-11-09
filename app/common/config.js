'use strict'

module.exports = {
	header:{
		method: 'POST',
		headers: {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json',
	  }
	},
	api:{
		// base:'http://rap.taobao.org/mockjs/8425/',
		base:'http://rap.taobao.org/mockjs/4230/',

		creations:'api/creations',
		up:'api/up',
		video: 'api/creations/video',
		comment: 'api/comments',
		signup: 'api/u/signup',
		verify: 'api/u/verify',
	}
}