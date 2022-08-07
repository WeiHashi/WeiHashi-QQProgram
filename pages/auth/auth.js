//Page Object
const app = getApp()
Page({
    data: {

    },
    auth: function (e) {
        if (e.detail.errMsg=='getUserInfo:ok') {
            wx.switchTab({
                url: '/pages/index/index',
            })
            app.authorize()
        } else{
            wx.showToast({
                title: '授权失败，请重新授权',
                icon: 'none'
            })
        }
    },
    //options(Object)
    onLoad: function (options) {
        wx.hideLoading();
    },
    onReady: function () {

    },
    onShow: function () {
        if (wx.hideHomeButton)
            wx.hideHomeButton()
    },
    onHide: function () {

    },
    onUnload: function () {

    },
    onPullDownRefresh: function () {

    },
    onReachBottom: function () {

    },
    onShareAppMessage: function () {
        return app.onShareAppMessage()
    },
    onPageScroll: function () {

    },
    //item(index,pagePath,text)
    onTabItemTap: function (item) {

    }
});