exports.main = function delCourse(data, callback) {
  
  let teachersTable = new BaaS.TableObject('teachers')
  let studentsTable = new BaaS.TableObject('students')
  let coursesTable = new BaaS.TableObject('courses')
  let tableId = new BaaS.TableObject('tableId')
  let tableSchema = new BaaS.TableSchema()
  
  let query1 = new BaaS.Query()
  let query2 = new BaaS.Query()
  
  query1.compare('courseId', '=', data.data.courseId)
  query2.compare('tableName','=',data.data.courseId)
  
  // 在teachers表中删除
  teachersTable.limit(10).offset(0).delete(query1 ,{enableTrigger: false}).then(res => {
  // success
  
  }, err => {
  // err
  })
  
  // 在courses表中删除
  coursesTable.limit(10).offset(0).delete(query1, {enableTrigger: false}).then(res => {
  // success
  
}, err => {
  // err
})
  
  //在students表中删除
  studentsTable.limit(10).offset(0).delete(query1 ,{enableTrigger: false}).then(res => {
  // success
  
  }, err => {
  // err
  })
  
  // 删除签到表
  tableId.setQuery(query2).find().then(res => {
    //callback(null, res)
    tableSchema.deleteSchema(res.data.objects[0].tableId).then(res=>{
    // success
    //在students表中删除
    tableId.limit(10).offset(0).delete(query2 ,{enableTrigger: false}).then(res => {
      // success
      callback(null, 'del')
      }, err => {
      // err
      })
    }).catch(e=>{
    // error
    })
  })

}