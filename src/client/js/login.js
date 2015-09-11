var login = angular.module("login", [
  "ngRoute",
  "ngCookies"
]);

login.run([ '$rootScope', '$location', function ($rootScope, $location){
  $rootScope.$on("$routeChangeStart", function (event, next, current){
  });
}]);

login.controller('AuthController', function ($scope, $window, $location, $cookies, Auth) {
  $scope.signInWithFB = function(){
    console.log('signing in');
    var cookies = $cookies.get("facebookToken");

    //pass along username and token
    Auth.signInWithFB($cookies.get('facebookToken'));
 
  };
});

login.factory('Auth', function ($http, $location, $window){

  var signInWithFB = function(user){
    console.log('TOKEN');

    user = JSON.parse(user);
    console.log(user.facebookId);
    $window.localStorage.setItem('facebookId', user.facebookId);
    $window.localStorage.setItem('facebookToken', user.token);

  };

  return {
    signInWithFB: signInWithFB
  };
});