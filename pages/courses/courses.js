import * as mapping from "../../data/mapping"
import cm from "../../utils/common"
var app=getApp();
Page({
  data: {
    courses:{},
    openId:"",
    isactiveTab:true
  },
  onLoad: function (options) {
    var openId=cm.wxid;
    console.log(openId)
    var recommendUrl = mapping.global_config.recommendOnline
    this.getCourseListData(recommendUrl,openId);

  },
  getCourseListData: function (url, openId) {
    var that = this;
    wx.request({
      url: url,
      method: "GET",
      header: {
        "Content-Type": "application/json",
        'wx-openid':openId,
      },
      success: res => {
       that.processCourseData(res)
      },
      fail: function () {

      },
    })
  },
  processCourseData:function (data) {
    var coursesData=data.data.jsonData;
    var courses=[];
    for(var idx in coursesData){
      var subject=coursesData[idx];
      var temp={
        banner:subject.banner,
        courseId:subject.courseId,
        courseName:subject.courseName,
        courseType:subject.courseType,
        fitService:subject.fitService,
        image:subject.image,
        isOwn:subject.isOwn,
        price:subject.price
      }
      courses.push(temp)
    }
    this.setData({
      courses:courses
    })
  },
  onCourseTap:function (e) {
    // this.data.isactiveTab=!this.data.isactiveTab;
    // console.log(this.data.isactiveTab)

    var coursestype=e.currentTarget.id;
    if(coursestype.indexOf("recommend")!=-1){
      this.setData({
        isactiveTab:true
      })
      var recommendUrl = mapping.global_config.recommendOnline;
      this.getCourseListData(recommendUrl,cm.wxid);
    }else if (coursestype.indexOf("purchase")!=-1){
      this.setData({
        isactiveTab:false
      })
      var purchaseUrl = mapping.global_config.courseOwn;
      this.getCourseListData(purchaseUrl,cm.wxid);
    }
  },
  onCourseDetailTap:function (e) {
    var courseId=e.currentTarget.dataset.courseid;
    wx.navigateTo({
      url: 'course-detail/course-detail?id='+courseId
    })
  }
})