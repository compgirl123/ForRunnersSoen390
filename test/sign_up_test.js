// describe("Sign Up Tests", function(){
  
//     beforeEach(module('app.controllers'));
  
//     var $controller, $rootScope, $scope, $firebaseAuth, $state, $firebaseArray, $ionicPopup;

//     beforeEach(inject(function(_$controller_, _$rootScope_){
//       // The injector unwraps the underscores (_) from around the parameter names when matching
      
//       $controller = _$controller_;
//       $rootScope = _$rootScope_;
//     }));
  
  
//     describe('RegisterCtrl', function() {
//       it('Expecting the signUp() function to pass', function() {
//         var $scope = $rootScope.$new();
//         $scope.signUp = () => {}
//         var controller = $controller('RegisterCtrl', 
//         { $scope: $scope,
//           $firebaseAuth: $firebaseAuth,
//           $state: $state,
//           $firebaseArray: $firebaseArray,
//           $ionicPopup: $ionicPopup
//         });
//         $scope.user = {
//         'Username':'tanya',
//         'email':'multanitanya@gmail.com',
//         'password':'concordia',
//         }
//         $scope.signUp();
//         spyOn($ionicPopup, 'alert');
//         expect(ionicPopup.alert).toHaveBeenCalledWith({
//             title: "Successfully Registered"
//         });
        
//         it('Expecting the signUp() function to fail', function() {
//           var $scope = $rootScope.$new();
//           $scope.signUp = () => {}
//           var controller = $controller('RegisterCtrl', 
//           { $scope: $scope,
//             $firebaseAuth: $firebaseAuth,
//             $state: $state,
//             $firebaseArray: $firebaseArray,
//             $ionicPopup: $ionicPopup
//           });
//           $scope.user = {
//           'Username':'tanya',
//           'email':'tanyaa@gmail.com',
//           'password':'concordia',
//           }
//           $scope.signUp();
//           spyOn($ionicPopup, 'alert');
//           expect(ionicPopup.alert).toHaveBeenCalledWith({
//               title: "A user already exists with the specified email address"
//           });
//       });
      
//     });
    
//   });

// });