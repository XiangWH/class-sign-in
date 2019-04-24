// pages/register.js

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

    formSubmit: function (e) {
      var that = this
      var id = app.globalData.wxId;
      //注册数据
      var registerData = {
        wxId: id,
        userNumber: e.detail.value.userNumber,
        name: e.detail.value.name,
        identity: e.detail.value.identity
      }
      
      app.globalData.identity = e.detail.value.identity
      app.globalData.name = e.detail.value.name
      app.globalData.userNumber = e.detail.value.userNumber
      console.log(registerData)
      wx.BaaS.invoke('register', registerData).then(res => {
        console.log(res)
        if (res.code === 0) {
          // success
          if(res.data == 1) {
            wx.redirectTo({
              url: '../teacher/teacher',
            })
          }
          else {
            wx.redirectTo({
              url: '../student/student',
            })
          }
        } else {
          // fail
          console.log(res.error.message)
        }
      }, err => {
        // HError 对象
        
      })
    },

  

})
