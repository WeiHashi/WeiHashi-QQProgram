//Page Object
const app = getApp()
Page({
    data: {

    },
    clear() {
        wx.showActionSheet({
            itemList: ['清除课程数据', '清除成绩数据', '清除任务数据'],
            success: (result) => {
                wx.showModal({
                    content: '确认清除？',
                    success: (res) => {
                        if (res.confirm) {
                            try {
                                switch (result.tapIndex) {
                                    case 0:
                                        wx.removeStorageSync('weekTotal');
                                        wx.removeStorageSync('lessons');
                                        break
                                    case 1:
                                        wx.removeStorageSync('grades');
                                        break
                                    case 2:
                                        wx.removeStorageSync('tasks');
                                        break
                                }
                                wx.showToast({
                                    title: '已清除',
                                    icon: 'none'
                                });
                            } catch (e) {
                                wx.showToast({
                                    title: '清除失败',
                                    icon: 'none'
                                });
                            }
                        }
                    }
                });
            }
        });
    },
    clearAll() {
        wx.showModal({
            content: '确认清除？',
            success: (result) => {
                if (result.confirm) {
                    wx.request({
                        url: app.globalData.server + 'clearInfo?openid=' + app.globalData.openid,
                        method:'PUT',
                        success() {
                            wx.clearStorage();
                            app.globalData.name=''
                            app.globalData.studentid=''
                            app.globalData.email=''
                            app.globalData.jw_username=''
                            app.globalData.jw_password=''
                            wx.showToast({
                                title: '清除成功',
                                icon: 'none'
                            });
                        },
                        fail() {
                            wx.showToast({
                                title: '清除失败',
                                icon: 'none'
                            });
                        }
                    })
                }
            }
        });
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