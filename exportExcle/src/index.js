var Excel = require('exceljs');
module.exports = function (data, callback) {

    // 单元格风格
    var fills = {
        solid: {type: "pattern", pattern:"solid", fgColor:{argb:"FFFFAAAA"}}
    };
    // 实例化工作表
    var workbook = new Excel.Workbook();
    
    // 添加字段
    var worksheet1 = workbook.addWorksheet(data.data.courseId);
    var header = []
    for (let temp in data.data.objects[0]) {
        if (temp != 'write_perm' && temp != 'read_perm') header.push(temp);
    }
    worksheet1.addRow(header);

    // 添加数据
    var rowInfo = []
    for (var i = 0; i <= data.data.count; i++) {
        var rowInfo = []
        for (let j in data.data.objects[i]) {
            if (j != 'write_perm' && j != 'read_perm') rowInfo.push(data.data.objects[i][j]);
        }
        worksheet1.addRow(rowInfo);
    }

    //设置　start-end　行单元格水平垂直居中/添加边框
    function rowCenter(arg_ws, arg_start, arg_end) {
        for(i = arg_start; i <= arg_end; i++) {
            arg_ws.findRow(i).alignment = { vertical: 'middle', horizontal: 'center' };
            //循环 row 中的　cell，给每个 cell添加边框
            arg_ws.findRow(i).eachCell(function (cell, index) {
                cell.border = {
                    top: {style:'thin'},
                    left: {style:'thin'},
                    bottom: {style:'thin'},
                    right: {style:'thin'}
                };
            })
 
        }
    }
 
//设置　start-end 列的宽度
    function colWidth(arg_ws, arg_cols, arg_width) {
        for(i in arg_cols) {
            arg_ws.getColumn(arg_cols[i]).width = arg_width;
        }
    }

    // 上传excle表到知晓云文件
    //var fileName = data.data.courseId + '.xlsx'
    
    workbook.xlsx.writeFile('/var/log/test.xlsx')
    .then(function(){
        
        let MyFile = new BaaS.File()
        MyFile.upload('/var/log/test.xlsx').then(res => {
            callback(null, res.data.file_link)
        })
    });

    
}
 