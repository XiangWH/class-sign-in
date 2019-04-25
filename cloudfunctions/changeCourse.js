exports.main = function changeCourse(courseData, callback) {
  
  let coursesTable = new BaaS.TableObject('courses')
  
  // 设置查询条件
  let query1 = new BaaS.Query()
  query1.compare('courseId', '=',  courseData.data.courseId)
  
  // 更新数据信息
  coursesTable.setQuery(query1).find().then(res => {
    // success
    
    let coursesRow = coursesTable.getWithoutData(res.data.objects[0].id)
    
    coursesRow.set(courseData.data)
    coursesRow.update().then(res => {
    // success
    callback(null, "changeCourse")
    }, err => {
    // err
    })
    
  }, err => {
  // err
  })
  
}
