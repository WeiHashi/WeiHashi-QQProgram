//Page Object
const app = getApp()
Page({
    data: {
        tops: [],
        normals: [],
        totalPage: 1,
        currentPage: 1,
        showLoading: false,
        showAll: false,
        classId: '',
        className: '',
        instituteName: '',
        showMask: true,
        maskText: '加载中……'
    },
    //options(Object)
    onLoad: function (options) {
        var that = this
        if (that.data.classId == '')
            setTimeout(() => {
                that.getMessages()
            }, 2000);
        else
            this.getMessages()
    },
    getMessages() {
        var that = this
        that.setData({
            maskText:'加载中……'
        })
        wx.request({
            url: app.globalData.server + 'v2/class/messages?classId=' + that.data.classId,
            success(res) {
                if (res.data.code == 10004) {
                    console.log(res.data)
                    that.setData({
                        totalPage: Math.ceil(res.data.data.total / 10),
                        tops: res.data.data.tops,
                        normals: res.data.data.normals,
                        showMask: res.data.data.tops.length==0&&res.data.data.normals.length==0,
                        maskText:res.data.data.tops.length==0&&res.data.data.normals.length==0?'暂无消息':that.data.maskText
                    })
                }else{
                    that.setData({
                        maskText:res.data.msg
                    })
                }
            },
            fail(){
                that.setData({
                    maskText:'获取失败，点击重试'
                })
            }
        })
    },
    onReady: function () {

    },
    onShow: function () {
        var that = this
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
                    app.globalData.instituteName = res.data.data.instituteName
                    that.setData({
                        classId: app.globalData.classId,
                        className: app.globalData.className,
                        instituteName: app.globalData.instituteName
                    })
                }
            }
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

    },
    updateMessage() {
        console.log('refresh')
        this.setData({
            showLoading: false,
            showAll: false,
            currentPage: 1,
            total: 1
        })
        this.getMessages()
    },
    loadMoreMessage() {
        console.log('more')
        var that = this
        if (this.data.currentPage == this.data.totalPage)
            this.setData({
                showAll: true
            })
        else {
            that.setData({
                showLoading: true
            })
            wx.request({
                url: app.globalData.server + 'v2/class/messages?classId=' + that.data.classId + '&page=' + (++that.data.currentPage),
                success(res) {
                    that.setData({
                        normals: that.data.normals.concat(res.data.data)
                    })
                },
                complete() {
                    that.setData({
                        showLoading: false
                    })
                }
            })
        }
    },
    display(e) {
        var data = e.currentTarget.dataset
        wx.navigateTo({
            url: '/pages/display/display?type=' + data.type + '&item=' + encodeURIComponent(JSON.stringify(data.item))
        });
    }
});