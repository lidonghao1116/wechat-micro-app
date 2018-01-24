import * as mapping from "../../../../data/mapping"
import cm from "../../../../utils/common"
import ft from "../../../../utils/filters"
import {Map} from "../../../../utils/map"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageName:"",
    courseId:"",
    noBack:true,
    tipsShow:true,
    questionMap:{},
    _maxIndex :"",
    _index :null,
    _times:"",
    _minutes:"",
    _seconds:"",
    isSave:false,
    questions:{},
    status:{
      checked:false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.name)
    options.id=2;
    console.log(options.id)
    this.setData({
      pageName:options.name,
      courseId:options.id
    })
    this.data.questionMap = new Map();//存储题目
  },
  startQs:function (e) {
    this.setData({
      tipsShow:false
    })
    this.questionsCtl(2);
  },
  questionsCtl:function (courseId) {
    var questionsUrl = mapping.global_config.questions + "?courseId=" + courseId;
    cm.http(questionsUrl, "get", this.getQuestionsData);
  },
  getQuestionsData:function (data) {
    console.log(data)
    var qm=this.data.questionMap;
    if (data.success){
      console.log(data.jsonData)
      qm.clear();
      var qs=data.jsonData.questions;
      qs.forEach( ( item, i ) => {
        qm.put(i,item)
      } );

      wx.removeStorageSync("batchId");
      wx.setStorageSync("batchId",data.jsonData.batch.id);
      var end = ft.transdate(data.jsonData.batch.endTime);
      var start = ft.transdate(data.jsonData.batch.startTime);
      var _times = end - start;
      this.setData({
        _maxIndex:qs.length,
        _index:0,
        _times:_times,
      })
      var _index = 0;
      this.countDown(_times);//剩余时间
      this.initQuestions(qm.get(0));//初始化第一题
      this.initBtn(_index);//初始化按钮
    }else if (data.code==20004){
      cm.showToast();
    }else {
      wx.showToast({
        title:data.msg
      })
    }
  },
  initBtn:function (index) {
    var _maxIndex=this.data._maxIndex;
    console.log(_maxIndex);
    console.log(index);
    if (index==_maxIndex-1){
      this.setData({
        isSave:true
      })
    }
  },
  initQuestions:function (qsObj) {
    console.log(qsObj);
    var type = qsObj.questionType;
    var answers=[];
    var result=ft.categoryType(type);
    qsObj.answers.forEach((item,i)=>{
      answers.push(item)
    })
    console.log(answers);
    var questions={
      result:result,
      question:qsObj.question,
      answers:answers
    }
    this.setData({
      questions:questions
    })
  },
  countDown:function () {
    var _times=this.data._times;
    _times--;
    var minutes = Math.floor(_times / (60));
    //计算相差秒数
    var seconds = _times % 60;//计算分钟数后剩余的毫秒数
    if (_times<=0){
      // cm.showToast("考试时间到","/pages/courses/course-detail/scores/scores");
    }else {
      setTimeout(()=> {
        this.setData({
          _times:_times,
          _minutes:minutes,
          _seconds: seconds
        });
        this.countDown();
      }, 1000)
    }
  },
  onNextTap:function () {
    var subIdx=this.data.subIdx;
    var _index=this.data._index;
    var _isChecked=this.data.status.checked;
    console.log(_isChecked,subIdx);
    if (!this.getCheckData(_index, _isChecked,subIdx)) return;
    _index += 1;
    console.log(_index)
    var qm=this.data.questionMap;
    this.initQuestions(qm.get(_index));
    this.initBtn(_index);
    this.setData({
      isChecked:false,
      _index:_index,
      status:{
        checked:false
      }
    })
    // this.showCheckData(_index);
  },
  onSaveTap:function (e) {
    var subIdx=this.data.subIdx;
    var _index=this.data._index;
    var _isChecked=this.data.status.checked;
    if (!this.getCheckData(_index,_isChecked,subIdx)) return;
    var userAnswerList = new Array();
    var qm=this.data.questionMap;
    for (var i = 0; i < qm.elements.length; i++) {
      var userAnswer = {id: qm.elements[i].value.id, correctAnswers: qm.elements[i].value.answerKeys};
      userAnswerList.push(userAnswer);
    }
    var params = {
      typeId: 1,
      batchId:wx.getStorageSync('batchId'),
      answers: userAnswerList
    };
    console.log(params)
    var params=JSON.stringify(params);
    var answerUrl = mapping.global_config.saveAnswer;
    var ct="application/json";
    cm.http(answerUrl, "post", this.processAnswerData,params,ct);
  },
  processAnswerData:function (data) {
    console.log(data)
    if (data.success){
      wx.navigateTo({
        url: '/pages/courses/course-detail/scores/scores'
      })
    } else if (data.code == 20004) {
      cm.showToast();
    } else {
      wx.showToast({
        title:data.msg
      });
    }
  },
  getCheckData:function (index,isChecked,subIdx) {
    if (!isChecked){
      wx.showToast({
        title:"请选择答案"
      })
      return false;
    }
    var _obj = this.data.questionMap.get(index);
    var answers=_obj.answers;
    var keys = '';
    keys +=answers[subIdx].id+",";
    console.log(keys);
    if (!_obj.hasOwnProperty('answerKeys')) {//没有答案属性创建答案属性
      _obj.answerKeys = '';
    }
    _obj.answerKeys = keys.substring(0, keys.length - 1);
    console.log(_obj)
    return true;
  },
  showCheckData:function (index) {
    var _obj = questionMap.get(index);
    if (_obj.hasOwnProperty('answerKeys')) {
      var s = getArray(_obj.answerKeys.split(","));
      _obj.answerKeys = s.join(",");//去重重新拼装
    /*  $.each(s, function (i, val) {
        $('input[id=\'' + val + '\']').attr("checked", true)
      });*/
    }
  },
  radioChange:function (e) {
    var v=e.detail.value;
    this.setData({
      status:{
        checked:true
      },
      subIdx:v
    })
  },
})