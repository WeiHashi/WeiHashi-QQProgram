//Page Object
const app = getApp()
Page({
    data: {
        addQue: false,
        qtype: '填空',
        options: [],
        questions: [],
        none: '',
        content:''
    },
    inContent(e){
        this.setData({
            content:e.detail.value
        })
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

    },
    addQue: function () {
        this.setData({
            addQue: true
        })
    },
    qtypeChange: function (e) {
        this.setData({
            qtype: e.detail.value
        })
    },
    addOption: function () {
        var options = this.data.options
        if (options.length < 10) {
            options.push({ index: String.fromCharCode(options.length + 65), content: '' })
            this.setData({
                options: options
            })
        } else {
            wx.showToast({
                title: '选项数已达上限',
                icon: 'none'
            })
        }
    },
    queSubmit: function (e) {
        var res = e.detail.value
        if (this.data.qtype == '单选' || this.data.qtype == '多选') {
            var options = this.data.options
            for (var i = 0; i < options.length; i++) {
                if (options[i].content == '') {
                    wx.showToast({
                        title: '选项未填写完整',
                        icon: 'none'
                    })
                    return
                }
            }
            if (options.length < 2) {
                wx.showToast({
                    title: '至少要有两个选项',
                    icon: 'none'
                })
                return
            }
        } else {
            if (res.des == '') {
                wx.showToast({
                    title: '未填写完整',
                    icon: 'none'
                })
                return
            }
        }
        if (res.question == '') {
            wx.showToast({
                title: '未填写完整',
                icon: 'none'
            })
            return
        }
        var question = { question: res.question }
        if (this.data.qtype == '填空') {
            question.type = 0
            question.des = res.des
        } else {
            question.type = this.data.qtype == '单选' ? 1 : 2
            var options = []
            for (var i = 0; i < this.data.options.length; i++)
                options.push(this.data.options[i].content)
            question.des = options
        }
        var questions = this.data.questions
        questions.push(question)
        this.setData({
            questions: questions
        })
        this.setData({
            addQue: false
        })
        setTimeout(() => {
            this.setData({
                qtype: '填空',
                options: []
            })
        }, 300);
    },
    optionInput: function (e) {
        var index = e.currentTarget.dataset.index
        this.setData({
            ['options[' + index + '].content']: e.detail.value
        })
    },
    deleteOption: function (e) {
        var index = e.currentTarget.dataset.index
        var options = this.data.options
        options.splice(index, 1)
        for (var i = 0; i < options.length; i++) {
            options[i].index = String.fromCharCode(i + 65)
        }
        this.setData({
            options: options
        })
    },
    deleteQuestion(e) {
        var questions = this.data.questions
        questions.splice(e.currentTarget.dataset.index, 1)
        this.setData({
            questions: questions
        })
    },
    add(e) {
        var that = this
        var submit = e.detail.value
        var questions = this.data.questions
        if (questions.length == 0) {
            wx.showToast({
                title: '请添加问题',
                icon: 'none'
            });
            return
        }
        for (var i = 0; i < questions.length; i++)
            questions[i].id = i + 1
        var questionnaire = { title: submit.title, des: that.data.content, questions: JSON.stringify(questions) }
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
                url: app.globalData.server + 'addQuestionnaire?classId=' + app.globalData.classId + '&name=' + app.globalData.name,
                data: JSON.stringify(questionnaire),
                header: { 'content-type': 'application/json' },
                method: 'POST',
                success: () => {
                    wx.showToast({
                        title: '发布成功',
                        icon: 'none'
                    });
                    that.setData({
                        none: '',
                        questions: []
                    })
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
    }
});