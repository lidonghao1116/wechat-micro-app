import * as mapping from "../../../data/mapping"
import cm from "../../../utils/common"
import ft from "../../../utils/filters"
import {UserInfo} from "../../../utils/class/UserInfo"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageName: "家策商学院",
    isShowLogo: true,
    nothingTips: "暂无数据，请报名课程或等待审核",
    lists: {},
    isHidden:true,
    course:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.studyList();
  },
  onbackTap:function () {
    wx.switchTab({
      url:"/pages/mine/mine"
    })
    // wx.navigateBack();
  },
  onCancelTap:function (e) {
    this.setData({
      isHidden:true
    })
  },
  onListTap:function (e) {
    var status=e.currentTarget.dataset.status;
    var pid=e.currentTarget.dataset.pid;
    console.log(pid)
    if (status=="bubao"){
      wx.showToast({
        title: '该产品下有课程已报名',
      })
    }else if (status=="daibao"){
      this.applyConfirm(pid);
    }
  },
  applyConfirm:function (pid) {
    var userInfo = new UserInfo();
    userInfo.getUserInfo((data)=>{
      this.completeInfo(data.jsonData,pid);
    })
  },
  completeInfo:function (data,pid) {
    if (cm.isEmpty(data.username)){
      cm.showToast("报名前请先完善个人信息","/pages/mine/infoComplete/infoComplete")
    }else {
      var url=mapping.global_config.courseTimes;
      var params = {productId: pid};
      cm.http(url,"post",this.getCourseTimes,params)
    }
  },
  getCourseTimes:function (data) {
    var lists=data.jsonData;
    if (data.length==0){
      wx.showToast({
        title:"数据错误"
      })
      return;
    }
    this.setData({
      isHidden:false
    })
    var course=[];
    for(var i in lists){
      var obj=lists[i];
      console.log(obj);
      var _t={
        courseName:obj.courseName,
        courseId:obj.courseId
      }
      for(var j in obj.classTimes){
        var sObj=obj.classTimes[i];
        console.log(sObj);
        var _st={
          templateName:sObj.templateName,
          templateId:sObj.templateId
        }
        _t.classTimes=_st;
      }
      course.push(_t);
    }
    console.log(course)
    this.setData({
      course:course
    })
  },
  studyList: function (e) {
    var studyList = mapping.global_config.recommend;
    cm.http(studyList, "post", this.getStudyListData);
  },
  getStudyListData: function (data) {
    if (data.success) {
      if (data.jsonData.length == 0) {
        this.setData({
          initNothing: true,
        })
      } else {
        this.processStudyListData(data.jsonData);
      }
    } else if (data.code == 20004) {
      this.setData({
        initNothing: true,
      })
    } else {
      console.log(data.msg)
    }
  },
  processStudyListData: function (data) {
    var lists = [];
    for (var i in data) {
      var obj = data[i];
      var originalPrice = ft.fmStudyListData(obj.originalPrice)
      var status=ft.fmEnrollStatus(obj.status)
      let temp = {
        productName: obj.productName,
        workType: obj.workType,
        summary: obj.summary,
        price: obj.price,
        originalPrice: originalPrice,
        isDiscount:obj.isDiscount,
        status:status,
        productId:obj.productId
      }
      lists.push(temp)
    }
    this.setData({
      lists: lists
    })
  },
  applyComplete:function (e) {
    console.log("apply")
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