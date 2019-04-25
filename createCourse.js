exports.main = function createCourse(courseData, callback) {
  
  let coursesTable = new BaaS.TableObject('courses')
  
  let create = coursesTable.create()
    
  create.set(courseData.data).save().then(res => {
      // success
      
    }, err => {
      //err 为 HError 对象
  })
    
  // 生成签到表
  let tableSchema = new BaaS.TableSchema()
  
  var schemaInfo = {
    "name": courseData.data.courseId,
     "schema": {
      "fields": [
              { name: 'userNumber', type: 'string' },
              { name: 'name', type: 'string' },
              { name: 'condition', type: 'string' }
            ]

          },
          row_read_perm: ['user:*'],
          row_write_perm: ['user:*'],
          write_perm: ['user:*']
  }
  
  tableSchema.createSchema(schemaInfo).then(res=>{
  // success
  callback(null, res)
}).catch(e=>{
  // error
})  
}