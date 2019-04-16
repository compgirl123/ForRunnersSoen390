/* 
describe("Sign In Tests", function(){
  
  beforeEach(function(){
    firebase.initializeApp({
      apiKey: "AIzaSyCEI0nzK-GjzeRM72y92ORMQZSLxpXoYS0",
          authDomain: "forrunners-soen390-a6772.firebaseapp.com",
          databaseURL: "https://forrunners-soen390-a6772.firebaseio.com",
          projectId: "forrunners-soen390-a6772",
          storageBucket: "forrunners-soen390-a6772.appspot.com",
          messagingSenderId: "961868385218"
    });
   });

  beforeEach(module('app.controllers'));
  
  var $controller, $rootScope, $scope, $firebaseAuth, $state, CommonProp, $window, $firebaseObject;
  
  CommonProp = {};
  CommonProp.getUserId = () => {};
  CommonProp.logoutUser = () => {};

  beforeEach(inject(function(_$controller_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching

    $controller = _$controller_;
    $rootScope = _$rootScope_;

    $firebaseAuth = _$firebaseAuth_;
    $firebaseObject = _$firebaseObject_;
    window.sessionStorage.setItem('currentUser', undefined);
    $window.location.href = undefined

  }));


  describe('LoginCtrl', function() {
    // Added positive test with properly formatted elements
    it('Testing the signIn() function (successful login)', function() {
      $scope = $rootScope.$new();
      $scope.query = () => {};
      $controller = $controller('LoginCtrl', { $scope: $scope,
        $firebaseAuth: $firebaseAuth,
        $state: $state,
        CommonProp: CommonProp,
        $window: $window,
        $firebaseObject: $firebaseObject});
      
      $scope.user = {email:'sajeel155@yahoo.com', password:'test1234'};
     //mock auth() result
      var dbObject = (function() {
        return {
          ref: function(userRef) {
            return true;
          },
        };
      })();
     
     var mockauth = (function() {
        return {
          signInWithEmailAndPassword: function(email, password) {
            var error = false;
            return error;
          },
          onAuthStateChanged: function(key) {
            return store[key];
          },
          database: function(){
            return dbObject
          }
        };
      })();
      //mock firebase
      var mock = (function() {
        return {
          auth: function() {
            return mockauth;
          },
        };
      })();
      // Object.defineProperty(window, 'sessionStorage', { value: mock });
      // spyOn(sessionStorage, 'setItem');
      // spyOn(firebase, 'auth');
      // spyOn(firebase.auth(), 'signInWithEmailAndPassword');
      // spyOn(JSON, 'stringify');
      $scope.signIn(mock);
      // create a variable 
      //sessionStorage = spyOn(sessionStorage, 'setItem').and.callFake((arg) => {return "key:currentUser"})
      //expect(sessionStorage).toHaveBeenCalledWith(['currentUser', {"key": "currentUser"}])
      //expect($scope.count).toEqual(1);
      
      var value = {'username': 'sajeel', 'email': $scope.user.email,'age': '55', 'weight': '29', 'height': '2.6', 'gender':'Male'};
      // window.sessionStorage.setItem('currentUser', value);
      // expect(mock.setItem).toHaveBeenCalled();
      expect(firebase.auth).toHaveBeenCalled();
      // expect(firebase.auth().signInWithEmailAndPassword).toHaveBeenCalled();
      // expect(JSON.stringify).toHaveBeenCalled();
      // expect(sessionStorage.setItem).toHaveBeenCalled();
      // expect(storage.setItem).toHaveBeenCalledWith('currentUser',  value);
      // expect(storage.getItem('currentUser')).toEqual(value);

    });
    // it('Testing the signIn() function (wrong username)', function() {
    //   var $scope = $rootScope.$new();
    //   $scope.query = () => {}
    //   $controller = $controller('LoginCtrl', { $scope: $scope,
    //     $firebaseAuth: $firebaseAuth,
    //     $state: $state,
    //     CommonProp: CommonProp,
    //     $window: $window,
    //     $firebaseObject: $firebaseObject});
      
    //     $scope.user = {email:'int@gintama.com', password:'referencesEverywhere'} 
    //   $scope.signIn();
  

    //   spyOn(window.sessionStorage, 'setItem');
    //   expect(window.sessionStorage.setItem).toBe(undefined);

    // });
    // it('Testing the signIn() function (wrong password)', function() {
    //   var $scope = $rootScope.$new();
    //   $scope.query = () => {}
    //   $controller = $controller('LoginCtrl', { $scope: $scope,
    //     $firebaseAuth: $firebaseAuth,
    //     $state: $state,
    //     CommonProp: CommonProp,
    //     $window: $window,
    //     $firebaseObject: $firebaseObject});
      
    //     $scope.user = {email:'gintoki@gintama.com', password:'djhweoudhi32euu'} 
    //   $scope.signIn();

    //   spyOn(window.sessionStorage, 'setItem');
    //   // var value = {'username': $scope.username,'email': $scope.email,'age': '','age': '', 'weight': '', 'height': ''}
    //   // window.sessionStorage.setItem('currentUser', value);
      
    //   expect(window.sessionStorage.setItem).toBe(undefined);

    // });

    //  // Added negative test with non properly formatted elements
    //  it('Testing the signout() function when logged in', function() {
    //   var $scope = $rootScope.$new();
    //   $scope.query = () => {}
    //   $controller = $controller('LoginCtrl', { $scope: $scope,
    //     $firebaseAuth: $firebaseAuth,
    //     $state: $state,
    //     CommonProp: CommonProp,
    //     $window: $window,
    //     $firebaseObject: $firebaseObject});
      
    //   $scope.username = 'gintoki@gintama.com'
    //   $scope.password = 'referencesEverywhere';

    //   spyOn(window.sessionStorage, 'setItem');
    //   var value = {'username': $scope.username,'email': $scope.email,'age': '','age': '', 'weight': '', 'height': ''}
    //   window.sessionStorage.setItem('currentUser', value);
    //   $scope.signout();
    //   expect(window.sessionStorage.setItem).toBe(undefined);

    // });
    // it('Testing the signout() function when logged out', function() {
    //   var $scope = $rootScope.$new();
    //   $scope.query = () => {}
    //   $controller = $controller('LoginCtrl', { $scope: $scope,
    //     $firebaseAuth: $firebaseAuth,
    //     $state: $state,
    //     CommonProp: CommonProp,
    //     $window: $window,
    //     $firebaseObject: $firebaseObject});
      
    //   $scope.signout();
    //   expect(window.sessionStorage.setItem).toBe(undefined);

    // });
  });

});
 */