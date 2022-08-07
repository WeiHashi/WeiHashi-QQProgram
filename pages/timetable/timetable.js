//Page Object
const app = getApp();

Page({
    data: {
        orders: [{
            order: 1,
            start: "8:10",
            end: "8:55"
        }, {
            order: 2,
            start: "9:05",
            end: "9:50"
        }, {
            order: 3,
            start: "10:10",
            end: "10:55"
        }, {
            order: 4,
            start: "11:05",
            end: "11:50"
        }, {
            order: 5,
            start: "13:15",
            end: "14:00"
        }, {
            order: 6,
            start: "14:10",
            end: "14:55"
        }, {
            order: 7,
            start: "15:05",
            end: "15:50"
        }, {
            order: 8,
            start: "16:00",
            end: "16:45"
        }, {
            order: 9,
            start: "16:55",
            end: "17:40"
        }, {
            order: 10,
            start: "17:50",
            end: "18:35"
        }, {
            order: 11,
            start: "18:45",
            end: "19:30"
        }, {
            order: 12,
            start: "19:40",
            end: "20:25"
        },],
        showImport: false,
        weekIndex: 0,
        weeks: [],
        weekChecks: [],
        showAdd: false,
        partIndex: [0, 0, 0],
        prePartIndex: [0, 0, 0],
        parts: [
            ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        ],
        weekTemplet: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
        currentWeek: '暂无数据',
        weekStart: '',
        lessons: [],
        showDetail: false,
        lessonDetail: { lessonItem: {}, partItem: {}, weekItem: 0 },
        cookieString: ''
    },
    getWeekList: function () {
        var startDate = new Date(app.globalData.termStart)
        var weekTotal = this.data.weeks.length
        var weekList = []
        for (var i = 0; i < weekTotal; i++) {
            var end = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000 + 23 * 60 * 60 * 1000 + 59 * 60 * 1000 + 59 * 1000 + 999)
            weekList.push({ index: i + 1, start: startDate })
            startDate = new Date(end.getTime() + 1)
        }
        return weekList
    },
    getCurrentWeek: function () {
        var now = new Date()
        var weekList = this.getWeekList()
        for (var i = 0; i < weekList.length; i++) {
            var week = weekList[i]
            if ((now.getTime() > week.start.getTime()) && (now.getTime() < week.start.getTime() + 6 * 24 * 60 * 60 * 1000 + 23 * 60 * 60 * 1000 + 59 * 60 * 1000 + 59 * 1000 + 999))
                return week
        }
        var oneDayLong = 24 * 60 * 60 * 1000;
        var c_time = now.getTime();
        var c_day = now.getDay() || 7;
        var m_time = c_time - (c_day - 1) * oneDayLong;
        var monday = new Date(m_time);
        return { index: -1, start: monday }
    },
    updateData(total) {
        var that = this
        var weeks = []
        var weekChecks = []
        for (var i = 1; i <= total; i++) {
            weeks.push(i)
            weekChecks.push(false)
        }
        that.setData({
            weeks: weeks,
            weekChecks: weekChecks
        })
        var currentWeek = that.getCurrentWeek()
        var index = currentWeek.index
        var start = currentWeek.start
        that.setData({
            weekIndex: index - 1,
            currentWeek: index == -1 ? '假期中' : ('第' + (index) + '周'),
            weekStart: app.date2Timestamp(start)
        })
    },
    //options(Object)
    onLoad: function (options) {
        this.setData({
            capTop: app.globalData.capTop,
            capHeight: app.globalData.capHeight
        })
    },
    onReady: function () {

    },
    onShow: function () {
        var that = this
        var now = new Date()
        var oneDayLong = 24 * 60 * 60 * 1000;
        var c_time = now.getTime();
        var c_day = now.getDay() || 7;
        var m_time = c_time - (c_day - 1) * oneDayLong;
        var monday = new Date(m_time)
        that.setData({
            weekStart: app.date2Timestamp(monday)
        })
        wx.getStorage({
            key: 'weekTotal',
            success: (result) => {
                var total = result.data
                this.updateData(total)
            }
        });
        wx.getStorage({
            key: 'lessons',
            success: (result) => {
                this.setData({
                    lessons: result.data
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
    import: function () {
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
            this.doImport()
    },
    lessonDetail: function (e) {
        this.setData({
            lessonDetail: {
                lessonItem: e.currentTarget.dataset.lessonitem,
                partItem: e.currentTarget.dataset.partitem,
                weekItem: e.currentTarget.dataset.weekitem
            },
            showDetail: true
        })
    },
    doImport() {
        var that = this
        wx.showLoading({
            title: '正在获取数据',
        })
        wx.getStorage({
            key: 'cookies',
            success: (result) => {
                that.setData({
                    cookieString: result.data
                })
                wx.request({
                    url: app.globalData.server + 'getDailyLessons',
                    data: {
                        cookieString: that.data.cookieString
                    },
                    success(res) {
                        if (res.data.code != 40000)
                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none'
                            });
                        if (res.data.code == 10004) {
                            wx.setStorage({
                                key: 'weekTotal',
                                data: res.data.data.weekTotal
                            });
                            wx.setStorage({
                                key: 'lessons',
                                data: res.data.data.lessons
                            });
                            that.updateData(res.data.data.weekTotal)
                            that.setData({
                                lessons: res.data.data.lessons,
                                showImport: false
                            })
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
                            title: '请求失败，请重试',
                            icon: 'none'
                        });
                    },
                    complete() {
                        wx.hideLoading()
                    }
                })
            },
            fail() {
                wx.showToast({
                    title: '请求失败，请重试',
                    icon: 'none'
                });
            }
        });
    },
    getData() {
        var that = this
        wx.showLoading({
            title: '正在获取数据',
        })
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
                        url: app.globalData.server + 'getDailyLessons',
                        data: {
                            cookieString: that.data.cookieString
                        },
                        success(res) {
                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none'
                            });
                            if (res.data.code == 10004) {
                                wx.setStorage({
                                    key: 'weekTotal',
                                    data: res.data.data.weekTotal
                                });
                                wx.setStorage({
                                    key: 'lessons',
                                    data: res.data.data.lessons
                                });
                                that.updateData(res.data.data.weekTotal)
                                that.setData({
                                    lessons: res.data.data.lessons,
                                    showImport: false
                                })
                            }
                        },
                        fail() {
                            wx.showToast({
                                title: '获取失败',
                                icon: 'none'
                            });
                        },
                        complete() {
                            wx.hideLoading()
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
                    title: '初始化失败',
                    icon: 'none'
                });
            },
            complete() {
                wx.hideLoading()
            }
        })
    },
    chooseWeek: function (e) {
        var that = this
        this.setData({
            weekIndex: e.detail.value
        })
        that.setData({
            currentWeek: '第' + that.data.weeks[that.data.weekIndex] + '周'
        })
        var ws = that.getWeekStart(that.data.weeks[that.data.weekIndex])
        var weekStart = app.date2Timestamp(ws)
        that.setData({
            weekStart: weekStart
        })
    },
    getWeekStart(index) {
        var weekList = this.getWeekList()
        for (var i = 0; i < weekList.length; i++) {
            var week = weekList[i]
            if (week.index == index)
                return week.start
        }
    },
    add: function () {
        var that = this
        if (this.data.weekChecks.length != 0)
            wx.showActionSheet({
                itemList: ['手动添加课程', '更新课程块颜色'],
                success: (result) => {
                    if (result.tapIndex == 0) {
                        that.setData({
                            showAdd: true
                        })
                    }
                    if (result.tapIndex == 1) {
                        var all = that.data.lessons
                        var bgs = []
                        for (var i = 0; i < all.length; i++) {
                            bgs.push(all[i].bg)
                        }
                        for (var i = 0; i < all.length; i++) {
                            var newBg = app.createBg(bgs)
                            all[i].bg = newBg
                            bgs[i] = newBg
                        }
                        that.setData({
                            lessons: all
                        })
                        wx.setStorage({
                            key: 'lessons',
                            data: all
                        });
                    }
                }
            });
        else
            wx.showToast({
                title: '请先导入教务数据',
                icon: 'none'
            });
    },
    partChange: function (e) {
        this.setData({
            partIndex: this.data.prePartIndex
        })
    },
    partColumnChange: function (e) {
        this.setData({
            ['prePartIndex[' + e.detail.column + ']']: e.detail.value
        })
        if (this.data.prePartIndex[1] > this.data.prePartIndex[2]) {
            this.setData({
                ['prePartIndex[2]']: this.data.prePartIndex[1]
            })
        }
    },
    addWeekChange: function (e) {
        var checked = e.detail.value
        for (var i = 0; i < 18; i++) {
            this.setData({
                ['weekChecks[' + i + ']']: checked.indexOf(i + '') > -1
            })
        }
    },
    addSubmit: function (e) {
        var that = this
        var submit = e.detail.value
        var weekChecks = this.data.weekChecks
        console.log(submit)
        if (submit.lessonName == '') {
            wx.showToast({
                title: '请输入课程名',
                icon: 'none'
            });
            return
        }
        var weeks = []
        for (var i = 0; i < weekChecks.length; i++)
            if (weekChecks[i]) weeks.push(i + 1)
        if (weeks.length == 0) {
            wx.showToast({
                title: '请选择教学周',
                icon: 'none'
            });
            return
        }
        var lesson = {
            name: submit.lessonName,
            teacher: submit.lessonTeacher,
            bg: '',
            parts: [
                {
                    weekday: that.data.weekTemplet[submit.lessonPart[0]],
                    start: that.data.parts[1][submit.lessonPart[1]],
                    end: that.data.parts[2][submit.lessonPart[2]],
                    place: submit.lessonPlace,
                    weeks: weeks
                },
            ]
        }
        if (that.hasSameLesson(lesson) != -1) {
            wx.showModal({
                content: '检测到相同课程，新添加的课程将被合并到相同课程，是否继续？',
                success: (result) => {
                    if (result.confirm) {
                        if (that.timeConflict(lesson)) {
                            wx.showModal({
                                content: '检测到时间冲突，冲突部分将不被添加，是否继续？',
                                success: (result) => {
                                    if (result.confirm) {
                                        that.doAdd(lesson)
                                    }
                                }
                            });
                        } else {
                            that.doAdd(lesson)
                        }
                    }
                }
            });
        } else {
            if (that.timeConflict(lesson)) {
                wx.showModal({
                    content: '检测到时间冲突，冲突部分将不被添加，是否继续？',
                    success: (result) => {
                        if (result.confirm) {
                            that.doAdd(lesson)
                        }
                    }
                });
            } else {
                that.doAdd(lesson)
            }
        }
    },
    doAdd(lesson) {
        var that = this
        that.addLesson(lesson)
        wx.showToast({
            title: '添加完成'
        });
        console.log(this.data.lessons)
        wx.setStorage({
            key: 'lessons',
            data: that.data.lessons
        });
        that.setData({
            showAdd: false
        })
    },
    hasSameLesson(lesson) {
        var all = this.data.lessons
        for (var i = 0; i < all.length; i++) {
            var item = all[i]
            if (lesson.name == item.name && lesson.teacher == item.teacher)
                return i
        }
        return -1
    },
    timeConflict(lesson) {
        var all = this.data.lessons
        for (var i = 0; i < all.length; i++) {
            var lessonItem = all[i]
            for (var j = 0; j < lessonItem.parts.length; j++) {
                var partItem = lessonItem.parts[j]
                for (var k = 0; k < partItem.weeks.length; k++) {
                    var weekItem = partItem.weeks[k]
                    var lessonPart = lesson.parts[0]
                    if (lessonPart.weekday == partItem.weekday && !(lessonPart.end < partItem.start || lessonPart.start > partItem.end) && lesson.parts[0].weeks.indexOf(weekItem) > -1)
                        return true
                }
            }
        }
        return false
    },
    addLesson(lesson) {
        var that = this
        var all = that.data.lessons
        var hasSameLesson = that.hasSameLesson(lesson)
        var part = lesson.parts[0]
        var weeks = part.weeks
        var bgs = []
        for (i = 0; i < all.length; i++)
            bgs.push(all[i].bg)
        lesson.bg = app.createBg(bgs)
        for (var i = 0; i < all.length; i++) {
            var lessonItem = all[i]
            for (var j = 0; j < lessonItem.parts.length; j++) {
                var partItem = lessonItem.parts[j]
                for (var k = 0; k < partItem.weeks.length; k++) {
                    var weekItem = partItem.weeks[k]
                    var lessonPart = lesson.parts[0]
                    if (lessonPart.weekday == partItem.weekday && !(lessonPart.end < partItem.start || lessonPart.start > partItem.end) && lessonPart.weeks.indexOf(weekItem) > -1) {
                        lesson.parts[0].weeks.splice(lessonPart.weeks.indexOf(weekItem))
                    }
                }
            }
        }
        if (lesson.parts[0].weeks == 0)
            return
        if (hasSameLesson != -1) {
            var lessonParts = all[hasSameLesson].parts
            for (var i = 0; i < lessonParts.length; i++) {
                var lessonPart = lessonParts[i]
                if (part.weekday == lessonPart.weekday && part.start == lessonPart.start && part.end == lessonPart.end) {
                    var lessonWeeks = lessonPart.weeks
                    for (var j = 0; j < weeks.length; j++) {
                        if (lessonWeeks.indexOf(weeks[j]) == -1) {
                            lessonWeeks.push(weeks[j])
                        }
                    }
                    that.setData({
                        lessons: all
                    })
                    return
                }
            }
            lessonParts.push(part)
            that.setData({
                lessons: all
            })
            return
        }
        all.push(lesson)
        that.setData({
            lessons: all
        })
    },
    back: function () {
        wx.navigateBack();
    },
    singleWeek() {
        var weekChecks = this.data.weekChecks
        for (var i = 0; i < weekChecks.length; i++)
            weekChecks[i] = (i % 2 == 0)
        this.setData({
            weekChecks: weekChecks
        })
    },
    multiWeek() {
        var weekChecks = this.data.weekChecks
        for (var i = 0; i < weekChecks.length; i++)
            weekChecks[i] = (i % 2 != 0)
        this.setData({
            weekChecks: weekChecks
        })
    },
    allWeek() {
        var weekChecks = this.data.weekChecks
        for (var i = 0; i < weekChecks.length; i++)
            weekChecks[i] = true
        this.setData({
            weekChecks: weekChecks
        })
    },
    deleteThis() {
        var that = this
        wx.showModal({
            content: '是否删除',
            confirmText: '删除',
            confirmColor: '#ff0000',
            success: (result) => {
                if (result.confirm) {
                    that.doDeleteThis()
                }
                that.setData({
                    showDetail: false
                })
            }
        });
    },
    deletePart() {
        var that = this
        wx.showModal({
            content: '是否删除',
            confirmText: '删除',
            confirmColor: '#ff0000',
            success: (result) => {
                if (result.confirm) {
                    that.doDeletePart()
                }
                that.setData({
                    showDetail: false
                })
            }
        });
    },
    deleteLesson() {
        var that = this
        wx.showModal({
            content: '是否删除',
            confirmText: '删除',
            confirmColor: '#ff0000',
            success: (result) => {
                if (result.confirm) {
                    that.doDeleteLesson()
                }
                that.setData({
                    showDetail: false
                })
            }
        });
    },
    doDeleteThis() {
        var detail = this.data.lessonDetail
        detail.partItem.weeks.splice(detail.partItem.weeks.indexOf(detail.weekItem), 1)
        if (detail.partItem.weeks.length == 0)
            this.doDeletePart()
        else {
            for (var i = 0; i < detail.lessonItem.parts.length; i++) {
                var part = detail.lessonItem.parts[i]
                var partItem = detail.partItem
                if (part.weekday == partItem.weekday && part.start == partItem.start && part.end == partItem.end)
                    detail.lessonItem.parts[i] = detail.partItem
            }
            this.saveChange(detail)
        }
    },
    doDeletePart() {
        var detail = this.data.lessonDetail
        detail.lessonItem.parts.splice(detail.lessonItem.parts.indexOf(detail.partItem), 1)
        if (detail.lessonItem.parts.length == 0) {
            this.doDeleteLesson()
        } else {
            this.saveChange(detail)
        }
    },
    doDeleteLesson() {
        var that = this
        var all = this.data.lessons
        var lessonItem = this.data.lessonDetail.lessonItem
        for (var i = 0; i < all.length; i++) {
            var lesson = all[i]
            if (lessonItem.name == lesson.name && lessonItem.teacher == lesson.teacher) {
                all.splice(all.indexOf(lesson), 1)
            }
        }
        this.setData({
            lessons: all,
            showDetail: false
        })
        console.log(this.data.lessons)
        wx.setStorage({
            key: 'lessons',
            data: that.data.lessons
        });
    },
    saveChange(detail) {
        var that = this
        var all = this.data.lessons
        for (var i = 0; i < all.length; i++) {
            var lesson = all[i]
            var lessonItem = detail.lessonItem
            if (lesson.name == lessonItem.name && lesson.teacher == lessonItem.teacher)
                all[i] = detail.lessonItem
        }
        this.setData({
            lessons: all,
            showDetail: false
        })
        console.log(this.data.lessons)
        wx.setStorage({
            key: 'lessons',
            data: that.data.lessons
        });
    }
});