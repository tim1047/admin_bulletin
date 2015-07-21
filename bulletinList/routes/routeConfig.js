// routeConfig.js
// setting for mongoDB connection (using 'mongojs' module)
var mongojs = require('mongojs');
var db = mongojs('bulletin', ['bulletins']);

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
        db.bulletins.find({}).sort({ _id : -1 }, function (err, result) {
            console.log(result);
            res.json(result);
        });
	});
    
    // URL : /getList/search/:select/:content
    // Method : GET
    // API for getting records which are searched
    self.app.get('/getList/search/:select/:content', function (req, res) {
        var select = req.params.select;
        var content = req.params.content;
        
        if (select == 'title') {
            db.bulletins.find({ title : { $regex : content } }).sort({ _id : -1 }, function (err, result) {
                console.log(result);
                res.json(result);
            });
        }
        else if (select == 'id') {
            db.bulletins.find({ id : { $regex : content } }).sort({ _id : -1 }, function (err, result) {
                console.log(result);
                res.json(result);
            });
        }
    });
    
    // URL : /getList/page/:page
    // Method : GET
    // API for getting records after paging
	self.app.get('/getList/page/:page', function(req, res){
        db.bulletins.find({}).limit(10).sort({ _id : -1 }).skip(req.params.page, function (err, result) {
            console.log(result);
            res.json(result);
        });
	});
    
    // URL : /getList/search/:select/:content/:page
    // Method : GET
    // API for getting records which are searched after paging
	self.app.get('/getList/search/:select/:content/:page', function(req, res){
        var select = req.params.select;
        var content = req.params.content;
        
        if (select == 'title') {
            db.bulletins.find({ title : { $regex : content } }).limit(10).sort({ _id : -1 }).skip(req.params.page, function (err, result) {
                console.log(result);
                res.json(result);
            });
        }
        else if (select == 'id') {
            db.bulletins.find({ id : { $regex : content } }).limit(10).sort({ _id : -1 }).skip(req.params.page, function (err, result) {
                console.log(result);
                res.json(result);
            });
        }
	});
    
    // URL : /getList/:id
    // Method : GET
    // API for getting record using ID
	self.app.get('/getList/:id', function(req, res){
        var id = req.params.id;

        db.bulletins.find({_id : mongojs.ObjectId(id)}, function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(result);
                res.json(result);
            }
        });
	});
    
    // URL : /write
    // Method : POST
    // API for inserting record 
    self.app.post('/write', function (req, res) {
        db.bulletins.insert(req.body, function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                res.json(result);
            }
        });
    });
    
    // URL : /remove/:id
    // Method : GET
    // API for deleting record using ID
    self.app.get('/remove/:id', function (req, res){
        var id = req.params.id;

        db.bulletins.remove({_id : mongojs.ObjectId(id)}, function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                res.json(result);
            }
        });
	});
    
    // URL : /update
    // Method : POST
    // API for updating record
    self.app.post('/update', function (req, res) {
        var id = req.body._id;

        db.bulletins.update({ _id : mongojs.ObjectId(id) },
                            { $set : { title : req.body.title, content : req.body.content, id : req.body.id, password : req.body.password } },
                             function (err, result){
                                res.json(result);
                            });
    });                            
};

module.exports = routeConfig;