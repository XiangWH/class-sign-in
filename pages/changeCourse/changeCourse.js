// pages/changeCourse/changeCourse.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    index: 0, // 默认显示位置
    courseName: '',
    startTime: '',
    inCourse: '',
    endTime: '',
    courseId: '',
    tip:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      courseId: options.type
    })
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
  getPlace: function () {
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          coursePlace: { type: "Point", coordinates: [res.longitude, res.latitude] }
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
  submit: function (e) {
    var that = this;
    var courseData = {
      courseName: e.detail.value.courseName,  
      week: this.data.array[this.data.index],
      startTime: e.detail.value.startTime,
      inCourse: e.detail.value.inCourse,
      endTime: e.detail.value.endTime,
      coursePlace: this.data.coursePlace,
      courseId: this.data.courseId
    };
    
    if (courseData.courseName != '' & courseData.startTime != '' & courseData.inCourse != '' & courseData.endTime != '' & courseData.coursePlace != '') { 
      // 修改课程信息
      wx.BaaS.invoke('changeCourse', courseData).then(res => {
        console.log(res)
        wx.showToast({
          title: '已完成',
          icon: 'success',
          duration: 2000
        });
      }, err => {
        // err
      })
    
  }
    else {
    this.setData({
      tip: '修改失败，请填写完整课程信息'
    })
    }
  },


})