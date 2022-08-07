//Page Object
const app = getApp()
Page({
    data: {
        showUpdate: false,
        data: [],
        cookieString: '',
        gpa: '-',
        terms:[],
        toView:''
    },
    //options(Object)
    onLoad: function (options) {
        var that = this
        wx.getStorage({
            key: 'grades',
            success: (result) => {
                that.setData({
                    data: result.data.list,
                    gpa: result.data.gpa
                })
                var terms=[];
                if(that.data.data.length!=0){
                    that.data.data.forEach(function(item){
                        let term=item.term
                        if(terms.indexOf(term)==-1){
                            terms.push(term)
                        }
                    })
                }
                that.setData({
                    terms:terms
                })
            }
        });
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

    },
    updateGrade() {
        var that = this
        if (app.globalData.name == '') {
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
        } else
            wx.getStorage({
                key: 'cookies',
                success: (result) => {
                    wx.showLoading({
                        title: '正在获取数据'
                    });
                    wx.request({
                        url: app.globalData.server + 'grade',
                        data: {
                            cookieString: result.data
                        },
                        success: res => {
                            if (res.data.code == 10004) {
                                wx.setStorage({
                                    key: 'grades',
                                    data: res.data.data
                                });
                                this.setData({
                                    data: res.data.data.list,
                                    gpa:res.data.data.gpa
                                })
                                wx.showToast({
                                    title: '获取成功'
                                });
                            } else if (res.data.code == 40000) {
                                that.getData()
                            } else
                                wx.showToast({
                                    title: '请求失败，请重试',
                                    icon: 'none'
                                });
                        },
                        fail() {
                            wx.showToast({
                                title: '请求失败,请重试',
                                icon: 'none'
                            });
                        }
                    })
                },
                fail: () => {
                    wx.showToast({
                        title: '请求失败,请重试',
                        icon: 'none'
                    });
                },
            });
    },
    getData() {
        var that = this
        wx.showLoading({
            title: '正在获取数据',
        });
        wx.request({
            url: app.globalData.server + 'login',
            data: {
                openid: app.globalData.openid,
                username: app.globalData.jw_username,
                password: app.globalData.jw_password,
            },
            method: 'POST',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: res => {
                if (res.data.code == 40001) {
                    that.setData({
                        cookieString: res.data.data.cookies
                    })
                    wx.setStorage({
                        key: 'cookies',
                        data: res.data.data.cookies
                    });
                    wx.request({
                        url: app.globalData.server + 'grade',
                        data: {
                            cookieString: that.data.cookieString
                        },
                        success: res => {
                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none'
                            });
                            if (res.data.code == 10004) {
                                wx.setStorage({
                                    key: 'grades',
                                    data: res.data.data
                                });
                                this.setData({
                                    data: res.data.data.list,
                                    gpa:res.data.data.gpa
                                })
                                wx.showToast({
                                    title: '获取成功'
                                });
                            }
                        },
                        fail() {
                            wx.showToast({
                                title: '获取失败',
                                icon: 'none'
                            });
                        },
                        complete() {
                            wx.hideLoading();
                            that.setData({
                                showUpdate: false
                            })
                        }
                    })
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    });
                }
            },
            fail() {
                wx.showToast({
                    title: '获取失败',
                    icon: 'none'
                });

            }
        });
    },
    filterData(e){
        let num=e.detail.value
        this.setData({
            toView:'t'+this.data.terms[num]
        })
    }
});