// pages/teacher.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coursesOfTeacher: [],
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.getCourse();
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getCourse();
  },

  // 
  open: function (e) {
    var courseId = e.currentTarget.dataset.id;
    var totalNumber = e.currentTarget.dataset.id2;
    wx.showActionSheet({
      itemList: ['修改课程信息', '查看签到统计', '导出签到记录','删除课程'],
      success: function (res) {
        if (!res.cancel) {
          console.log(res.tapIndex)

          if (res.tapIndex == 0) {
              wx.navigateTo({
                url: '../changeCourse/changeCourse?type=' + courseId,
              })
          }
          if (res.tapIndex == 1) {
            wx.navigateTo({
              url: '../showStatistics/showStatistics?type=' + courseId +'&type2='+totalNumber,
            })
          }
          if (res.tapIndex == 2) {       
            let query = new wx.BaaS.Query()
            let signInTable = new wx.BaaS.TableObject(courseId)
            // 获取相应签到表数据
            signInTable.select(['-created_at', '-created_by','-_id', '-updated_at', '-id']).find().then(res => {
              // 调用云函数，传入签到表数据，生成签到表
              var signInInfo = {
                count: res.data.meta.total_count,
                objects: res.data.objects,
                courseId: courseId
              }
              wx.BaaS.invoke('exportExcle', signInInfo).then(res => {
                
                if (res.code === 0) {
                  
                  // 下载文件并打开
                  console.log(res.data)
                  wx.showToast({
                    title: '下载中',
                    icon: 'loading',
                    duration: 2000
                  })
                  wx.downloadFile({
                    url: res.data, 
                    
                    success(res) {
                      
                      if (res.statusCode === 200) {
                        var filePath = res.tempFilePath;
                        
                        wx.openDocument({
                          filePath: filePath,
                          success: function (res) {
                            console.log('打开文档成功')
                          },
                          fail: function (res) {
                            console.log(res);
                          },
                          complete: function (res) {
                            console.log(res);
                          }
                        })

                      }
                    }
                  })
                }
              })
            }, err => {
                // err
            })
          }


          if (res.tapIndex == 3) {
            var data = {
              courseId: courseId
            }
            wx.BaaS.invoke('delCourse', data).then(res => {
              console.log(res)
              if (res.code === 0) {
                // success
                wx.showToast({
                  title: '已完成',
                  icon: 'success',
                  duration: 2000
                });
              } else {
                // fail
                
              }
            }, err => {
              // HError 对象
            })
          }
        }
      }
    })
  },

  // 创建课程
  createCourse: function () {
    wx.navigateTo({
      url: '../createCourse/createCourse',
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
    wx.BaaS.invoke('getCourse', info).then(res => {
      
      if (res.code === 0) {
        // success
        var courses = [];
        for (let i in res.data) {
          var temp = {
            courseId: res.data[i].courseId,
            courseName: res.data[i].courseName,
            startTime: res.data[i].startTime,
            inCourse: res.data[i].inCourse,
            endTime: res.data[i].endTime,
            week: res.data[i].week,
            totalNumber: res.data[i].totalNumber,
            
          };
          courses.push(temp);
        }
        
        that.setData({
          coursesOfTeacher: courses
        })

        console.log(that.data.coursesOfTeacher)
        
      } else {
        // fail
        
      }
    }, err => {
      // HError 对象

    })
    

  },

})