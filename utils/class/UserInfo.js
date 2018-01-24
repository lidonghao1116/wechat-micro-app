import cm from "../common"
import * as mapping from "../../data/mapping"

class UserInfo {
  constructor(url) {
    this.url = url || mapping.global_config.userInfo;
  }

  getUserInfo(cb) {
    this.cb = cb;
    this.methods = "get";
    cm.http(this.url, this.methods, this.processUserInfo.bind(this));
  }
  processUserInfo(data) {
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length-1]    //获取当前页面的对象
    var url = currentPage.route    //当前页面url
    var options = currentPage.options    //如果要获取url中所带的参数可以查看options
    console.log(url);
    if (url.indexOf("myInfo")){
      this.cb(data)
    }else {
      if (data.success) {
        this.cb(data);
      } else {
        cm.showToast();
      }
    }
  }
}

export {UserInfo}