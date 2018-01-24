import * as mapping from "../../../data/mapping"
import cm from "../../../utils/common"
import ft from "../../../utils/filters"
import {UserInfo} from "../../../utils/class/UserInfo"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageName:"学员信息完善",
    objectArray: [
      {
        id: "01",
        name: '小学'
      },
      {
        id: "02",
        name: '初中'
      },
      {
        id: "03",
        name: '高中'
      },
      {
        id: "04",
        name: '中专'
      }
      ,
      {
        id: "05",
        name: '大专'
      },
      {
        id: "06",
        name: '大学本科'
      },
      {
        id: "07",
        name: '硕士研究生'
      }
      ,
      {
        id: "08",
        name: '博士生'
      }
    ],
    index:"",
    value:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  onbackTap: function () {
    wx.navigateBack()
  },
  bindPickerChange: function(e) {
    var i=e.detail.value;
    var id=this.data.objectArray[i].id;
    var val=this.data.objectArray[i].name;
    this.setData({
      index: id,
      value:val
    })
  },
  formSubmit:function (e) {
    var params=e.detail.value;
    console.log(e)
    if (!cm.isEmpty(params.certNo) && !cm.isEmpty(params.username) && !cm.isEmpty(params.education)) {
      if (cm.isCertNo(params.certNo)) {
        this.updateInfo(params);
      }
    } else {
      wx.showToast({
        title:"信息输入不完整"
      })
      return;
    }
  },
  updateInfo:function (params) {
    var updateUrl=mapping.global_config.update;
    console.log(updateUrl)
    cm.http(updateUrl,"post",this.processUpdateData,params)
  },
  processUpdateData:function (data) {
    console.log(data)
    if (data.success){
      wx.showToast({
        title:"保存成功！"
      })
      wx.navigateBack();
    }else {
      wx.showToast({
        title:data.msg
      })
    }
  }
})