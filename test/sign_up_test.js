describe("Sign Up Tests", function(){
  
    beforeEach(module('app.controllers'));
  
    var $controller, $rootScope, $scope, $firebaseAuth, $state, $firebaseArray, $ionicPopup;

    beforeEach(inject(function(_$controller_, _$rootScope_){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      
      $controller = _$controller_;
      $rootScope = _$rootScope_;
    }));
  
  
    describe('RegisterCtrl', function() {
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
        'email':'gintoki@gintama.com',
        'password':'referencesEverywhere',
        }
        $scope.signUp();

        // create a variable 
        //sessionStorage = spyOn(sessionStorage, 'setItem').and.callFake((arg) => {return "key:currentUser"})
        //expect(sessionStorage).toHaveBeenCalledWith(['currentUser', {"key": "currentUser"}])
        //expect($scope.count).toEqual(1);
        spyOn($ionicPopup, 'alert');

        //expect(ionicPopup.alert).toHaveBeenCalled();

        expect(ionicPopup.alert).toHaveBeenCalledWith({
            title: "Successfully Registered"
        });
        //var value = {'username': $scope.username,'email': $scope.email,'age': '','age': '', 'weight': '', 'height': ''}
        //window.sessionStorage.setItem('currentUser', value);
        
       // expect(window.sessionStorage.setItem).toHaveBeenCalledWith('currentUser', value);
  
      });
      
    });
    
  });

