// pages/teacher.js
var app = getApp()
var getWeek = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coursesOfStudent:[],
    longitude : 0,
    latitude : 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCourse();
    this.getPlace();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getCourse();
    this.getPlace();
  },

  //
  open: function (e) {
    var that = this
    var courseId = e.currentTarget.dataset.id;
    var totalNumber = e.currentTarget.dataset.id2;
    var userNumber = e.currentTarget.dataset.id3;
    wx.showActionSheet({
      itemList: ['查看签到统计', '签到','退出课程'],
      success: function (res) {
        if (!res.cancel) {

          if (res.tapIndex == 0) {
            wx.navigateTo({
              url: '../showStatistics2/showStatistics2?type=' + courseId + '&type2=' + totalNumber + '&type3=' + userNumber,
            })
          }
          if (res.tapIndex == 1) {
            var data = {
              courseId: courseId
            }
            that.signIn(data);
          }
          if (res.tapIndex == 2) {
            var data = {
              wxId:app.globalData.wxId,
              courseId: courseId,
              userNumber: app.globalData.userNumber
            }
            wx.BaaS.invoke('exitCourse', data).then(res => {
              console.log(res)
              
            }, err => {
              // HError 对象
            })
          }

        }
      }
    })
  },


  // 获取课程列表
  getCourse: function () {
    var that = this;
    var identity = app.globalData.identity;
    var id = app.globalData.wxId;
    
    
    // 
    var info = {
      wxId: id,
      identity: identity
    }
    console.log(info)
    wx.BaaS.invoke('getCourse', info).then(res => {

      if (res.code === 0) {
        // success
        console.log(res)
        var courses = [];
        for (let i in res.data) {
          var temp = {
            courseId: res.data[i].courseId,
            courseName: res.data[i].courseName,
            startTime: res.data[i].startTime,
            inCourse: res.data[i].inCourse,
            endTime: res.data[i].endTime,
            week: res.data[i].week,
            coursePlace: res.data[i].coursePlace,
            totalNumber: res.data[i].totalNumber,
            userNumber: app.globalData.userNumber
          };
          courses.push(temp);
        }

        that.setData({
          coursesOfStudent: courses
        })

        console.log(that.data.coursesOfStudent)

      } else {
        // fail

      }
    }, err => {
      // HError 对象

    })


  },

  // 加入课程
  formSubmit: function (e) {
    var that = this
    
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    // 
    var data = {
      wxId: app.globalData.wxId,
      courseId: e.detail.value.courseId,
      name: app.globalData.name,
      userNumber: app.globalData.userNumber
    }
    
    wx.BaaS.invoke('joinCourse', data).then(res => {
      console.log(res)
      if (res.data == '课程不存在') {
        wx.showToast({
          title: '课程不存在',
          icon: 'none',
          duration: 2000
        });
      } 
    }, err => {
      // HError 对象
      
    })
  },

  // 签到
  signIn: function(data) {
    var that = this
    var startTime = ''
    var inCourse = ''
    var endTime = ''
    var week = ''
    var coursePlace
    var courses = that.data.coursesOfStudent

    // 获取课程签到信息
    for (var i in courses) {
      if(courses[i].courseId == data.courseId) {
        startTime = courses[i].startTime,
        inCourse = courses[i].inCourse,
        endTime = courses[i].endTime,
        week = courses[i].week,
        coursePlace = courses[i].coursePlace
      }
    }
    
    // 
    
    // 获取当前星期和时间
    let nowDate = getWeek.formatDate(new Date());
    let nowWeek = getWeek.getDates(1, nowDate.date);
    console.log(nowDate)
    
    if (nowWeek[0].week == week) {
     if (that.checkPlace(coursePlace)) {
      if (that.checkTime(startTime, nowDate)) {
        var columnData = {
          courseId: data.courseId,
          column: 'date' + nowDate.date.substr(5, 2) + '_' + nowDate.date.substr(8, 2),
        }
        wx.BaaS.invoke('createColumn', columnData).then(res => {
          console.log(res)
          
          });
        var data1 = {
          courseId : data.courseId,
          column: 'date' + nowDate.date.substr(5, 2) + '_' + nowDate.date.substr(8, 2),
          userNumber: app.globalData.userNumber,
          state : '课前'
        }
        wx.BaaS.invoke('signIn', data1).then(res => {
          console.log(res)
          wx.showToast({
            title: '已完成',
            icon: 'success',
            duration: 2000
          });

        }, err => {
          // HError 对象
        })
      }
      else if (that.checkTime(inCourse, nowDate)) {
        var columnData = {
          courseId: data.courseId,
          column: 'date' + nowDate.date.substr(5, 2) + '_' + nowDate.date.substr(8, 2),
        }
        wx.BaaS.invoke('createColumn', columnData).then(res => {
          console.log(res)

        });
        var data2 = {
          courseId: data.courseId,
          column: 'date' + nowDate.date.substr(5, 2) + '_' + nowDate.date.substr(8, 2),
          userNumber: app.globalData.userNumber,
          state: '课中'
        }
        wx.BaaS.invoke('signIn', data2).then(res => {
          console.log(res)
          wx.showToast({
            title: '已完成',
            icon: 'success',
            duration: 2000
          });
        }, err => {
          // HError 对象
        })
      }
      else if (this.checkTime(endTime, nowDate)) {
        var columnData = {
          courseId: data.courseId,
          column: 'date' + nowDate.date.substr(5, 2) + '_' + nowDate.date.substr(8, 2),
        }
        wx.BaaS.invoke('createColumn', columnData).then(res => {
          console.log(res)

        });
        var data3 = {
          courseId: data.courseId,
          column: 'date' + nowDate.date.substr(5, 2) + '_' + nowDate.date.substr(8, 2),
          userNumber: app.globalData.userNumber,
          state: '课后'
        }
        wx.BaaS.invoke('signIn', data3).then(res => {
          console.log(res)
          wx.showToast({
            title: '已完成',
            icon: 'success',
            duration: 2000
          });
        }, err => {
          // HError 对象
        })
      }
      else {
        wx.showModal({
          content: '未到签到时间',
          showCancel: false,
          success: function (res) {

          }
        });
      }
     } 
     else {
       wx.showModal({
         content: '不在上课地点附近',
         showCancel: false,
         success: function (res) {

         }
       });
     } 
    }
    else {
      wx.showModal({
        content: '不是今日的课程',
        showCancel: false,
        success: function (res) {
          
        }
      });
    }
    
  },

  // 检查签到时间
  checkTime: function (time, nowDate) {    
    var hour = parseInt(time.substr(0, 2))   
    var minute = parseInt(time.substr(3, 2))
    //console.log(nowDate)
    if (minute<55) {
      if(nowDate.hour == hour) {       
        if (nowDate.minute >= minute) {
          if (nowDate.minute <= minute + 5) {
            return true;
          }
        }
      }
      return false;
    }
    else {
      if (nowDate.hour == hour) {
        if (nowDate.minute >= minute) {
          if (nowDate.minute <= minute + 5) {
            return true;
          }
        }
      }
      if (nowDate.hour === hour + 1) {
        if (nowDate.minute >= 0) {
          if (nowDate.minute <= minute - 55) {
            return true;
          }
        }
      }
      return false;
    }
  },

  // 获取定位
  getPlace: function () {
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,          
        })        
      }
    })
  },

  // 检查定位是否相近
  checkPlace: function(coursePlace) {
    var that = this;
    var a = Math.abs(that.data.longitude - coursePlace.coordinates[0].toFixed(5))
    var b = Math.abs(that.data.latitude - coursePlace.coordinates[1].toFixed(5))
    if (a < 0.0005) {
      if (b < 0.0005) {
        return true;
      }
    }
    return false;

  }

})