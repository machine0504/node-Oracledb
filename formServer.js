var http = require('http');
var querystring = require('querystring');
var oracledb = require('oracledb');
oracledb.autoCommit=true;
var multiparty = require('multiparty');
var form = new multiparty.Form();//解析formData里面数据的模块
var server = http.createServer(function (request, response) {
    var data;
    //非formData的表单提交
    // requset.on('data',function(a){
    // 	data = querystring.parse(decodeURIComponent(a));
    // 	console.log('数据：',data);
    // })
    //formData的表单提交
    form.parse(request, function (err, a) {
        console.log(a.monitor[0]);
        console.log(a.assister[0]);
        //console.log(typeof(a.monitor[0]))
        console.log('ss')
        data = a;
        oracledb.getConnection(
            config,
            function (err, connection) {
                if (err) {
                    console.error(err.message);
                    return;
                }
                //查询某表十条数据测试，注意替换你的表名
                //   var addSe='insert into gis_guanai(g_monitor,g_assister) values (?,?)'
                //   var addData=[params.g_monitor,params.g_assister]
                //var sql='select * from test'
                //'insert into gis_guanai(g_monitor,g_assister) values (袁飞,缪代旭)',
                connection.execute("INSERT INTO GIS_GUANAI(G_MONITOR,G_ASSISTER) VALUES ('"+a.monitor[0]+"','"+a.assister[0]+"')",
                    function (err, result) {
                        if (err) {
                            console.error(err.message);
                            doRelease(connection);
                            return;
                        }
                        // //打印返回的表结构
                        // console.log(result.metaData);
                        // //打印返回的行数据
                        // console.log(result.rows);
                        console.log('插入数据成功');
                        doRelease(connection);
                    });
            });
        function doRelease(connection) {
            connection.release(
                function (err) {
                    if (err) {
                        console.error(err.message);
                    }
                });
        }
    })
    request.on('end', function (a) {
        console.log('接收数据完成!');
        //connect(data)
        //console.log(data)
        response.end(JSON.stringify({ statua: 200, msg: '请求成功', data: { data } }));
    })
    response.setHeader('Access-Control-Allow-Origin', '*');  //解决跨域问题
    response.writeHead(200, { 'Content-Type': 'application/json;chatset=utf-8' })
}).listen(8080, '127.0.0.1')// api接口：www.test.com:8080
//建立数据库连接
var config = {
    user: 'accm',　　//用户名
    password: 'accm2013',　　//密码
    //IP:数据库IP地址，PORT:数据库端口，SCHEMA:数据库名称
    connectString: "10.244.125.39:1521/wms"
};

