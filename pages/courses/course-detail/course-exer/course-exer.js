import * as mapping from "../../../../data/mapping"
import cm from "../../../../utils/common"
import ft from "../../../../utils/filters"
import {Map} from "../../../../utils/map"


Page({
  data: {
    pageName:"",
    courseId:"",
    noBack:true,
    questionMap:{},
    _maxIndex :"",
    _index :null,
    questions:{},
    isCorrect:-1,
    correctTxt:"",
    isDisabled:false,
    isChecked:false,
    testTemplate:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.name)
    console.log(options.id)
    this.setData({
      pageName:options.name,
      courseId:options.id
    })
    this.data.questionMap = new Map();//存储题目
    this.questionsCtl(options.id);
  },
  onNextTap:function (e) {
    this.setData({
      isDisabled:false,
      isChecked:false,
      isCorrect:-1
    })
    var _index=this.data._index++;
    console.log(_index)
    var _maxIndex=this.data._maxIndex;
    console.log(_maxIndex)
    if (_index==_maxIndex){
      var courseId=this.data.courseId;
      this.questionsCtl(courseId);
      return;
    }
    var qm=this.data.questionMap;
    this.initQuestions(qm.get(_index));
  },
  onQsExit:function (e) {
    wx.navigateBack();
  },
  radioChange:function (e) {
    var v=e.detail.value;
    this.setData({
      isDisabled:true
    })
    this.getCheckData(v)
  },
  getCheckData:function (index) {
    var answers=this.data.questions.answers;
    var isAnswer=answers[index].isAnswer;
    var key=0;
    answers.forEach((item,i)=>{
      if(item.isAnswer=="1"){
        key++;
        console.log(key);
        if (index==i){
          this.setData({
            isCorrect:1
          })
        }else {
          this.setData({
            isCorrect:0,
            correctTxt:cm.M[i]
          })
        }
      }
    })
  },
  questionsCtl:function (courseId) {
    var questionsUrl = mapping.global_config.exercises + "?courseId=" + courseId;
    cm.http(questionsUrl, "get", this.getQuestionsData);
  },
  getQuestionsData:function (data) {
    var qm=this.data.questionMap;
    if (data.success){
      qm.clear();
      var qs=data.jsonData.questions;
      console.log(qs);
      qs.forEach( ( item, i ) => {
        console.log( item, i );
        qm.put(i,item)
      } );
      this.setData({
        _maxIndex:qs.length,
        _index:0
      })
      console.log(qm)
      this.initQuestions(qm.get(0));
    }else if (data.code==20004){
      cm.showToast();
    }else {
      wx.showToast({
        title:data.msg
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})