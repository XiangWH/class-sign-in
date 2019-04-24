//app.js
App({
  onLaunch: function() {
    let that = this
    // 引入 知晓云 小程序SDK
    require('./utils/sdk-wechat.2.0.5-a')
    let clientId = this.globalData.clientId
    wx.BaaS.init(clientId)
    
    // 用户登录模块
    wx.BaaS.auth.loginWithWechat().then(user => {
      // 登录成功
      console.log(user)
      // 获取微信号
      
      that.globalData.wxId = user.openid
      // 判断是否已注册
      //console.log(that.globalData.wxId)
      that.isRegister(user.openid)

    }, err => {
      // 登录失败
    })
    
    
  },

  // 判断是否已注册
  isRegister: function (wxId) {
    console.log(wxId)
    var that = this
    // 应用查询对象
    let Product = new wx.BaaS.TableObject('users')
    let Product2 = new wx.BaaS.TableObject('teachers')
    let Product3 = new wx.BaaS.TableObject('students')
    let query = new wx.BaaS.Query()
    query.compare('wxId','=',wxId)

    Product.setQuery(query).find().then(res => {      
      console.log(res)
      if (res.data.meta.total_count == 0) {
        // 未找到用户，添加新用户，并跳转至注册页面
        this.addUser(wxId)
        wx.redirectTo({
          url: '../register/register',
        })
      }
      else {
        // 找到用户，检查身份并跳转至相应页面

        that.globalData.identity = res.data.objects[0].identity
        that.globalData.name = res.data.objects[0].name
        that.globalData.userNumber = res.data.objects[0].userNumber
        that.jumpto(that.globalData.wxId)
           
      }
    }, err => {
     
    })
  },


  // 跳转
  jumpto:function(wxId) {
    var that = this

    if (that.globalData.identity == "1") {

      wx.redirectTo({
        url: '/pages/teacher/teacher',
      })
    }
    else if (that.globalData.identity == "2") {

      wx.redirectTo({
        url: '/pages/student/student',
      })
    }
    else {
      wx.redirectTo({
        url: '/pages/register/register',
      })
    }
  },

  // 添加新用户
  addUser: function (wxId) {
    let MyTableObject = new wx.BaaS.TableObject('users')
    let create = MyTableObject.create()
    let newUser = {
      wxId: wxId,
      identity: "0"
    }
    create.set(newUser).save().then(res => {
      // success
      console.log("添加成功")
    }, err => {
      //err 为 HError 对象
    })
  },

  globalData: {
    wxId:'',
    clientId: '7cd9015148869653331f', // 从 BaaS 后台获取 ClientID
    usersTableId: 70080, // 从 https://cloud.minapp.com/dashboard/ 管理后台的数据表中获取
    identity: '',
    name: '',
    userNumber: ''

  }
})
