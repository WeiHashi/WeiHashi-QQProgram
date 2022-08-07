//Page Object
const app = getApp()
Page({
    data: {
        functions: [
            { icon: 'jw', text: '绑定教务平台', page: 'bindJw' },
            { icon: 'email', text: '绑定邮箱' },
            { icon: 'feedback', text: '问题反馈', page: 'feedback' },
            { icon: 'share', text: '分享微哈师', page: 'share' },
            { icon: 'setting', text: '设置', page: 'settings/settings' },
            { icon: 'info', text: '关于', page: 'about/about' },
            { icon: 'privacy',text:'隐私说明',page:'privacy/privacy'}
        ],
        head: '/images/user_placeholder.png',
        nickname: '未登录',
        showBind: false,
        showMail: false,
        submit: { username: '', password: '', code: '' },
        name: '未绑定',
        studentid:'',
        email: '',
        mailAddr: '',
        mailCode: '',
        leftTime: 0,
        className: ''
    },
    navigate: function (e) {
        var icon = e.currentTarget.dataset.item.icon
        var page = e.currentTarget.dataset.item.page
        if (icon == 'setting' || icon == 'info'|| icon=='privacy')
            wx.navigateTo({
                url: '/pages/' + page
            });
        if (icon == 'jw') {
            if(app.globalData.jw_username!=''){
            wx.showLoading({
                title: '正在检测账号有效性',
                mask: true
            });
            wx.request({
                url: app.globalData.server + 'login',
                data: {
                    openid: app.globalData.openid,
                    username: app.globalData.jw_username,
                    password: app.globalData.jw_password
                },
                method: 'POST',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: (res) => {
                    if (res.data.code!=40001){
                        wx.showToast({
                            title: '账号失效，请重新登录',
                            icon: 'none',
                            mask:true
                        });
                        wx.removeStorageSync('jw_username')
                        wx.removeStorageSync('jw_password')
                        wx.removeStorageSync('name')
                        wx.removeStorageSync('cookies')
                        app.globalData.jw_username=''
                        app.globalData.jw_password=''
                        app.globalData.name=''
                        this.setData({
                            cookieString:'',
                            name:'未绑定'
                        })
                    }else{
                        wx.setStorage({
                            key: 'cookies',
                            data: res.data.data.cookies
                        });
                        this.setData({
                            cookieString:res.data.data.cookies
                        })
                    }
                    this.setData({
                        showBind: true
                    })
                },
                fail: () => {
                    wx.showToast({
                        title: '检测失败，请重试',
                        icon: 'none',
                        mask:true
                    });
                },complete(){
                    wx.hideLoading()
                }
            })
        }else{
            this.setData({
                showBind: true
            })
        }
        } if (icon == 'email')
            this.setData({
                showMail: true
            })
    },
    onBindShow: function () { },
    bindSubmit: function (e) {
        var that = this
        var submit = e.detail.value
        if (submit.username == '' || submit.password == '') {
            wx.showToast({
                title: '未填写完整',
                icon: 'none'
            });
        } else {
            wx.showLoading({
                title: '绑定中……'
            });
            wx.request({
                url: app.globalData.server + 'login',
                data: {
                    openid: app.globalData.openid,
                    username: submit.username,
                    password: submit.password
                },
                method: 'POST',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: res => {
                    if (res.data.code == 40001) {
                        app.globalData.name = res.data.data.name
                        app.globalData.jw_username = submit.username
                        app.globalData.jw_password = submit.password
                        wx.setStorage({
                            key: 'name',
                            data: res.data.data.name
                        });
                        wx.setStorage({
                            key: 'jw_username',
                            data: submit.username
                        });
                        wx.setStorage({
                            key: 'jw_password',
                            data: submit.password
                        });
                        wx.setStorage({
                            key: 'cookies',
                            data: res.data.data.cookies
                        });
                        that.setData({
                            name: res.data.data.name == '' ? '未绑定' : res.data.data.name,
                            showBind: false
                        })
                        wx.showToast({
                            title: '绑定成功',
                            icon: 'none'
                        });
                    } else {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none'
                        });
                    }
                },
                fail() {
                    wx.showToast({
                        title: '绑定失败',
                        icon: 'none'
                    });
                },
                complete() {
                    wx.hideLoading();
                }
            })
        }
    },
    unbindJw(){
        var that=this
        wx.showModal({
            content: '解绑将同时清除所有数据（包括课程数据和成绩数据等），是否继续？',
            success: (result) => {
                if(result.confirm){
                    wx.request({
                        url: app.globalData.server + 'clearInfo?openid=' + app.globalData.openid,
                        method:'PUT',
                        success() {
                            wx.clearStorage();
                            app.globalData.name=''
                            app.globalData.email=''
                            app.globalData.jw_username=''
                            app.globalData.jw_password=''
                            that.setData({
                                name:'未绑定'
                            })
                            wx.showToast({
                                title: '解绑成功',
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
    onMailShow() {
        this.setData({
            mailAddr: '',
            mailCode: ''
        })
    },
    inMailAddr(e) {
        this.setData({
            mailAddr: e.detail.value
        })
    },
    inMailCode(e) {
        this.setData({
            mailCode: e.detail.value
        })
    },
    getMailCode() {
        var that = this
        if (that.data.leftTime == 0) {
            if (that.data.mailAddr == '') {
                wx.showToast({
                    title: '邮箱地址不能为空',
                    icon: 'none'
                });
                return
            }
            if (that.data.mailAddr.split("@").length == 1 || that.data.mailAddr.split(".").length == 1) {
                wx.showToast({
                    title: '邮箱地址不合法',
                    icon: 'none'
                });
                return
            }
            wx.showLoading({
                title: '正在获取'
            })
            wx.request({
                url: app.globalData.server + 'getEmailCode',
                data: {
                    openid: app.globalData.openid,
                    email: that.data.mailAddr
                },
                success: (result) => {
                    wx.showToast({
                        title: result.data.msg,
                        icon: 'none'
                    });
                    if (result.data.code == 10004) {
                        this.setData({
                            leftTime: 59
                        })
                        var wait = setInterval(() => {
                            that.setData({
                                leftTime: that.data.leftTime - 1
                            })
                            if (that.data.leftTime == 0)
                                clearInterval(wait)
                        }, 1000);
                    }
                },
                fail: () => {
                    wx.showToast({
                        title: '获取失败',
                        icon: 'none'
                    });
                }
            });
        }
    },
    bindMail() {
        var that = this
        if (this.data.mailAddr == '' || this.data.mailCode == '') {
            wx.showToast({
                title: '未填写完整',
                icon: 'none'
            });
            return
        }
        if (that.data.mailAddr.split("@").length == 1 || that.data.mailAddr.split(".").length == 1) {
            wx.showToast({
                title: '邮箱地址不合法',
                icon: 'none'
            });
            return
        }
        wx.request({
            url: app.globalData.server + 'bindEmail',
            data: {
                openid: app.globalData.openid,
                email: that.data.mailAddr,
                code: that.data.mailCode
            },
            method: 'POST',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success(res) {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                });
                if (res.data.code == 10005) {
                    that.setData({
                        email: that.data.mailAddr,
                        showMail: false
                    })
                    app.globalData.email = that.data.mailAddr
                }
            }
        })
    },
    unbindMail() {
        var that = this
        wx.showModal({
            content: '是否解绑？',
            success: (result) => {
                if (result.confirm) {
                    wx.request({
                        url: app.globalData.server + 'unbindMail',
                        data: {
                            openid: app.globalData.openid
                        },
                        method: 'POST',
                        header: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        success() {
                            wx.showToast({
                                title: '已解绑',
                                icon: 'none'
                            });
                            that.setData({
                                email: ''
                            })
                            app.globalData.email = ''
                        },
                        fail() {
                            wx.showToast({
                                title: '解绑失败',
                                icon: 'none'
                            })
                        }
                    })
                }
            }
        });

    },
    //options(Object)
    onLoad: function (options) {
        if (this.data.nickname == '')
            app.getUserInfo()
        this.setData({
            nickname: app.globalData.nickname,
            head: app.globalData.headUrl
        })
        if (app.globalData.className != '') {
            this.setData({
                className: app.globalData.className
            })
        }
    },
    onReady: function () {

    },
    onShow: function () {
        wx.showShareMenu({
            showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
        })
        this.setData({
            name: app.globalData.name == '' ? '未绑定' : app.globalData.name,
            studentid:app.globalData.jw_username,
            email: app.globalData.email
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