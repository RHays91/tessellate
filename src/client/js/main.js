var tess = angular.module("tessell", [
  "ngRoute"
]);

tess.config(["$routeProvider",'$httpProvider', function ($routeProvider, $httpProvider){
  $routeProvider
    .when('/', {
      templateUrl: '../index.html',
      controller: 'loginController',
      authenticate: false
    })
    .when('/main', {
      templateUrl: '../main.html', 
      controller: 'eventsProfileController',
      authenticate: true
    })
    .when('/create', {
      templateUrl: '../create.html', 
      controller: 'eventsProfileController',
      authenticate: true
    })
    .when('/mosaic', {
      templateUrl: '../mosaic.html',
      controller: 'eventsProfileController',
      authenticate: true
    })
    .otherwise({
      redirectTo: '/'
    });
}]);

tess.run([ '$rootScope', '$location', '$http', function ($rootScope, $location, $http){
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.templateUrl !== '../index.html'){
      $http({
        method: 'GET',
        url: '/loggedin'
      }).then(function(response){
        if (response !== '0'){
          console.log('isAuth TRUE');
        } else {
          console.log('UNAUTHORIZED...Redirecting');
          $location.path('/login');
        }
      });
    }
  });
}]);

tess.factory('httpRequestFactory', [ '$http', '$location', '$q', function ($http, $location, $q){
  var httpRequestFactory = {};
  httpRequestFactory.getUserProfile = function(){
    return $http({
      method: 'GET',
      url: '/user'
    }).then(function(response){
      httpRequestFactory.fullUserProfile = response.data;
      return response;
    });
  };
  httpRequestFactory.getUserEvents = function(){
    return $http({
      method: 'GET',
      url: '/events'
    }).then(function(response){
      httpRequestFactory.userEvents = response.data;
      return response;
    });
  };

  httpRequestFactory.logout = function(){
    return $http({
      method: 'GET',
      url: '/logout'
    }).then(function(response){
      console.log("Logging Out");
      $location.path('/login');
      return response;
    });
  };

  return httpRequestFactory;
}]);

tess.controller('eventsProfileController', [ '$scope', 'httpRequestFactory', '$location', function ($scope, httpRequestFactory, $location){
  $scope.photoLoaded = false;
  $scope.getUserProfile = function(){
    httpRequestFactory.getUserProfile()
      .then(function(response){
        $scope.userProfile = response.data;
      });
  };
  $scope.getUserEvents = function(){
    console.log('getting events');
    httpRequestFactory.getUserEvents()
      .then(function(response){
        $scope.userEvents = response.data;
      });
  };
  // $scope.getUserEvents();
  $scope.joinEvent = function(){
    if(!!$scope.eventCode){
      $scope.noEventCode = false;
    } else {
      $scope.noEventCode = true;
    }
  };
  $scope.createEvent = function(){
    if(!!$scope.eventCode){
      $scope.noEventCode = false;
    } else {
      $scope.noEventCode = true;
    }
  };
  $scope.goToExisitingEvent = function(eventCode){
    };

  $scope.logout = function(){
    httpRequestFactory.logout();
  };

  $scope.dropzoneConfig = {
    'options': {
      'url': '/event',
      'method': 'POST',
      'maxFiles': 1,
      'clickable': true,
      'autoProcessQueue': false,
      'acceptedFiles': 'image/jpeg, image/png',
      init: function(){
        dz = this;
        $('#submit-all').click(function(){
          if(!!$scope.eventCode && !!$scope.eventName && !!$scope.eventDate && dz.files.length === 1){
            dz.processQueue();
            dz.removeAllFiles();
          }
        });
      }
    },
    'eventHandlers': {
      'sending': function (file, xhr, formData) {
        formData.append("eventCode", $scope.eventCode);
        formData.append("eventName", $scope.eventName);
        // formData.append("eventDate", $scope.eventDate);
      },
      'success': function (file, response) {
      },
      'maxfilesexceeded': function(file){
        this.removeAllFiles();
        this.addFile(file);
      },
      'addedfile': function(file){
        // $scope.$broadcast('photoUploaded');
      }
    }
  };
}]);



/**
* An AngularJS directive for Dropzone.js, http://www.dropzonejs.com/
* 
* Usage:
* 
* <div ng-app="app" ng-controller="SomeCtrl">
*   <button dropzone="dropzoneConfig">
*     Drag and drop files here or click to upload
*   </button>
* </div>
*/

tess.directive('dropzone', function () {
 return function (scope, element, attrs) {
   var config, dropzone;

   config = scope[attrs.dropzone];
   dropzone = new Dropzone(element[0], config.options);

   angular.forEach(config.eventHandlers, function (handler, event) {
     dropzone.on(event, handler);
   });
 };
});

tess.controller('loginController', ['$scope', 'loginFactory', function ($scope, loginFactory){
  $scope.userFound = loginFactory.loginWithFacebook();
  $scope.altLogin = function(){
    loginFactory.altLogin();
  };
}]);

tess.factory('loginFactory', ['$http', '$location', '$window', function ($http, $location, $window){
  return {
    loginWithFacebook: function(){
      return $http({
        method: 'GET',
        url: '/loggedin'
      }).then(function (res){
        if (res.status !== '0'){
          return true;
          // console.log('YAY');
          // $location.url('/create');
        } else {
          return false;
          // console.log('BOO');
          // $location.('/');
        }
      });
    },

    altLogin: function(){
      $window.location = $window.location.protocol + "//" + $window.location.host + $window.location.pathname + "auth/facebook";
    }
        
  };
}]);
