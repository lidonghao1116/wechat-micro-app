//app.js
App({
  onLaunch: function () {
    var that = this
    var user=wx.getStorageSync('user') || {};
    var userInfo=wx.getStorageSync('userInfo') || {};
    if((!user.openid || (user.expires_in || Date.now()) < (Date.now() + 600))&&(!userInfo.nickName)){
      wx.login({
        success: function(res){
          if(res.code) {
            wx.getUserInfo({
              success: function (res) {
                var objz={};
                objz.avatarUrl=res.userInfo.avatarUrl;
                objz.nickName=res.userInfo.nickName;
                console.log(objz);
                wx.setStorageSync('userInfo', objz);//存储userInfo
              }
            });
            var d=that.globalData;//这里存储了appid、secret、token串
            var l='https://api.weixin.qq.com/sns/jscode2session?appid='+d.appid+'&secret='+d.secret+'&js_code='+res.code+'&grant_type=authorization_code';
            wx.request({
              url: l,
              data: {},
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              // header: {}, // 设置请求的 header
              success: function(res){
                console.log(res)
                var obj={};
                obj.openid=res.data.openid;
                obj.UnionID=res.data.UnionID;
                obj.expires_in=Date.now()+res.data.expires_in;
                console.log(obj);
                wx.setStorageSync('user', obj);//存储openid
              }
            });
          }else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    }
  },

  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },
  globalData: {
    publicPath: "http://test.jiacersxy.com/jiacerapps/",
    userInfo: null,
    appid:'wx67ea1694c0651bd1',//appid需自己提供，此处的appid我随机编写
    secret:'bc0dec754fee4d66ac0c402924120c59',//secret需自己提供，此处的secret我随机编写
  }
})
