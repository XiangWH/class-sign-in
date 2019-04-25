exports.main = function register(registerData, callback) {
  // 获取数据表
  let usersTable = new BaaS.TableObject('users')
  
  // 设置查询条件
  query1 = new BaaS.Query()
  query1.compare('wxId', '=',  registerData.data.wxId)
  
  // 更新users表
  usersTable.setQuery(query1).find().then(res => {
    // success
    
    let usersRow = usersTable.getWithoutData(res.data.objects[0].id)
    
    usersRow.set({
      identity : registerData.data.identity,
      userNumber : registerData.data.userNumber,
      name : registerData.data.name
    })
    usersRow.update().then(res => {
      if (registerData.data.identity == "1") {
        callback(null, 1)
      }
      if (registerData.data.identity == "2") {
        callback(null, 2)
      }
    }, err => {
    // err
    })
  

  
    
  }, err => {
  // err
  })

  
}