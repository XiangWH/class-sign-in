// pages/createCourse/createCourse.js
var app = getApp();
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['周一', '周二', '周三', '周四','周五','周六','周日'],
    index: 0, // 默认显示位置
    courseName: '',
    startTime: '',
    inCourse: '',
    endTime: '',
    totalNumber: '',
    coursePlace: '0',
    
    courseId:'',
    tip:'',
    longitude:'',
    latitude:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    tip: ''
    console.log(app.globalData)
  },

  // 星期选择器
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  // 上课时间选择
  bindTimeChange1: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      startTime: e.detail.value
    })
  },
  // 课中签到时间选择
  bindTimeChange2: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      inCourse: e.detail.value
    })
  },
  // 下课时间选择
  bindTimeChange3: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      endTime: e.detail.value
    })
  },

  // 获取定位
  getPlace: function() {
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          latitude : res.latitude,
          longitude : res.longitude,
          coursePlace: { type: "Point", coordinates: [res.longitude, res.latitude]}
        })
        wx.showModal({
          content: '经度：' + that.data.longitude + '纬度：' + that.data.latitude,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
      }

    })
    
  },

  // 提交课程数据
  formSubmit: function(e) {
    var that = this;
    var courseData = {
      courseName: e.detail.value.courseName,
      totalNumber: parseInt(e.detail.value.totalNumber),
      
      week: this.data.array[this.data.index],
      startTime: e.detail.value.startTime,
      inCourse: e.detail.value.inCourse,
      endTime: e.detail.value.endTime,
      coursePlace: this.data.coursePlace,
      courseId: this.data.courseId
    };
    var info = {
      wxId: app.globalData.wxId,
      courseId: this.data.courseId,
      name: app.globalData.name,
      userNumber: app.globalData.userNumber
    };
    
    if (courseData.courseName != '' & courseData.startTime != '' & courseData.inCourse != '' & courseData.endTime!='' & 
      courseData.totalNumber != '' & courseData.coursePlace != '' & courseData.fullMark != '' & courseData.courseId!='')
    { // 更新教师表
      wx.BaaS.invoke('updateTeacher', info).then(res => {
        //console.log(res.data)
      }, err => {
        // err
      })

      // 创建课程
      wx.BaaS.invoke('createCourse', courseData).then(res => {
        console.log(res)
        var data = {
          tableName: res.data.data.name,
          tableId: res.data.data.id
        }
        wx.BaaS.invoke('updateTableId', data).then(res => {
          console.log(res)
        }, err => {
          // err
        })
      }, err => {
        // err
      })

      wx.showToast({
        title: '已完成',
        icon: 'success',
        duration: 2000
      });
    }
    else {
      this.setData({
        tip: '创建失败，请填写完整课程信息'
      })
    }
  },

  // 生成课程号
  createCourseId: function () {
    //console.log("courseid")
    this.data.courseId ='C'+ Math.random().toString(20).substr(2, 4)
    wx.showModal({
      content: '课程号：' + this.data.courseId,
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    });
  }

})