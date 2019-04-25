exports.main = function joinCourse(data, callback) {
  
  let coursesTable = new BaaS.TableObject('courses')
  let studentsTable = new BaaS.TableObject('students')
  let signInTable = new BaaS.TableObject(data.data.courseId)
  let create1 = studentsTable.create()
  let create2 = signInTable.create()
  
  let query1 = new BaaS.Query()
  let query2 = new BaaS.Query()
  
  query1.compare('courseId', '=', data.data.courseId)
  query2.compare('wxId', '=', data.data.wxId)
  let andQuery = BaaS.Query.and(query1, query2)
  
  var info1 = {
    name: data.data.name,
    userNumber: data.data.userNumber,
    condition: "课前"
  }
  
  var info2 = {
    name: data.data.name,
    userNumber: data.data.userNumber,
    condition: "课中"
  }
  
  var info3 = {
    name: data.data.name,
    userNumber: data.data.userNumber,
    condition: "课后"
  }
  
  var info4 = {
    name: data.data.name,
    userNumber: data.data.userNumber,
    condition: "出勤情况"
  }
  
  // 查找课程是否存在
  coursesTable.setQuery(query1).find().then(res => {
    if (res.data.meta.total_count !== 0) { // 课程存在
      // 更新students表
  studentsTable.setQuery(andQuery).find().then(res => {
    if (res.data.meta.total_count === 0) { // 
      create1.set(data.data).save().then(res => {
      // 更新签到表
      create2.set(info1).save().then(res => {
      
        create2.set(info2).save().then(res => {
        
          create2.set(info3).save().then(res => {
          
            create2.set(info4).save().then(res => {
            
            callback(null,'joinCourse')
      }, err => {
      //err 为 HError 对象
  })
      }, err => {
      //err 为 HError 对象
  })
      }, err => {
      //err 为 HError 对象
  })
      }, err => {
      //err 为 HError 对象
  })
      }, err => {
      //err 为 HError 对象
      })
    }
  })
    }
    else {
      callback(null,'课程不存在')
    }
  })
  
}
