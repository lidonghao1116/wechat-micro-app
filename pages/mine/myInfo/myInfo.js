import * as mapping from "../../../data/mapping"
import cm from "../../../utils/common"
import ft from "../../../utils/filters"
import {UserInfo} from "../../../utils/class/UserInfo"


Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageName: "个人详情",
    // avatar:"",
    // nickname:"",
    infos:{},
    isLogin:false,
    incomplete:false,
    showModify:true,
    isDisabled:true,
    isFocus:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.userInfo();
  },
  onbackTap: function () {
    wx.switchTab({
      url: "/pages/mine/mine"
    })
  },
  onModifyTap:function (e) {
    var btnId=e.target.id;
    console.log(e);
    if(btnId=="revised"){
      var login=this.data.isLogin;
      if (login){
        this.setData({
          isFocus:true,
          showModify:false,
          isDisabled:false
        })
      }else {
        cm.showToast();
        return;
      }
    }else {
      this.setData({
        isFocus:false,
        showModify:true,
        isDisabled:true
      })
      this.updateInfo();
    }
  },
  onValueInput:function (e) {
    var infos=this.data.infos;
    infos.nickname=e.detail.value;
  },
  userInfo:function (e) {
    var userInfo = new UserInfo();
    userInfo.getUserInfo((data)=>{
      this.responseData(data);
    })
  },
  responseData:function (data) {
   console.log(data)
    if (data.success){
     var obj=data.jsonData;
      var mobile = ft.fmStarData(obj.mobile);
      var temps={
        avatar:obj.headImg,
        nickname:obj.nickname,
        username:obj.username,
        inviteCode:obj.inviteCode,
        mobile:mobile,
        certNo:obj.certNo
      }
      this.setData({
        infos:temps,
        isLogin:true
      })
      if (cm.isEmpty(obj.username) || cm.isEmpty(obj.certNo)) {
        this.setData({
          incomplete:true
        })
      }
      console.log(temps)
    }else {
      wx.getStorage({
        key:"userInfo",
        success:(res)=>{
          var infos={
            avatar:res.data.avatarUrl,
            nickname:res.data.nickName,
            inviteCode:"（注册后才有邀请码）"
          }
          this.setData({
            infos:infos,
            isLogin:false,
          })
          console.log(infos)
        }
      });
    }
  },
  updateInfo:function (e) {
    var updateUrl=mapping.global_config.update;
    console.log(updateUrl)
    var nm=this.data.infos.nickname;
    console.log(nm)
    var params = {nickname: nm};
    cm.http(updateUrl,"post",this.processUpdateData,params)
  },
  processUpdateData:function (data) {
    console.log(data)
    if (data.success){
      wx.showToast({
        title:"保存成功"
      })
    }else {
      wx.showToast({
        title:data.msg
      })
    }
  }
})