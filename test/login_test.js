
describe("Sign In Tests", function(){
  
  beforeEach(module('app.controllers'));

  var $controller, $rootScope, $scope, $firebaseAuth, $state, CommonProp, $window, $firebaseObject;

  CommonProp = {}
  CommonProp.getUserId = () => {}
  

  beforeEach(inject(function(_$controller_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    window.sessionStorage.setItem('currentUser', undefined);
  }));


  describe('LoginCtrl', function() {
    // Added positive test with properly formatted elements
    it('Testing the signIn() function (successful login)', function() {
      var $scope = $rootScope.$new();
      $scope.query = () => {}
      var controller = $controller('LoginCtrl', { $scope: $scope,
        $firebaseAuth: $firebaseAuth,
        $state: $state,
        CommonProp: CommonProp,
        $window: $window,
        $firebaseObject: $firebaseObject});
      
        $scope.user = {email:'gintoki@gintama.com', password:'referencesEverywhere'} 
      $scope.signIn();
      // create a variable 
      //sessionStorage = spyOn(sessionStorage, 'setItem').and.callFake((arg) => {return "key:currentUser"})
      //expect(sessionStorage).toHaveBeenCalledWith(['currentUser', {"key": "currentUser"}])
      //expect($scope.count).toEqual(1);

      spyOn(window.sessionStorage, 'setItem');
      // var value = {'username': $scope.username,'email': $scope.email,'age': '','age': '', 'weight': '', 'height': ''}
      // window.sessionStorage.setItem('currentUser', value);
      
      expect(window.sessionStorage.setItem).toHaveBeenCalledWith('currentUser', value);
      expect(window.sessionStorage.setItem).toBe(value);

    });
    it('Testing the signIn() function (wrong username)', function() {
      var $scope = $rootScope.$new();
      $scope.query = () => {}
      var controller = $controller('LoginCtrl', { $scope: $scope,
        $firebaseAuth: $firebaseAuth,
        $state: $state,
        CommonProp: CommonProp,
        $window: $window,
        $firebaseObject: $firebaseObject});
      
        $scope.user = {email:'int@gintama.com', password:'referencesEverywhere'} 
      $scope.signIn();
  

      spyOn(window.sessionStorage, 'setItem');
      expect(window.sessionStorage.setItem).toBe(undefined);

    });
    it('Testing the signIn() function (wrong password)', function() {
      var $scope = $rootScope.$new();
      $scope.query = () => {}
      var controller = $controller('LoginCtrl', { $scope: $scope,
        $firebaseAuth: $firebaseAuth,
        $state: $state,
        CommonProp: CommonProp,
        $window: $window,
        $firebaseObject: $firebaseObject});
      
        $scope.user = {email:'gintoki@gintama.com', password:'djhweoudhi32euu'} 
      $scope.signIn();

      spyOn(window.sessionStorage, 'setItem');
      // var value = {'username': $scope.username,'email': $scope.email,'age': '','age': '', 'weight': '', 'height': ''}
      // window.sessionStorage.setItem('currentUser', value);
      
      expect(window.sessionStorage.setItem).toBe(undefined);

    });

     // Added negative test with non properly formatted elements
     it('Testing the signout() function when logged in', function() {
      var $scope = $rootScope.$new();
      $scope.query = () => {}
      var controller = $controller('LoginCtrl', { $scope: $scope,
        $firebaseAuth: $firebaseAuth,
        $state: $state,
        CommonProp: CommonProp,
        $window: $window,
        $firebaseObject: $firebaseObject});
      
      $scope.username = 'gintoki@gintama.com'
      $scope.password = 'referencesEverywhere';

      spyOn(window.sessionStorage, 'setItem');
      var value = {'username': $scope.username,'email': $scope.email,'age': '','age': '', 'weight': '', 'height': ''}
      window.sessionStorage.setItem('currentUser', value);
      $scope.signout();
      expect(window.sessionStorage.setItem).toBe(undefined);

    });
    it('Testing the signout() function when logged out', function() {
      var $scope = $rootScope.$new();
      $scope.query = () => {}
      var controller = $controller('LoginCtrl', { $scope: $scope,
        $firebaseAuth: $firebaseAuth,
        $state: $state,
        CommonProp: CommonProp,
        $window: $window,
        $firebaseObject: $firebaseObject});
      
      $scope.signout();
      expect(window.sessionStorage.setItem).toBe(undefined);

    });
  });
  
});