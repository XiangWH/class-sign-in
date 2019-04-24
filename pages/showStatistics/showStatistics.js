// pages/showStatistics/showStatistics.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statisticsData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.getStatistics(options)
  },

  getStatistics: function (options) {
    var courseId = options.type
    wx.BaaS.invoke('showStatistics', courseId).then(res => {
      console.log(res)
      var that = this;
      if (res.code === 0) {
        // success
        var statistics = [];
        var count = 0;
        for (let i in res.data.objects) {
          for (let j in res.data.objects[i]) {
            if (res.data.objects[i][j] == '出勤') count++;
          }
          
          var temp = {
            userNumber: res.data.objects[i].userNumber,
            name: res.data.objects[i].name,
            count: count,
            rate: Number(count/options.type2*100).toFixed()+'%'
          };
          statistics.push(temp);
        }

        that.setData({
          statisticsData: statistics
        })

        console.log(that.data.statisticsData)

      } else {
        // fail
      }
    }, err => {
      // HError 对象
    })
  },
  
})