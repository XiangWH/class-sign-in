exports.main = function signIn(data, callback) {
  // 修改签到信息
  let signInTable = new BaaS.TableObject(data.data.courseId)

  let query1 = new BaaS.Query()
  let query2 = new BaaS.Query()
  let query3 = new BaaS.Query()
  let query4 = new BaaS.Query()
  let query5 = new BaaS.Query()
  query1.compare('userNumber','=',data.data.userNumber)
  query2.compare('condition','=',"出勤情况")
  query3.compare('condition','=',"课前")
  query4.compare('condition','=',"课中")
  query5.compare('condition','=',"课后")
  let andQuery1 = BaaS.Query.and(query1, query2)
  let andQuery2 = BaaS.Query.and(query1, query3)
  let andQuery3 = BaaS.Query.and(query1, query4)
  let andQuery4 = BaaS.Query.and(query1, query5)
  
  
    if(data.data.state == '课前') {
      signInTable.setQuery(andQuery2).find().then(res => {
      // success
    
        let row = signInTable.getWithoutData(res.data.objects[0].id)
    
        row.set(data.data.column, '1')
        row.update().then(res => {
          // success
          callback(null, "signIn")
        }, err => {
        // err
        })
      
      })
    }
    
    if(data.data.state == '课中') {
      signInTable.setQuery(andQuery3).find().then(res => {
      // success
    
        let row = signInTable.getWithoutData(res.data.objects[0].id)
    
        row.set(data.data.column, '1')
        row.update().then(res => {
          // success
          callback(null, "signIn")
        
        })
      
      })
    }
    
    if(data.data.state == '课后') {
      signInTable.setQuery(andQuery4).find().then(res => {
      // success
        let row = signInTable.getWithoutData(res.data.objects[0].id)
        row.set(data.data.column, '1')
        row.update().then(res => {
          // success
          // 判断出勤情况
          signInTable.setQuery(query1).select(data.data.column).find().then(res => {
            var i = 0, sum = 0;
            for(;i < res.data.objects.length;i++) {
              if (!isNaN(parseInt(res.data.objects[i][data.data.column]))) {
                sum += parseInt(res.data.objects[i][data.data.column])
              }
                
            }
            
            if(sum == 3) {
              signInTable.setQuery(andQuery1).find().then(res => {
              // success
                  let row2 = signInTable.getWithoutData(res.data.objects[0].id)
                  row2.set(data.data.column, '出勤')
                  row2.update().then(res => {
                    // success
                    callback(null, '出勤')
                  
                  })
              
              })
            }
            
            else if(sum === 0) {
              signInTable.setQuery(andQuery1).find().then(res => {
              // success
                  let row2 = signInTable.getWithoutData(res.data.objects[0].id)
                  row2.set(data.data.column, '缺勤')
                  row2.update().then(res => {
                    // success
                    callback(null, '缺勤')
                  
                  })
              
              })
            }
            
            else {
              signInTable.setQuery(andQuery1).find().then(res => {
              // success
                  let row2 = signInTable.getWithoutData(res.data.objects[0].id)
                  row2.set(data.data.column, '迟到或早退')
                  row2.update().then(res => {
                    // success
                    callback(null, '迟到或早退')
                  
                  })
              
              })
            }
            
          })

        })
      
      })
    }
}
