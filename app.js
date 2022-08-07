//app.js
App({
  //onLaunch,onShow: options(path,query,scene,shareTicket,referrerInfo(appId,extraData))
  onLaunch: function (options) {
    var that = this
    const updateManager = qq.getUpdateManager()

    updateManager.onUpdateReady(function () {
      qq.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      wx.showToast({
        title: '新版本下载失败',
        icon: 'none'
      });
    })
    wx.setBackgroundFetchToken({
      token: "maintanence"
    });
    wx.getBackgroundFetchData({
      fetchType: "pre",
      success(res) {
        const maintenance=JSON.parse(res.fetchedData);
        that.globalData.maintenanceStart=maintenance.maintenanceStart
        that.globalData.maintenanceEnd=maintenance.maintenanceEnd
        wx.setStorageSync('maintenanceStart', maintenance.maintenanceStart);
        wx.setStorageSync('maintenanceEnd', maintenance.maintenanceEnd);
      }
    });
    wx.getStorage({
      key: 'maintenanceStart',
      success: (result)=>{
        that.globalData.maintenanceStart=result.data
      }
    });
    wx.getStorage({
      key: 'maintainceEnd',
      success: (result)=>{
        that.globalData.maintenanceEnd=result.data
      },
      fail: ()=>{},
      complete: ()=>{}
    });
    wx.getSystemInfo({
      success: e => {
        let info = wx.getMenuButtonBoundingClientRect()
        this.globalData.statusHeight = e.statusBarHeight
        this.globalData.capTop = info.top
        this.globalData.capHeight = info.height
        this.globalData.capBottom = info.bottom
      }
    })
    this.login()
    wx.getStorage({
      key: 'name',
      success: (result) => {
        that.globalData.name = result.data
      }
    });
    wx.getStorage({
      key: 'jw_username',
      success: (result) => {
        that.globalData.jw_username = result.data
      }
    });
    wx.getStorage({
      key: 'jw_password',
      success: (result) => {
        that.globalData.jw_password = result.data
      }
    });
    wx.getStorage({
      key: 'term',
      success: (result) => {
        that.globalData.term = result.data
      }
    });
    wx.getStorage({
      key: 'termStart',
      success: (result) => {
        that.globalData.termStart = result.data
      }
    });
  },
  login: function () {
    var that = this
    wx.login({
      success: res => {
        wx.request({
          url: that.globalData.server + 'getOpenid?code=' + res.code,
          success: r => {
            if (r.data.errcode == 0) {
              that.globalData.openid = r.data.openid
              that.authorize()
            } else {
              that.login()
            }
          },
          fail: () => {
            that.login()
          }
        })
      }
    })
  },
  udpateAccount() {
    var that = this
    wx.request({
      url: that.globalData.server + 'updateAccount',
      data: {
        openid: that.globalData.openid,
        nickname: that.globalData.nickname,
        head: that.globalData.headUrl
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        if (res.data.code == 10005) {
          console.log(res.data.data)
          that.globalData.loading = false
          that.globalData.email = res.data.data.email
          that.globalData.classId = res.data.data.class_id
          that.globalData.isCadre = res.data.data.is_cadre
          that.globalData.className = res.data.data.className
          that.globalData.instituteName = res.data.data.instituteName
          that.globalData.term = res.data.data.term
          that.globalData.termStart = res.data.data.termStart
          wx.hideLoading();
          wx.setStorage({
            key: 'term',
            data: res.data.data.term
          });
          wx.setStorage({
            key: 'termStart',
            data: res.data.data.termStart
          });
        }
      }
    })
  },
  authorize() {
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.redirectTo({
            url: '/pages/auth/auth',
          })
        } else
          that.getUserInfo()
      }
      , fail(res) {
        that.login();
      }
    })
  },
  getUserInfo: function () {
    var that = this
    wx.getUserInfo({
      lang: 'zh_CN',
      success: res => {
        that.globalData.nickname = res.userInfo.nickName;
        that.globalData.headUrl = res.userInfo.avatarUrl;
        that.udpateAccount()
      }
    })
  },
  createBg(all) {
    var r = Math.floor(Math.random() * 255), g = Math.floor(Math.random() * 255), b = Math.floor(Math.random() * 255)
    if (r * 0.299 + g * 0.578 + b * 0.114 < 115) return this.createBg(all)
    var R = r.toString(16), G = g.toString(16), B = b.toString(16)
    R = (R.length == 1) ? "0" + R : R
    G = (G.length == 1) ? "0" + G : G
    B = (B.length == 1) ? "0" + B : B
    var bg = "#" + R + G + B
    for (var i = 0; i < all.length; i++)
      if (all[i] == bg)
        return this.createBg(all)
    return bg
  },
  date2Timestamp: function (e) {
    var date = new Date(e)
    var yyyy = date.getFullYear()
    var MM = date.getMonth() + 1
    var dd = date.getDate()
    var HH = date.getHours()
    var mm = date.getMinutes()
    var ss = date.getSeconds()
    return yyyy + '/' + MM + '/' + dd + ' ' + HH + ':' + mm
  },
  onShow: function (options) {
    var that = this
    if (this.globalData.nickName == '')
      this.getUserInfo
    var reg = /^\d+$/
    if (this.globalData.jw_username != '' && !reg.test(this.globalData.jw_username)) {
      wx.request({
        url: that.globalData.server + 'clearInfo?openid=' + that.globalData.openid,
        method: 'PUT',
        success() {
          wx.clearStorage();
          that.globalData.name = ''
          that.globalData.email = ''
          that.globalData.jw_username = ''
          that.globalData.jw_password = ''
        },
        fail() {
        }
      })
    }
    wx.showShareMenu({
      showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
    })
  },
  onHide: function () {

  },
  onShareAppMessage: function () {
    return {
      title: '微哈师 2.0',
      imageUrl: '/images/share_logo.png'
    }
  },
  onError: function (msg) {

  },
  //options(path,query,isEntryPage)
  onPageNotFound: function (options) {

  },
  globalData: {
    statusHeight: 0,
    capTop: 0,
    capHeight: 0,
    capBottom: 0,
    server: 'https://devmeteor.cn:8080/',
    openid: '',
    nickname: '',
    headUrl: '',
    name: '',
    jw_username: '',
    jw_password: '',
    email: '',
    classId: '',
    className: '',
    isCadre: false,
    instituteName: '',
    loading: true,
    maintenanceStart:'',
    maintenanceEnd:'',
    term: '',
    termStart: ''
  }
});