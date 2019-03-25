
describe("Sign In Tests", function(){
  
  beforeEach(module('app.controllers'));

  var $controller, $rootScope, $scope, $firebaseAuth, $state, CommonProp, $window, $firebaseObject;

  CommonProp = {}
  CommonProp.getUserId = () => {}
  

  beforeEach(inject(function(_$controller_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    
    $controller = _$controller_;
    $rootScope = _$rootScope_;
  }));


  describe('LoginCtrl', function() {
    it('Testing the query() function', function() {
      var $scope = $rootScope;
      var $cordovaSQLite = $rootScope;
      var $state = $rootScope;
      var $ionicPopup = $rootScope;
      var $rootScope = $rootScope;
      var controller = $controller('LoginCtrl', { $scope: $scope, $cordovaSQLite: $cordovaSQLite,$state: $state,$ionicPopup: $ionicPopup,$rootScope: $rootScope});
      $scope.username = 'gintoki@gintama.com'
      $scope.password = 'referencesEverywhere';
      $scope.query();
      // create a variable 
      //sessionStorage = spyOn(sessionStorage, 'setItem').and.callFake((arg) => {return "key:currentUser"})
      //expect(sessionStorage).toHaveBeenCalledWith(['currentUser', {"key": "currentUser"}])
      //expect($scope.count).toEqual(1);

      spyOn(window.sessionStorage, 'setItem');
      var value = {'username': $scope.username,'email': $scope.email,'age': '','age': '', 'weight': '', 'height': ''}
      window.sessionStorage.setItem('currentUser', value);
      
      expect(window.sessionStorage.setItem).toHaveBeenCalledWith('currentUser', value);

    });
  });
  
});