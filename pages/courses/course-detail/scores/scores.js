import * as mapping from "../../../../data/mapping"
import cm from "../../../../utils/common"
import ft from "../../../../utils/filters"
import {Map} from "../../../../utils/map"

// pages/courses/course-detail/questions/scores/scores.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageName:"母婴护理员【上岗】",
    courseId:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id=wx.getStorageSync("courseId");
    console.log(id);
    this.setData({
      courseId:id
    })
    this.initScore();
  },
  initScore:function () {
    var scoreUrl = mapping.global_config.getScore;
    var params=wx.getStorageSync('batchId');
    console.log(params)
    cm.http(scoreUrl, "post", this.getScoreData,params);
  },
  getScoreData:function (data) {
    console.log(data)
  }
})