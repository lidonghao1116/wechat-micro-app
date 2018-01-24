import * as mapping from "../../../data/mapping"
import cm from "../../../utils/common"
import ft from "../../../utils/filters"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    initNothing:false,
    nothingTips:"暂无数据，请先报名课程或等待审核",
    records:{},
    pageName:"培训记录",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.trainRecord();
  },
  onbackTap:function () {
    wx.switchTab({
      url:"/pages/mine/mine"
    })
    // wx.navigateBack();
  },
  trainRecord:function (e) {
    var trainRecord = mapping.global_config.enrolled;
    console.log(trainRecord)
    cm.http(trainRecord, "post", this.getTrainRecordData);
  },
  getTrainRecordData:function (data) {
    if (data.success){
      if(data.jsonData.length==0){
        this.setData({
          initNothing:true,
        })
      }else {
        this.processTrainRecordData(data.jsonData);
      }
    } else if (data.code==20004){
      this.setData({
        initNothing:true,
      })
    }else {
      console.log(data.msg)
    }
  },
  processTrainRecordData:function (data) {
    console.log(data)
    var records=[];
    for(var i in data){
      var obj=data[i];
      var signValue = ft.fmStatusData(obj.signStatus);
      var temp={
        courseName:obj.courseName,
        examForm:obj.examForm,
        learnCycle:obj.learnCycle,
        packageName:obj.packageName,
        school:obj.school,
        signDate:obj.signDate,
        signStatus:obj.signStatus,
        signValue:signValue
      }
      records.push(temp)
    }

    this.setData({
      records:records
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