//加载无数据
export default {
  isCertNo: function (card) {
    console.log(card);
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (reg.test(card) === false) {
      wx.showToast({
        title: "身份证输入不合法"
      });
      return false;
    } else {
      return true;
    }
  },
  regMobile: function (v) {
    var reg= /^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/;
    if (reg.test(v) === false) {
      wx.showToast({
        title: "请填写正确的手机号码"
      });
      return false;
    } else {
      return true;
    }
  },
  regNum:function (v) {
    var reg= /^[0-9]*$/;
    if (reg.test(v) === false) {
      wx.showToast({
        title: "验证码不正确"
      });
      return false;
    } else {
      return true;
    }
  },
  regCaptcha:function (v) {
    var reg = /^\d{5,8}$/;
    if (reg.test(v) === false) {
      wx.showToast({
        title: "图形码不正确"
      });
      return false;
    } else {
      return true;
    }
  },
  wxid: "oC1aRuOJ0jSjVUI2lK7i3K_Fiho4",
  inid: "",
  isEmpty: function (param) {
    if (param != "" && param != null) {
      return false;
    } else {
      return true;
    }
  },
  http: function (url, method, callBack, params,ct) {
    var that = this;
    wx.request({
      url: url,
      method: method || "get",
      data: params || {},
      header: {
        "Content-Type": ct||"application/x-www-form-urlencoded",
        "wx-openid": that.wxid
      },
      success: function (res) {
        callBack(res.data);
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  showToast: function (t, l, d) {
    wx.showToast({
      title: t || '您未绑定账号，请先登录',
      duration: d || 2000,
      success: () => {
        setTimeout(() => {
          wx.navigateTo({
            url: l || '/pages/register/register'
          })
        }, d || 2000)
      }
    })
  },
  M:[
    "A", "B", "C", "D", "E", "F", "G", "H", "I"
  ]
}

function http(url, method, callBack) {
  wx.request({
    url: url,
    method: method,
    header: {
      "Content-Type": "json"
    },
    success: function (res) {
      callBack(res.data);
    },
    fail: function (error) {
      console.log(error)
    }
  })
}


