exports.main = function exitCourse(data, callback) {
  
  let studentsTable = new BaaS.TableObject('students')
  let signInTable = new BaaS.TableObject(data.data.courseId)
  
  let query1 = new BaaS.Query()
  let query2 = new BaaS.Query()
  let query3 = new BaaS.Query()
  
  query1.compare('courseId', '=', data.data.courseId)
  query2.compare('wxId', '=', data.data.wxId)
  query3.compare('userNumber', '=', data.data.userNumber)
  let andQuery = BaaS.Query.and(query1, query2)
  
  
  // 从students表中删除
  studentsTable.limit(10).offset(0).delete(andQuery ,{enableTrigger: false}).then(res => {
  // success
    // 从签到表中删除
    signInTable.limit(10).offset(0).delete(query3 ,{enableTrigger: false}).then(res => {
    // success
      callback(null, "exitCourse")
    }, err => {
    // err
    })
  }, err => {
  // err
  })

  
}
