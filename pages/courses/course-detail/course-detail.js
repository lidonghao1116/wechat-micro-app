import * as mapping from "../../../data/mapping"
import cm from "../../../utils/common"
import ft from "../../../utils/filters"

Page({
  data: {
    condition: "video",
    videos: {},
    scores:{},
    isOwn: {},
    isShowVideo: false,
    noShowMask: true,
    noShareMask:true,
    isSharePage:true,
    hasScores:false,
    pageName:"",
    nothingTips:"暂无答题记录"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var courseId = options.id;
    wx.setStorageSync('courseId', courseId);
    this.setData({
      courseId:courseId
    })
    this.courseInfo(courseId);
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/pages/courses/courses',
      success: function (res) {
        // 转发成功
        console.log("share")
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onBuyTap: function () {
    this.setData({
      noShowMask: false
    })
  },
  onCloseMaskTap: function (e) {
    let ct = e.currentTarget.id;
    let t = e.target.id;
    if (ct=="maskShare"){
      this.setData({
        noShareMask: true
      })
    }else {
      if (t == ct) {
        this.setData({
          noShowMask: true
        })
      }
    }
  },
  onbackTap: function () {
    wx.navigateBack();
  },
  onDetailTap: function (e) {
    var target = e.target.id;
    this.setData({
      condition: target
    })
  },
  onShareMaskTap:function (e) {
    console.log("share")
    this.setData({
      noShareMask:false
    })
  },
  onStartExerTap:function (e) {
    var isOwn = this.data.isOwn;
    var courseId=this.data.courseId;
    var courseName=this.data.courseName;
    console.log(isOwn,courseId,courseName)
    if (isOwn == 1) {
      wx.navigateTo({
        url: 'course-exer/course-exer?id='+courseId+"&name="+courseName
      })
    } else {
      wx.showToast({
        title: "本小练习需购买后才能答题",
      })
    }
  },
  onStartQuestionsTap:function (e) {
    var isOwn = this.data.isOwn;
    var courseId=this.data.courseId;
    var courseName=this.data.courseName;
    if (isOwn == 1) {
      wx.navigateTo({
        url: 'questions/questions?id='+courseId+"&name="+courseName
      })
    } else {
      wx.showToast({
        title: "本模拟题需购买后才能答题",
      })
    }
  },
  //加载课程信息
  courseInfo: function (courseId) {
    var courseUrl = mapping.global_config.courseInfo + "?courseId=" + courseId;
    cm.http(courseUrl, "get", this.getCourseData);
  },
  //加载成绩信息
  courseScore:function (courseId,isOwn) {
    if (isOwn==0){
      this.setData({
        hasScores:false
      })
      return;
    }else {
      var getScoreUrl = mapping.global_config.getAllScore + "?courseId=" + courseId;
      console.log(getScoreUrl);
      cm.http(getScoreUrl, "get", this.getScoreData);
    }
  },
  getScoreData:function (data) {
    console.log(data)
    if (data.success) {
      if (data.jsonData.length!=0){
        this.setData({
          hasScores:true
        })
        this.initScorePage(data.jsonData);
      }else {
        this.setData({
          hasScores:false
        })
      }
    }else {
      this.setData({
        hasScores:false
      })
    }
  },
  getCourseData: function (data) {
    var courseInfo = data.jsonData;
    var judgeScore = ft.formateData(courseInfo.judgeScore);
    var multiScore = ft.formateData(courseInfo.multiScore);
    var singleScore = ft.formateData(courseInfo.singleScore);
    var course = {
      courseName: courseInfo.courseName,
      pageName: courseInfo.courseName,
      isOwn: courseInfo.isOwn,
      courseType: courseInfo.courseType,
      banner: courseInfo.banner,
      price: courseInfo.price,
      courseId: courseInfo.courseId,
      examInfo: {
        courseTime: courseInfo.courseTime,
        judgeCount: courseInfo.judgeCount,
        judgeScore: judgeScore,
        multiCount: courseInfo.multiCount,
        multiScore: multiScore,
        singleCount: courseInfo.singleCount,
        singleScore: singleScore
      },
    }
    this.setData(course)
    console.log(course);
    if (courseInfo.courseType != "02") {
      this.courseVideo(courseInfo.courseId);
    }
    this.courseScore(course.courseId,course.isOwn);
  },
  courseVideo: function (courseId) {
    var videoUrl = mapping.global_config.videoInfo + "?courseId=" + courseId;
    cm.http(videoUrl, "get", this.getVideoData);
  },
  getVideoData: function (data) {
    if (data.success) {
      if (cm.isEmpty(data.jsonData)) {
        return;
      } else {
        this.initSPPage(data.jsonData);
      }
    }
  },
  initSPPage: function (videosData) {
    var videos = []
    for (var i in videosData) {
      let temp = {
        videoDesc: videosData[i].videoDesc,
        videoName: videosData[i].videoName,
        isGuestWatch: videosData[i].isGuestWatch
      }
      videos.push(temp)
    }
    this.setData({
      videos: videos
    })
  },
  initScorePage:function (scoresData) {
    console.log(scoresData)
    var scores=[];
    for(var i in scoresData){
      let temp={
        score:scoresData[i].score,
        startTime:scoresData[i].startTime,
        useTime:scoresData[i].useTime
      }
      scores.push(temp);
    }
    this.setData({
      scores:scores
    })
  },
  onVideoTap: function (e) {
    var isOwn = this.data.isOwn;
    var isGuestWatch = e.currentTarget.dataset.guestwatch;
    if (isOwn == 1 || isGuestWatch == 1) {
      this.setData({
        isShowVideo: true
      })
    } else {
      wx.showToast({
        title: "本视频需购买后才能正常观看",
      })
    }
  }
})