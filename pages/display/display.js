//Page Object
const app = getApp()
Page({
    data: {
        title: '',
        sender: '',
        timestamp: '',
        content: [],
        classId: '',
        className: '',
        questions: [],
        objId: '',
        savedAnswer: {},
        savedObjId: '',
        imgs:[]
    },
    //options(Object)
    onLoad: function (options) {
        var item = JSON.parse(decodeURIComponent(options.item))
        switch (parseInt(options.type)) {
            case 1:
                this.displayNotice(item)
                break
            case 2:
                this.displayQuestionnaire(item)
                break
        }
    },
    displayNotice(notice) {
        var that = this
        var content = JSON.parse(notice.detail)
        var screenWidth = wx.getSystemInfoSync().windowWidth;
        wx.showLoading({
            title: '加载中'
        });
        var imgInfos = []
        var imgs=[]
        for (var i in content) {
            var item = content[i]
            if (item.type == 2) {
                imgs.push(item.content)
                imgInfos.push(new Promise((resolve, reject) => {
                    wx.getImageInfo({
                        src: item.content,
                        success: (result) => {
                            resolve(result)
                        },
                        fail: () => {
                            resolve(null)
                        }
                    });
                }))
            }else{
                imgInfos.push(new Promise((resolve, reject)=>{
                    resolve(null)
                }))
            }
        }
        that.setData({
            imgs:imgs
        })
        Promise.all(imgInfos).then((res) => {
            for (var i in res) {
                if (res[i] != null) {
                    if (res[i].width > screenWidth - 40) {
                        content[i].w = screenWidth - 40
                        content[i].h = res[i].height * ((screenWidth - 40) / res[i].width)
                    } else {
                        content[i].w = res[i].width
                        content[i].h = res[i].height
                    }
                }
            }
            wx.hideLoading();
            that.setData({
                content: content
            })
        })
        this.setData({
            title: notice.title,
            sender: notice.sender,
            timestamp: notice.timestamp
        })
        qq.createIntersectionObserver().relativeToViewport({ bottom: 100 }).observe('.title', (res) => {
            if (res.intersectionRect.height == 0) {
                wx.setNavigationBarTitle({
                    title: notice.title
                });
            } else {
                wx.setNavigationBarTitle({
                    title: '通知详情'
                });
            }
        })
    },
    displayQuestionnaire(item) {
        var that = this
        console.log(item)
        wx.showLoading({
            title: '加载中……'
        })
        wx.request({
            url: app.globalData.server + 'getSavedCollection',
            data: {
                openid: app.globalData.openid,
                qid: item.obj_id
            },
            success(res) {
                console.log(res)
                if (res.data.code == 10004) {
                    that.setData({
                        savedAnswer: JSON.parse(res.data.data.content),
                        savedObjId: res.data.data.obj_id
                    })
                    console.log(that.data.savedAnswer)
                }
            },
            complete() {
                wx.hideLoading();
            }
        })
        var desArr = item.title.split('\n')
        var des = []
        for (var i in desArr) {
            des.push({ type: 1, content: desArr[i] })
        }
        this.setData({
            title: item.title,
            sender: item.sender,
            timestamp: item.timestamp,
            content: des,
            questions: JSON.parse(item.questions),
            objId: item.obj_id
        })
        qq.createIntersectionObserver().relativeToViewport({ bottom: 100 }).observe('.title', (res) => {
            if (res.intersectionRect.height == 0) {
                wx.setNavigationBarTitle({
                    title: item.title
                });
            } else {
                wx.setNavigationBarTitle({
                    title: '问卷详情'
                });
            }
        })
    },
    qSubmit(e) {
        console.log(e)
        var that = this
        var submit = e.detail.value
        wx.showLoading({
            title: '正在提交'
        });
        if (that.data.savedObjId != '')
            wx.request({
                url: app.globalData.server + 'coverCollection?objId=' + that.data.savedObjId + '&content=' + encodeURIComponent(JSON.stringify(submit)),
                method: 'PUT',
                success() {
                    wx.showModal({
                        content: '提交成功',
                        showCancel: false,
                        success: (result) => {
                            if (result.confirm) {
                                wx.navigateBack();
                            }
                        }
                    });
                },
                fail() {
                    wx.showToast({
                        title: '提交失败',
                        icon: 'none'
                    });
                },
                complete() {
                    wx.hideLoading();
                }
            })
        else
            wx.request({
                url: app.globalData.server + 'submitQuestionnaire',
                data: JSON.stringify({
                    questionnaire_id: that.data.objId,
                    openid: app.globalData.openid,
                    content: JSON.stringify(submit)
                }),
                method: 'POST',
                success() {
                    wx.hideLoading();
                    wx.showModal({
                        content: '提交成功',
                        showCancel: false,
                        success: (result) => {
                            if (result.confirm) {
                                wx.navigateBack();
                            }
                        }
                    });
                },
                fail() {
                    wx.showToast({
                        title: '提交失败',
                        icon: 'none'
                    });
                },
                complete() {
                    wx.hideLoading();
                }
            })
    },
    imageError(e) {
        this.setData({
            ['content[' + e.currentTarget.dataset.index + '].content']: '/images/banner_placeholder.png'
        })
    },
    preview(e) {
        if (e.currentTarget.dataset.src != '/images/banner_placeholder.png')
            wx.previewImage({
                urls: this.data.imgs,
                current:e.currentTarget.dataset.src
            });
    },
    onReady: function () {

    },
    onShow: function () {
        this.setData({
            classId: app.globalData.classId,
            className: app.globalData.className
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