exports.main = function showStatistics2(data, callback) {
  
  let signInTable = new BaaS.TableObject(data.data.courseId)
  let query1 = new BaaS.Query()
  let query2 = new BaaS.Query()
  query1.compare('userNumber','=',data.data.userNumber)
  query2.compare('condition','=',"出勤情况")
  let andQuery = BaaS.Query.and(query1, query2)
  signInTable.setQuery(andQuery).find().then(res => {
    callback(null, res.data)
  })
  
}