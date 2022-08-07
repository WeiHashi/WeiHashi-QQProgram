//Page Object
const app = getApp()
Page({
    data: {
        taskName: '',
        taskDate: '',
        nowDate: '',
        nowTime: '',
        taskTime: '',
        showAdd: false,
        remind: '不提醒',
        detailRemind: '',
        remindType: [],
        tasks: [
            // { name: 'test', taskTime: '2020-02-24 18:00:00', remind: [] },
            // { name: 'test', taskTime: '2020-02-24 18:00:00', remind: ['mail', 'push'] },
            // { name: 'test', taskTime: '2020-02-24 18:00:00', remind: [] },
            // { name: 'test', taskTime: '2020-02-24 18:00:00', remind: ['mail', 'push'] },
            // { name: 'test', taskTime: '2020-02-24 18:00:00', remind: ['mail', 'push'] },
            // { name: 'test', taskTime: '2020-02-24 18:00:00', remind: ['mail', 'push'] },
            // { name: 'test', taskTime: '2020-02-24 18:00:00', remind: ['mail', 'push'] },
            // { name: 'test', taskTime: '2020-02-24 18:00:00', remind: ['mail', 'push'] },
            // { name: 'test', taskTime: '2020-02-24 18:00:00', remind: ['mail', 'push'] },
            // { name: 'test', taskTime: '2020-02-24 18:00:00', remind: ['mail', 'push'] }
        ]
    },
    //options(Object)
    onLoad: function (options) {
        this.updateNow()
        this.setData({
            taskDate: this.data.nowDate,
            taskTime: this.data.nowTime
        })
    },
    onReady: function () {

    },
    onShow: function () {
        var that = this
        wx.getStorage({
            key: 'tasks',
            success: (result) => {
                that.setData({
                    tasks: result.data
                })
            }
        });
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
    updateNow: function () {
        var now = new Date()
        var yyyy = now.getFullYear()
        var MM = now.getMonth() + 1
        var dd = now.getDate()
        var HH = now.getHours()
        var mm = now.getMinutes()
        this.setData({
            nowDate: yyyy + '-' + MM + '-' + dd,
            nowTime: (HH < 10 ? '0' + HH : HH) + ':' + (mm < 10 ? '0' + mm : mm)
        })
    },
    date2timestamp: function (e) {
        var date = new Date(e)
        var yyyy = date.getFullYear()
        var MM = date.getMonth() + 1
        var dd = date.getDate()
        var HH = date.getHours()
        var mm = date.getMinutes()
        return {
            date: yyyy + '-' + MM + '-' + dd,
            time: (HH < 10 ? '0' + HH : HH) + ':' + (mm < 10 ? '0' + mm : mm)
        }
    },
    dateChange: function (e) {
        this.setData({
            taskDate: e.detail.value
        })
    },
    timeChange: function (e) {
        this.setData({
            taskTime: e.detail.value
        })
    },
    addTask: function () {
        this.setData({
            showAdd: true
        })
    },
    remindChange: function (e) {
        this.setData({
            remind: e.detail.value
        })
    },
    showAdd: function () {
        this.updateNow()
    },
    remindTypeChange: function (e) {
        this.setData({
            remindType: e.detail.value
        })
    },
    add: function (e) {
        var that = this
        that.updateNow()
        if (this.data.taskName == '') {
            wx.showToast({
                title: '任务名称不能为空',
                icon: 'none'
            })
            return
        }
        if (this.data.remind == '提醒' && this.data.remindType.length == 0) {
            wx.showToast({
                title: '请勾选提醒方式',
                icon: 'none'
            })
            return
        }
        if (new Date(this.data.taskDate + ' ' + this.data.taskTime + ':59').getTime() < new Date().getTime() + 1 * 60 * 1000) {
            var update = this.date2timestamp(new Date().getTime() + 1 * 60 * 1000)
            that.setData({
                taskDate: update.date,
                taskTime: update.time
            })
        }
        if (that.data.remind == '提醒') {
            if (that.data.remindType.indexOf('push') != -1 && new Date(that.data.taskDate + ' ' + that.data.taskTime).getTime() - new Date().getTime() >= 7 * 24 * 60 * 60 * 1000) {
                wx.showToast({
                    title: '推送设置时间过长',
                    icon: 'none'
                });
                return
            }
            if (that.data.remindType.indexOf('mail') != -1 && app.globalData.email == '') {
                wx.showToast({
                    title: '请先绑定邮箱',
                    icon: 'none'
                });
                return
            }
            if (that.data.remindType.indexOf('push') == -1) {
                that.saveTaskServer(true);
                that.addTaskLocal();
                return;
            }
            that.requestSubscribeMsg(true);
            return;
        }
        that.addTaskLocal();
    },
    showDetail: function (e) {
        var task = e.currentTarget.dataset.task
        var index = e.currentTarget.dataset.index
        task.updated = { index: index, name: task.name, taskTime: task.taskTime, remind: task.remind }
        this.updateNow()
        this.setData({
            showDetail: true,
            detail: task,
            detailRemind: task.remind.length != 0 ? '提醒' : '不提醒'
        })
    },
    inTaskName: function (e) {
        this.setData({
            taskName: e.detail.value
        })
    },
    detailDateChange: function (e) {
        this.setData({
            ['detail.updated.taskTime']: e.detail.value + ' ' + this.data.detail.updated.taskTime.split(' ')[1]
        })
    },
    detailTimeChange(e) {
        this.setData({
            ['detail.updated.taskTime']: this.data.detail.updated.taskTime.split(' ')[0] + ' ' + e.detail.value
        })
    },
    detailRemindChange: function (e) {
        this.setData({
            detailRemind: e.detail.value
        })
    },
    detailRemindTypeChange: function (e) {
        this.setData({
            ['detail.updated.remind']: e.detail.value
        })
    },
    inDetailName(e) {
        this.setData({
            ['detail.updated.name']: e.detail.value
        })
    },
    save: function (e) {
        var that = this
        if (this.data.detail.updated.name == '') {
            wx.showToast({
                title: '任务名称不能为空',
                icon: 'none'
            })
            return
        }
        if (this.data.detailRemind == '提醒' && this.data.detail.updated.remind.length == 0) {
            wx.showToast({
                title: '请勾选提醒方式',
                icon: 'none'
            })
            return
        }
        if (new Date(this.data.detail.updated.taskTime + ':59').getTime() < new Date().getTime() + 1 * 60 * 1000) {
            var update = this.date2timestamp(new Date().getTime() + 1 * 60 * 1000)
            that.setData({
                ['detail.updated.taskTime']: update.date + ' ' + update.time
            })
        }
        if (that.data.detailRemind == '提醒') {
            if (that.data.detail.updated.remind.indexOf('push') != -1 && new Date(that.data.detail.updated.taskTime).getTime() - new Date().getTime() >= 7 * 24 * 60 * 60 * 1000) {
                wx.showToast({
                    title: '推送设置时间过长',
                    icon: 'none'
                });
                return
            }
            if (that.data.detail.updated.remind.indexOf('mail') != -1 && app.globalData.email == '') {
                wx.showToast({
                    title: '请先绑定邮箱',
                    icon: 'none'
                });
                return
            }
            if (that.data.remindType.indexOf('push') == -1) {
                that.saveTaskServer(false);
                that.updateTaskLocal();
                return;
            }
            that.requestSubscribeMsg(false);
            return;
        }
        that.updateTaskLocal();
    },
    requestSubscribeMsg: function (isNew) {
        var that = this;
        const tplId = '4ce15fc3964bbd9583ad07761ba36ea0';
        wx.subscribeAppMsg({
            tmplIds: [tplId],
            subscribe: true,
            success(res) {
                console.log("----subscribeAppMsg----success", res);
                if (res.retCode != null || res[tplId] == null || res[tplId] == 'reject') {
                    wx.showToast({
                        title: '订阅消息失败，请重试',
                        icon: 'none'
                    })
                    return
                }
                that.saveTaskServer(isNew);
                if (isNew) {
                    that.addTaskLocal();
                } else {
                    that.updateTaskLocal();
                }
            },
            fail(res) {
                console.log("----subscribeAppMsg----fail", res);
                wx.showToast({
                    title: '订阅消息失败，请重试',
                    icon: 'none'
                })
            }
        });
    },
    addTaskLocal: function () {
        var that = this
        var final = { name: that.data.taskName, taskTime: that.data.taskDate + ' ' + that.data.taskTime, remind: that.data.remindType }
        var tasks = that.data.tasks
        tasks.unshift(final)
        that.setData({
            tasks: tasks,
            showAdd: false,
            taskName: ''
        })
        wx.setStorage({
            key: 'tasks',
            data: tasks
        });
    },
    updateTaskLocal: function () {
        var tasks = this.data.tasks
        tasks.splice(this.data.detail.updated.index, 1)
        tasks.unshift(this.data.detail.updated)
        this.setData({
            showDetail: false,
            tasks: tasks
        })
        wx.setStorage({
            key: 'tasks',
            data: tasks
        });
    },
    saveTaskServer: function (isNew) {
        var that = this;
        wx.request({
            url: app.globalData.server + 'addTask',
            data: {
                openid: app.globalData.openid,
                detail: isNew ? that.data.taskName : that.data.detail.updated.name,
                timestamp: new Date(isNew ? (that.data.taskDate + ' ' + that.data.taskTime) : that.data.detail.updated.taskTime).getTime(),
                push: (isNew ? that.data.remindType : that.data.detail.updated.remind).indexOf('push') != -1,
                mail: (isNew ? that.data.remindType : that.data.detail.updated.remind).indexOf('mail') != -1
            },
            method: 'POST',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
    },
    detailDelete: function () {
        var that = this
        wx.showModal({
            content: '是否删除？',
            success: (result) => {
                if (result.confirm) {
                    var tasks = that.data.tasks
                    tasks.splice(that.data.detail.updated.index, 1)
                    that.setData({
                        tasks: tasks,
                        showDetail: false
                    })
                    wx.setStorage({
                        key: 'tasks',
                        data: tasks
                    });
                }
            }
        });
    }
});