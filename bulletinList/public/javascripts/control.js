// control.js
// declare module with ngRoute service
var app = angular.module('bulletinModule', ['ngRoute']);

// route URL using routeProvider  
app.config(function ($routeProvider) {
    $routeProvider

        .when('/', {
        templateUrl : 'views/home.html',
        controller  : 'mainController'
    })

        .when('/page/:num', {
        templateUrl : 'views/home.html',
        controller  : 'mainController'
    })

        .when('/page/search/:select/:content', {
        templateUrl : 'views/homeBySearch.html',
        controller  : 'mainControllerBySearch'
    })

        .when('/page/search/:select/:content/:page', {
        templateUrl : 'views/homeBySearch.html',
        controller  : 'mainControllerBySearch'
    })

        .when('/write', {
        templateUrl : 'views/write.html',
        controller  : 'writeController'
    })

        .when('/view/:id', {
        templateUrl : 'views/viewByID.html',
        controller  : 'viewControllerByID'
    })

        .when('/update/:id', {
        templateUrl : 'views/update.html',
        controller  : 'updateController'
    });
});

// add filter for replacing '\n' to '<br/>'  
app.filter('nl2br', function ($sce) {
    return function (text) {
        text = text.replace(/\n/g, '<br />');
        return $sce.trustAsHtml(text);
    };
});

// add directive named 'ng-enter' for detecting enter key event
app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which == 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});

// add directive name 'ng-focus' for focusing some input types
app.directive('ngFocus', function () {
    return function (scope, element) {
        element[0].focus();
    };
});

// add controller ( mainController <---> home.html )
app.controller('mainController', function ($scope, $http, $location, $window, $routeParams) {
    
    $scope.message = 'VIEW PAGE';
    
    var recordCount = 0;
    var page = 1;
    
    // HTTP request for getting total count of records
    $http.get('/getList').success(function (data) {
        recordCount = data.length;
        
        paging(recordCount);
    });
    
    // function for searching 
    $scope.search = function () {
        $location.url('/page/search/' + $scope.formData.select + '/' + $scope.formData.search);
    };
    
    // function for removing
    $scope.removeByID = function (num) {
        
        if (confirm('삭제를 하시겠습니까?')) {
            $http.get('/remove/' + num).success(function (data) {
                alert('삭제가 완료되었습니다.');
                $window.location.reload();
            }).error(function (data) {
                alert('삭제를 실패하였습니다.');
            });
        }
    };
    
    // function for paging 
    function paging(recordCount) {
        if ($routeParams.num !== undefined) {
            page = $routeParams.num;
        }
        
        var countPerPage = 10;
        var countOfPage = $window.Math.ceil(recordCount / countPerPage);
        
        if (page < 1 || page > countOfPage) {
            alert('존재하지 않는 페이지입니다.');
            $window.history.back();
        }
        
        var pagePerSection = 10;
        var curSection = $window.Math.ceil(page / pagePerSection);
        var countOfSection = $window.Math.ceil(countOfPage / pagePerSection);
        
        var firstPage = (curSection - 1) * pagePerSection + 1;
        var lastPage = 0;
        
        if (curSection == countOfSection) {
            lastPage = countOfPage;
        }
        else {
            lastPage = curSection * pagePerSection;
        }
        
        $scope.curPage = page;
        $scope.prevPage = (curSection - 1) * pagePerSection;
        $scope.nextPage = lastPage + 1;
        $scope.pageLists = [];
        
        for (var i = $scope.prevPage + 1; i < lastPage + 1; i++) {
            $scope.pageLists.push(i);
        }
        
        $scope.firstNumOfPage = recordCount - countPerPage * (page - 1);
        
        var firstWrite = (page - 1) * countPerPage;
        
        // HTTP request for paging result
        $http.get('/getList/page/' + firstWrite).success(function (data) {
            $scope.results = data;
        });
    }
});

