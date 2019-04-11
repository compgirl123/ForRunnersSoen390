require('../node_modules/angular/angular.js');
require('../node_modules/angular-mocks/angular-mocks.js');
require('../node_modules/firebase-mock/browser/firebasemock.js');
require('../www/js/app.js');
require('../www/js/controllers.js');

describe("SignUp Tests", function(){
    beforeAll(function(){
      
    });
    beforeEach(angular.mock.module('app.controllers'));
  
    var $controller, $rootScope, $scope, $firebaseAuth, $state, $ionicPopup, $firebaseArray,$firebaseObject,$window;
    
  
    beforeEach(inject(function(_$controller_, _$rootScope_){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      
      $controller = _$controller_;
      $rootScope = _$rootScope_;
    }));
  
  
    describe('RegisterCtrl', function() {
      it('Testing change function', function() {
        var firebasemock = require('firebase-mock');
        var mockauth = new firebasemock.MockFirebase();
        var mockdatabase = new firebasemock.MockFirebase();
        // var mockfirestore = new firebasemock.MockFirestore();
        // var mockstorage = new firebasemock.MockStorage();
        // var mockmessaging = new firebasemock.MockMessaging();
        var mocksdk = new firebasemock.MockFirebaseSdk(
        // use null if your code does not use RTDB
        (path) => {
          return path ? mockdatabase.child(path) : mockdatabase;
        },
        // use null if your code does not use AUTHENTICATION
        () => {
          return mockauth;
        },
        // use null if your code does not use FIRESTORE
        // () => {
        //   return mockfirestore;
        // },
        // use null if your code does not use STORAGE
        // () => {
        //   return mockstorage;
        // },
        // use null if your code does not use MESSAGING
        // () => {
        //   return mockmessaging;
        // }
      );
        var $scope = $rootScope.$new();
        var controller = $controller('RegisterCtrl', { $scope: $scope,
          $firebaseAuth: $firebaseAuth,
          $state: $state,
          $firebaseObject: $firebaseObject,
          $window: $window,
          $firebaseArray: $firebaseArray,
          $ionicPopup:$ionicPopup
         });
        mocksdk.mockauth.override();
        $scope.user = {Username:"tester1", email:"gmailtest@gmail.com",password:"password", test:"testing123"};
        // spyOn(firebase, 'auth')
        $scope.signUp().then(function(title) {
          console.assert(title, "Successfully Registered");
        });
        // var a = mocksdk.mockauth();
        // fail($firebaseAuth.firebase);
        // create a variable 
        //sessionStorage = spyOn(sessionStorage, 'setItem').and.callFake((arg) => {return "key:currentUser"})
        //expect(sessionStorage).toHaveBeenCalledWith(['currentUser', {"key": "currentUser"}])
        //expect($scope.count).toEqual(1);
  
        spyOn(window.sessionStorage, 'getItem');
        $scope.user = {'username': 'Test1','email':'test@gmail.com','age': '21','weight': '65', 'height': '1.8','gender':'Male','activity':'Very active'}
        window.sessionStorage.getItem('currentUser');
        
        expect(window.sessionStorage.getItem).toHaveBeenCalledWith('currentUser');
        expect(window.sessionStorage.getItem).not.toBe(null);
  
      });
    });
    
  });