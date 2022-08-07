//Page Object
const app = getApp()
const md5 = require('../../util/md5.js')

Page({
    data: {
        id: '',
        classId: '',
        isCadre: false,
        inClassId: ''
    },
    inId(e) {
        this.setData({
            inClassId: e.detail.value
        })
    },
    joinClass: function () {
        var that = this
        wx.request({
            url: app.globalData.server + 'joinClass',
            data: {
                openid: app.globalData.openid,
                classId: that.data.inClassId
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: 'POST',
            success: (result) => {
                if (result.data.code == 10005) {
                    wx.showToast({
                        title: '已加入班级',
                        icon: 'none'
                    });
                    that.setData({
                        classId: that.data.inClassId,
                        className: result.data.data,
                        inClassId: '',
                    })
                    app.globalData.classId = that.data.classId
                    app.globalData.className = that.data.className
                } else {
                    wx.showToast({
                        title: result.data.msg,
                        icon: 'none'
                    });
                }
            },
            fail: () => {
                wx.showToast({
                    title: '加入失败',
                    icon: 'none'
                });
            }
        });
    },
    copyId() {
        var that = this
        wx.setClipboardData({
            data: that.data.id,
            success: (result) => {
                wx.showToast({
                    title: '已复制'
                });
            },
            fail: () => {
                wx.showToast({
                    title: '复制失败',
                    icon: 'none'
                });
            }
        });
    },
    //options(Object)
    onLoad: function (options) {
        var that=this
        wx.showLoading({
            title: '正在更新数据',
        });
        wx.request({
            url: app.globalData.server + 'updateAccount',
            data: {
                openid: app.globalData.openid,
                nickname:app.globalData.nickname,
                head:app.globalData.headUrl
            },
            method: 'POST',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success(res) {
                if (res.data.code == 10005) {
                    app.globalData.email = res.data.data.email
                    app.globalData.classId = res.data.data.class_id
                    app.globalData.isCadre = res.data.data.is_cadre
                    app.globalData.className = res.data.data.className
                    app.globalData.instituteName=res.data.data.instituteName
                    that.setData({
                        id: md5.hexMD5(md5.hexMD5(app.globalData.openid)),
                        classId: app.globalData.classId,
                        isCadre: app.globalData.isCadre
                    })
                }
            },
            complete(){
                wx.hideLoading();
            }
        })
    },
    onReady: function () {

    },
    onShow: function () {
        this.setData({
            id: md5.hexMD5(md5.hexMD5(app.globalData.openid)),
            classId: app.globalData.classId,
            isCadre: app.globalData.isCadre
        })
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