// add controller ( mainControllerBySearch <---> homeBySearch.html )
app.controller('mainControllerBySearch', function ($scope, $http, $location, $window, $routeParams) {
    
    $scope.message = 'VIEW PAGE';
    
    var recordCount = 0;
    var page = 1;
    
    $scope.select = $routeParams.select;
    $scope.content = $routeParams.content;
    
    // HTTP request for getting total count of records
    $http.get('/getList/search/' + $routeParams.select + '/' + $routeParams.content).success(function (data) {
        recordCount = data.length;
        
        paging(recordCount);
    });
    
    // function for searching 
    $scope.search = function () {
        $location.url('/page/search/' + $scope.formData.select + '/' + $scope.formData.search);
    };
    
    // function for removing
    $scope.removeByID = function (num) {
        
        if (confirm('삭제를 하시겠습니까?')) {
            $http.get('/remove/' + num).success(function (data) {
                alert('삭제가 완료되었습니다.');
                $window.location.reload();
            }).error(function (data) {
                alert('삭제를 실패하였습니다.');
            });
        }
    };
    
    // function for paging
    function paging(recordCount) {
        if ($routeParams.page !== undefined) {
            page = $routeParams.page;
        }
        
        var countPerPage = 10;
        var countOfPage = $window.Math.ceil(recordCount / countPerPage);
        
        if (page < 1 || page > countOfPage) {
            alert('존재하지 않는 페이지입니다.');
            $window.history.back();
        }
        
        var pagePerSection = 10;
        var curSection = $window.Math.ceil(page / pagePerSection);
        var countOfSection = $window.Math.ceil(countOfPage / pagePerSection);
        
        var firstPage = (curSection - 1) * pagePerSection + 1;
        var lastPage = 0;
        
        if (curSection == countOfSection) {
            lastPage = countOfPage;
        }
        else {
            lastPage = curSection * pagePerSection;
        }
        
        $scope.curPage = page;
        $scope.prevPage = (curSection - 1) * pagePerSection;
        $scope.nextPage = lastPage + 1;                                 //curSection * pagePerSection + 1;
        $scope.pageLists = [];
        
        for (var i = $scope.prevPage + 1; i < lastPage + 1; i++) {
            $scope.pageLists.push(i);
        }
        
        $scope.firstNumOfPage = recordCount - countPerPage * (page - 1);
        
        var firstWrite = (page - 1) * countPerPage;
        
        // HTTP request for paging result
        $http.get('/getList/search/' + $routeParams.select + '/' + $routeParams.content + '/' + firstWrite).success(function (data) {
            $scope.results = data;
        });
    }
});

// add controller ( writeController <---> write.html )
app.controller('writeController', function ($scope, $http, $location) {
    
    $scope.message = 'WRITE PAGE';
    
    // function for writing
    $scope.writeID = function () {
        $scope.formData.date = Date.now();

        // HTTP request for writing 
        $http.post('/write', $scope.formData).success(function (data) {
            alert('작성이 완료되었습니다.');
            $location.url('/');
        }).error(function (data) {
            alert('작성을 실패하였습니다.');
        });
    };
});

// add controller ( viewControllerByID <---> viewByID.html )
app.controller('viewControllerByID', function ($scope, $http, $location, $routeParams) {
    
    $scope.message = 'VIEW BY ID PAGE';
    
    // HTTP request for getting results using ID
    $http.get('/getList/' + $routeParams.id).success(function (data) {
        
        $scope.result = data[0];
    });
    
    // function for removing
    $scope.removeByID = function () {
        
        if (confirm('삭제를 하시겠습니까?')) {
            $http.get('/remove/' + $routeParams.id).success(function (data) {
                alert('삭제가 완료되었습니다.');
                $location.url('/');
            }).error(function (data) {
                alert('삭제를 실패하였습니다.');
            });
        }
    };
});

// add controller ( updateController <---> update.html )
app.controller('updateController', function ($scope, $http, $location, $window, $routeParams) {
    
    $scope.message = 'UPDATE PAGE';
    
    // HTTP request for getting result using ID
    $http.get('/getList/' + $routeParams.id).success(function (data) {
        
        $scope.result = data[0];
    });
    
    // function for updating
    $scope.update = function () {
        $scope.result.date = Date.now();

        // HTTP request for updating 
        if (confirm('수정을 하시겠습니까?')) {
            $http.post('/update', $scope.result).success(function (data) {
                alert('수정이 완료되었습니다.');
                $window.location.href = '#/view/' + $routeParams.id;
            }).error(function (data) {
                alert('수정을 실패하였습니다.');
            });
        }
    };

});