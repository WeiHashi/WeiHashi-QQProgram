//Page Object
const app = getApp()
Page({
    data: {
        cates: ['课程通知', '考试通知', '放假通知', '其他通知'],
        cateIndex: 0,
        none: '',
        content: ''
    },
    inContent(e) {
        this.setData({
            content: e.detail.value
        })
    },
    cateChange(e) {
        this.setData({
            cateIndex: e.detail.value
        })
    },
    submit(e) {
        var submit = e.detail.value
        var des = []
        var content = this.data.content.split('\n')
        console.log(content)
        for (var i in content)
            des.push({ type: 1, content: content[i] })
        console.log(des)
        if (app.globalData.name == '')
            wx.showModal({
                title: '未绑定教务平台',
                content: '是否现在绑定？',
                success(res) {
                    if (res.confirm)
                        wx.switchTab({
                            url: '/pages/user/user'
                        });
                }
            })
        else {
            wx.request({
                url: app.globalData.server + 'addNotice?classId=' + app.globalData.classId + '&name=' + app.globalData.name,
                data: JSON.stringify({
                    title: submit.title,
                    detail: JSON.stringify(des),
                    content: '',
                    cate: parseInt(submit.cate) + 1
                }),
                header: { 'content-type': 'application/json' },
                method: 'POST',
                success: () => {
                    wx.showToast({
                        title: '发布成功',
                        icon: 'none'
                    });
                    setTimeout(() => {
                        wx.navigateBack();
                    }, 1500);
                },
                fail: () => {
                    wx.showToast({
                        title: '发布失败',
                        icon: 'none'
                    });
                }
            });
        }
    },
    //options(Object)
    onLoad: function (options) {

    },
    onReady: function () {

    },
    onShow: function () {

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