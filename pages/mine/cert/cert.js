import * as mapping from "../../../data/mapping"
import cm from "../../../utils/common"
import ft from "../../../utils/filters"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageName:"我的证书",
    nothingTips:"抓经学习，持证上岗",
    isCertPage:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.certInfo();
  },
  onbackTap:function () {
    wx.switchTab({
      url:"/pages/mine/mine"
    })
    // wx.navigateBack();
  },
  certInfo:function (e) {
    var myCertificate = mapping.global_config.myCertificate;
    console.log(myCertificate)
    cm.http(myCertificate, "get", this.getCertInfoData);
  },
  getCertInfoData:function (data) {
    if (data.success){
      if(data.jsonData.length==0){
        this.setData({
          initNothing:true,
        })
      }else {
        this.processCertData(data.jsonData);
      }
    }else if (data.code==20004){
      this.setData({
        initNothing:true,
      })
    }else {
      console.log(data.msg)
    }
  },
  processCertData:function (data) {
    console.log(data);
    var certs=[];
    for(var i in data){
      var obj=data[i];
      var comprehensiveScores=ft.fmCertData(obj.comprehensiveScores)
      var theoryScores=ft.fmCertData(obj.theoryScores)
      var abilityScores=ft.fmCertData(obj.abilityScores)
      var poScores=ft.fmCertData(obj.poScores)
      var examResult=ft.fmCertScoreData(obj.examResult);
      var issuingDate=ft.fmCertDate(obj.issuingDate);
      console.log(issuingDate)
      let temp={
        comprehensiveScores:comprehensiveScores,
        theoryScores:theoryScores,
        abilityScores:abilityScores,
        poScores:poScores,
        examResult:examResult,
        certName:obj.certName,
        certOrgName:obj.certOrgName,
        certificateNo:obj.certificateNo,
        gradeName:obj.gradeName,
        issuingDate:issuingDate
      }
      certs.push(temp)
    }
    this.setData({
      certs:certs
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})