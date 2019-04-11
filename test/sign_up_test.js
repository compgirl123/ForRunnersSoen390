/* describe("Sign Up Tests", function(){
  
  beforeAll(function(){
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
  
    var $controller, $rootScope, $scope, $firebaseAuth, $state, $firebaseArray, $ionicPopup;

    beforeEach(inject(function(_$controller_, _$rootScope_){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      
      $controller = _$controller_;
      $rootScope = _$rootScope_;
    }));
  
  
    describe('RegisterCtrl', function() {
      it('Expecting the signUp() function to pass', function() {
        var $scope = $rootScope.$new();
        $scope.signUp = () => {}
        $ionicPopup.alert = () => {}
        $controller = $controller('RegisterCtrl', 
        { $scope: $scope,
          $firebaseAuth: $firebaseAuth,
          $state: $state,
          $firebaseArray: $firebaseArray,
          $ionicPopup: $ionicPopup
        });
        $scope.user = {
        'Username':'tanya',
        'email':'multanitanya@gmail.com',
        'password':'concordia',
        }
        $scope.signUp();
        spyOn($ionicPopup, 'alert');
        expect(ionicPopup.alert).toHaveBeenCalledWith({
            title: "Successfully Registered"
        });
        
        it('Expecting the signUp() function to fail', function() {
          var $scope = $rootScope.$new();
          $scope.signUp = () => {}
          var controller = $controller('RegisterCtrl', 
          { $scope: $scope,
            $firebaseAuth: $firebaseAuth,
            $state: $state,
            $firebaseArray: $firebaseArray,
            $ionicPopup: $ionicPopup
          });
          $scope.user = {
          'Username':'tanya',
          'email':'tanyaa@gmail.com',
          'password':'concordia',
          }
          $scope.signUp();
          spyOn($ionicPopup, 'alert');
          expect(ionicPopup.alert).toHaveBeenCalledWith({
              title: "A user already exists with the specified email address"
          });
      });
      
    });
    
  });

}); */