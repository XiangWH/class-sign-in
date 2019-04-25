exports.main = function showStatistics(data, callback) {
  
  let signInTable = new BaaS.TableObject(data.data)
  let query = new BaaS.Query()
  query.compare('condition','=',"出勤情况")
  
  signInTable.setQuery(query).find().then(res => {
    callback(null, res.data)
  })
  
}