exports.main = function updateTeacher(info, callback) {
  
  let teachersTable = new BaaS.TableObject('teachers')
  
  
  let create = teachersTable.create()
    
    create.set(info.data).save().then(res => {
      // success
      callback(null, "updateTeacher")
    }, err => {
      //err 为 HError 对象
    })
    
}