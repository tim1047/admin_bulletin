// routeConfig.js
// setting mysql connection
var mysql = require('mysql');

var pool = mysql.createPool({
	host:'localhost',
	user:'feople',
	password:'1234',
	database:'project'
});

// constructor
function routeConfig(app){
	this.app = app;
	this.route();
}

// prototype init function
routeConfig.prototype.route = function(){
	var self = this;
    
    // URL : /getList
    // Method : GET
    // API for getting all records of table
	self.app.get('/getList', function(req, res){
		pool.getConnection(function(err,conn){
			var sql = "SELECT * FROM bulletin ORDER BY number DESC";
			
			conn.query(sql,function(err,result){
				if(err){
					console.log(err);
				}
				else{
					console.log(result);
                    res.json(result);
				}
            });
            conn.release();
		});
	});
    
    // URL : /getList/search/:select/:content
    // Method : GET
    // API for getting records which are searched
	self.app.get('/getList/search/:select/:content', function(req, res){
		pool.getConnection(function(err,conn){
			var sql = "SELECT * FROM bulletin WHERE ?? REGEXP '" + req.params.content + "' ORDER BY number DESC";
			var data = [req.params.select];

			conn.query(sql,data,function(err,result){
				if(err){
					console.log(err);
				}
				else{
					console.log(result);
                    res.json(result);
				}
            });
            conn.release();
		});
    });
    
    // URL : /getList/page/:page
    // Method : GET
    // API for getting records after paging
	self.app.get('/getList/page/:page', function(req, res){
		pool.getConnection(function(err,conn){
			var sql = "SELECT * FROM bulletin ORDER BY number DESC LIMIT ?,10";
			var data = Number(req.params.page);

			conn.query(sql,data,function(err,result){
				if(err){
					console.log(err);
				}
				else{
					console.log(result);
                    res.json(result);
				}
            });
            conn.release();
		});
	});
    
    // URL : /getList/search/:select/:content/:page
    // Method : GET
    // API for getting records which are searched after paging
	self.app.get('/getList/search/:select/:content/:page', function(req, res){
		pool.getConnection(function(err,conn){
			var sql = "SELECT * FROM bulletin WHERE ?? REGEXP '" + req.params.content + "' ORDER BY number DESC LIMIT ?,10";
			var data = [req.params.select, Number(req.params.page)];

			conn.query(sql,data,function(err,result){
				if(err){
					console.log(err);
				}
				else{
					console.log(result);
                    res.json(result);
				}
            });
            conn.release();
		});
	});
    
    // URL : /getList/:id
    // Method : GET
    // API for getting record using ID
	self.app.get('/getList/:id', function(req, res){
		pool.getConnection(function(err,conn){
			var sql = "SELECT * FROM bulletin WHERE number= ?";
			var data = [req.params.id];

			conn.query(sql,data,function(err,result){
				if(err){
					console.log(err);
				}
				else{
					console.log(result);
                    res.json(result);
				}
            });
            conn.release();
		});
	});
    
    // URL : /write
    // Method : POST
    // API for inserting record 
	self.app.post('/write', function(req, res){
		pool.getConnection(function(err,conn){
			var sql = "INSERT INTO bulletin(title,content,date,id,password) VALUES(?,?,now(),?,?)";
			var data = [req.body.title, req.body.content, req.body.id, req.body.password];

			conn.query(sql,data,function(err,result){
				if(err){
					console.log(err);
				}
				else{
					console.log(result);
					res.json(result);
				}
            });
            conn.release();
		});
	});
    
    // URL : /remove/:id
    // Method : GET
    // API for deleting record using ID
	self.app.get('/remove/:id', function(req, res){
		pool.getConnection(function(err,conn){
			var sql = "DELETE FROM bulletin WHERE number=?";
			var data = [req.params.id];

			conn.query(sql,data,function(err,result){
				if(err){
					console.log(err);
				}
				else{
					console.log(result);
					res.json(result);
				}
            });
            conn.release();
		});
	});
    
    // URL : /update
    // Method : PUT
    // API for updating record
	self.app.put('/update', function(req, res){
		pool.getConnection(function(err,conn){
			var sql = "UPDATE bulletin SET title=?, content=?, date=now() WHERE number=?";
			var data = [req.body.title, req.body.content, req.body.number];

			conn.query(sql,data,function(err,result){
				if(err){
					console.log(err);
				}
				else{
					console.log(result);
					res.json(result);
				}
            });
            conn.release();
		});
	});

};

module.exports = routeConfig;