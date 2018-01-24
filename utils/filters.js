import cm from 'common'

export default {
  formateData: function (value) {
    value = cm.isEmpty(value) ? null : value.indexOf('.') == -1 ? value.replace(/0/, "") + ".0" : value;
    return value;
  },
  fmStatusData: function (value) {
    let status = '';
    switch (value) {
      case "02":
        status = '已报名'
        break;
      case "04":
        status = '已退学'
        break;
      default:
        break;
    }
    return status;
  },
  fmCertData: (v) => {
    v = cm.isEmpty(v) ? "--" : v;
    return v;
  },
  fmEnrollStatus: (v) => {
    let status = {};
    switch (v) {
      case '01':
        status = {
          value: "立即登记",
          class: "daibao"
        }
        break;
      case '02':
        status = {
          value: "待审核",
          class: "daishen"
        }
        break;
      case '03':
        status = {
          value: "停售",
          class: "bubao"
        }
        break;
      case '04':
        status = {
          value: "已报",
          class: "yibao"
        }
        break;
      case '05':
        status = {
          value: "不可报名",
          class: "bubao"
        }
        break;
      default:
        break;
    }
    return status;
  },
  fmStudyListData: (v) => {
    v = cm.isEmpty(v) ? "" : v;
    return v;
  },
  fmCertScoreData: (v) => {
    let examResult = '';
    switch (v) {
      case "01":
        examResult = '合格'
        break;
      case "02":
        examResult = '不合格'
        break;
      case "03":
        examResult = '不合格'
        break;
      case "04":
        examResult = '优秀'
        break;
      case "05":
        examResult = '良好'
        break;
      default:
        break;
    }
    return examResult;
  },
  fmCertDate: v => {
    v = v.split(' ')[0].replace(/[-]/, '年').replace(/[-]/, '月') + "日";
    return v;
  },
  fmStarData: v => {
    var reg = /^(\d{3})\d{4}(\d{4})$/;
    v = v.replace(reg, "$1 **** $2");
    return v;
  },
  transdate: (endTime) => {
    var date = new Date();
    date.setFullYear(endTime.substring(0, 4));
    date.setMonth(endTime.substring(5, 7) - 1);
    date.setDate(endTime.substring(8, 10));
    date.setHours(endTime.substring(11, 13));
    date.setMinutes(endTime.substring(14, 16));
    date.setSeconds(endTime.substring(17, 19));
    return Date.parse(date) / 1000;
  },
  categoryType:(type)=>{
    var result = '';
    switch (type) {
      case '03':
        result = "【多选题】"
        break;
      case '02':
        result = '【判断题】'
        break;
      case '01':
        result = '【单选题】'
        break;
      default:
        break;
    }
    return result;
  }
}

