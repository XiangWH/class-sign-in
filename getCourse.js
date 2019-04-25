/*jshint loopfunc: true*/

exports.main = function getCourse(info, callback) {
  
  let teachersTable = new BaaS.TableObject('teachers')
  let studentsTable = new BaaS.TableObject('students')
  let coursesTable = new BaaS.TableObject('courses')
  
  let query1 = new BaaS.Query()
  let query2 = new BaaS.Query()
  
  query1.compare('wxId', '=', info.data.wxId)
  
  if (info.data.identity == '1') {
    teachersTable.setQuery(query1).select('courseId').find().then(res => {
      var arr = []
      for (let i in res.data.objects) {
        
        arr.push(res.data.objects[i].courseId)
      }
      query2.in('courseId', arr)
      coursesTable.setQuery(query2).find().then(res2 => {
        callback(null, res2.data.objects)
      })
    })
      
  }
  
  if (info.data.identity == '2') {
    studentsTable.setQuery(query1).select('courseId').find().then(res => {
      var arr = []
      for (let i in res.data.objects) {
        
        arr.push(res.data.objects[i].courseId)
      }
      query2.in('courseId', arr)
      coursesTable.setQuery(query2).find().then(res2 => {
        callback(null, res2.data.objects)
      })
    })
      
  }
}