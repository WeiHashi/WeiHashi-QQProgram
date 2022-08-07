//Page Object
const app = getApp()
Page({
    data: {
        banners: [
            { url: '/images/banner_placeholder.png' }
        ],
        bannerCur: 0,
        functions: [
            { img: 'kcb', text: '课程表', page: 'timetable/timetable' },
            { img: 'cj', text: '成绩', page: 'grade/grade' },
            { img: 'xiaoli', text: '校历', page: 'xiaoli/xiaoli' },
            { img: 'task', text: '任务清单', page: 'task/task' }
        ],
        today: [],
        weekTotal: -1,
        showTip: false,
        maintenance: false,
        maintenanceStart: '',
        maintenanceEnd: ''
    },
    bannerTap(e) {
        var item = e.currentTarget.dataset.item
        if (item.type == 0)
            return;
        wx.showLoading({
            title: '加载中……',
            mask: true
        });
        wx.request({
            url: app.globalData.server + 'getBannerContent?type=' + item.type + '&objId=' + item.content_id,
            success(res) {
                if (res.data.code == 10004) {
                    var content = res.data.data
                    if (item.type == 2) {
                        var tmp = {}
                        tmp.cate = content.title
                        tmp.detail = content.questions
                        tmp.obj_id = content.obj_id
                        tmp.sender = content.sender
                        tmp.receiver = content.receiver
                        tmp.source = 2
                        tmp.timestamp = content.timestamp
                        tmp.title = content.des
                        tmp.top_level = content.top_level
                        tmp.type = content.type
                        content = tmp
                    }
                    wx.hideLoading();
                    wx.navigateTo({
                        url: '/pages/display/display?type=' + item.type + '&item=' + encodeURIComponent(JSON.stringify(content))
                    });
                } else {
                    wx.showToast({
                        title: '加载失败',
                        icon: 'none'
                    });
                }
            },
            fail() {
                wx.showToast({
                    title: '加载失败',
                    icon: 'none'
                });
            }
        })
    },
    closeTip() {
        this.setData({
            showTip: false
        })
        wx.setStorage({
            key: 'showTip',
            data: false
        });
    },
    //options(Object)
    onLoad: function (options) {
        var that = this
        const sStart = app.globalData.maintenanceStart
        const sEnd = app.globalData.maintenanceEnd
        const start = new Date(sStart).getTime();
        const end = new Date(sEnd).getTime();
        const now = new Date().getTime()
        if (now >= start && now < end) {
            wx.hideTabBar({ anim: false });
            that.setData({
                maintenance: true,
                maintenanceStart: sStart,
                maintenanceEnd: sEnd
            })
            return
        }
        if (app.globalData.loading)
            wx.showLoading({
                title: '加载中……',
                mask: true
            });
        wx.getStorage({
            key: 'showTip',
            success: (result) => {
                that.setData({
                    showTip: result.data
                })
            },
            fail: () => {
                that.setData({
                    showTip: true
                })
            }
        });
    },
    onReady: function () {

    },
    onShow: function () {
        var that = this
        if(app.globalData.jw_username=='2018020676'){
            that.setData({
                functions: [
                    { img: 'kcb', text: '课程表', page: 'timetable/timetable' },
                    { img: 'cj', text: '成绩', page: 'grade/grade' },
                    { img: 'xiaoli', text: '校历', page: 'xiaoli/xiaoli' },
                    { img: 'class', text:'班级', page:'class/class'},
                    { img: 'task', text: '任务清单', page: 'task/task' }
                ]
            })
        }
        wx.getStorage({
            key: 'weekTotal',
            success: (result) => {
                that.setData({
                    weekTotal: result.data
                })
                var weekTotal = result.data
                if (weekTotal != -1) {
                    var currentWeek = that.getCurrentWeek().index
                    var weekTemplet = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
                    var startTemplet = ['', '8:10', '9:05', '10:10', '11:05', '13:15', '14:10', '15:05', '16:00', '16:55', '17:50', '18:45', '19:40']
                    var endTemplet = ['', '8:55', '9:50', '10:55', '11:50', '14:00', '14:55', '15:50', '16:45', '17:40', '18:35', '19:30', '20:25']
                    if (currentWeek != -1) {
                        console.log(currentWeek)
                        wx.getStorage({
                            key: 'lessons',
                            success: (result) => {
                                var lessons = result.data
                                var today = []
                                for (var i = 0; i < lessons.length; i++) {
                                    var lesson = lessons[i]
                                    for (var j = 0; j < lesson.parts.length; j++) {
                                        var part = lesson.parts[j]
                                        for (var k = 0; k < part.weeks.length; k++) {
                                            var week = part.weeks[k]
                                            var weekday = weekTemplet[new Date().getDay()]
                                            if (currentWeek == week && part.weekday == weekday) {
                                                today.push({ name: lesson.name,start:part.start, time: startTemplet[part.start] + '-' + endTemplet[part.end], place: part.place })
                                            }
                                        }
                                    }
                                }
                                var compare = function (obj1, obj2) {
                                    var val1 = obj1.start;
                                    var val2 = obj2.start;
                                    if (val1 < val2) {
                                        return -1;
                                    } else if (val1 > val2) {
                                        return 1;
                                    } else {
                                        return 0;
                                    }            
                                }                                 
                                that.setData({
                                    today: today.sort(compare)
                                })
                            }
                        });
                    }
                }
            }
        });
        wx.request({
            url: app.globalData.server + 'getBanner',
            success: res => {
                that.setData({
                    banners: res.data.data
                })
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
    bannerChange: function (e) {
        this.setData({
            bannerCur: e.detail.current
        })
    },
    getWeekList: function () {
        var startDate = new Date(app.globalData.termStart.replace(/-/g,'/'))
        var weekTotal = this.data.weekTotal
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
    toTimetable(){
        wx.navigateTo({
            url: '/pages/timetable/timetable'
        });
    }
});