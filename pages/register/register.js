import * as mapping from "../../data/mapping"
import cm from "../../utils/common"
import ft from "../../utils/filters"


Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:"",
    captchaValue:"",
    mobileValue:"",
    smsValue:"",
    captcha_state:false,
    mobile_state:false,
    sms_state:false,
    smsClickable:false,
    startClickable:false,
    smsTxt:"获取验证码",
    second:20
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.captchaCode();
  },
  onStartTap:function (e) {
    var params={
      mobile: this.data.mobileValue,
      captchaCode: this.data.captchaValue,
      smsCode:this.data.smsValue
    }
    var url=mapping.global_config.registerBind;
    cm.http(url,"post",this.registerBind,params);
  },
  registerBind:function (data) {
    console.log(data)
  },
  captchaCode:function (e) {
    var captchaCode = mapping.global_config.getCaptchaCode;
    cm.http(captchaCode,"get",this.getCaptchaCodeData);
  },
  getCaptchaCodeData:function (data) {
    console.log(data);
    if (data.success){
      var imgUrl="data:image/jpeg;base64," + data.jsonData.captcha;
      this.setData({
        imgUrl:imgUrl
      })
    }else {
      wx.showToast({
        title:data.msg
      })
    }
  },
  checkSmsCode:function (e) {
    var code=this.data.captchaValue;
    var url=mapping.global_config.chkCaptchaCode+ "?code=" + code;
    console.log(url)
    cm.http(url,"get",this.processCodeData);
  },
  processCodeData:function (data) {
    if (data.success){
      this.setData({
        captcha_state:true
      })
      this.getSmsCode();
    }else {
      this.setData({
        captcha_state:false
      })
      this.captchaCode();
      wx.showToast({
        title:data.msg
      })
    }
  },

  getValue:function (e) {
    let id=e.target.id;
    switch (id){
      case "mobileCode":
        this.setData({
          mobileValue: e.detail.value
        })
          console.log(this.data.mobileValue)
          this.checkStart();
        break;
      case "captchaCode":
        this.setData({
          captchaValue: e.detail.value
        })
        var ms=this.data.mobile_state;
        var captcha=this.data.captchaValue;
        if (ms){
          var regExp = /^\d{5,8}$/;
          if (regExp.test(captcha)) {
            this.setData({
              captcha_state:true,
              smsClickable:true
            })
            this.checkStart();
          } else {
            this.setData({
              captcha_state:false,
              smsClickable:false
            })
          }
        }
        console.log(this.data)
        break;
      case "smsCode":
        this.setData({
          smsValue: e.detail.value
        })
        this.checkStart();
        break;
      default:
        break;
    }

  },
  checkStart:function (e) {
    let smsV=this.data.smsValue;
    let msV=this.data.mobileValue;
    let csV=this.data.captchaValue;
    let ms=this.data.mobile_state;
    let cs=this.data.captcha_state;
    if (ms&&cs&&!cm.isEmpty(smsV)&&!cm.isEmpty(msV)&&!cm.isEmpty(csV)){
      this.setData({
        startClickable:true
      })
    }else {
      this.setData({
        startClickable:false
      })
    }
  },
  //获取验证码
  getSmsCode:function (e) {
    let mobile=this.data.mobileValue;
    console.log(mobile);
    var url=mapping.global_config.registerSmsCode+ "?mobile=" + mobile;
    cm.http(url,"get",this.processSmsData);
  },
  processSmsData:function (data) {
    if (data.success){
      this.countDown();
    }else {
      wx.showToast({
        title:data.msg
      })
    }
  },
  countDown:function () {
    var second = this.data.second;
    if(second<=0){
      this.setData({
        smsClickable:true,
        smsTxt:"重获验证码",
        second:20
      })
      return;
    }else {
      setTimeout(()=> {
        this.setData({
          smsClickable:false,
          smsTxt:second+"秒",
          second: second - 1
        });
        this.countDown();
      }, 1000)
    }
  },
  registerConfirm:function (e) {
    var params={
      name:e.target.id,
      value:e.detail.value
    }
    console.log(params.name,params.value);
    switch (params.name) {
      case 'mobileCode':
        if (cm.isEmpty(params.value)) {
          wx.showToast({
           title:'请输入手机号'
          })
          this.setData({
            mobile_state:false
          })
        }
        else if (!cm.regMobile(params.value)) {
          this.setData({
            mobile_state:false
          })
        }
        else {
          this.setData({
            mobile_state:true
          })
        }
        break;
      case 'captchaCode':
        if (cm.isEmpty(params.value)) {
          wx.showToast({
            title:'请填图片验证码'
          })
          this.setData({
            captcha_state:false
          })
        }else if (!cm.regCaptcha(params.value)){
          this.setData({
            captcha_state:false
          })
        } else {
          this.setData({
            captcha_state:true
          })
        }
        break;
      case 'smsCode':
        if (cm.isEmpty(params.value)) {
          wx.showToast({
            title:'请填写验证码'
          })
          this.setData({
            sms_state:false
          })
        }
        else if (!cm.regNum(params.value)) {
          this.setData({
            sms_state:false
          })
        }
        else {
          this.setData({
            sms_state:true
          })
        }
    }
  },
})