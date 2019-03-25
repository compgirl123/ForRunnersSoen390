
describe("Food Tests", function(){

  beforeEach(module('app.controllers'));

  var $controller, $rootScope, $scope, $firebaseAuth, $state, $window, $firebaseObject,$ionicPopup;


  beforeEach(inject(function(_$controller_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching

    $controller = _$controller_;
    $rootScope = _$rootScope_;
    var $scope = $rootScope.$new();
    var controller = $controller('FoodCtrl', { $scope: $scope,
      $ionicPopup: $ionicPopup,
      $state: $state,
      $firebaseObject: $firebaseObject,
      $window: $window
     });
  }));


  describe('FoodCtrl', function() {
    it('Testing foodDetails function', function() {

      spyOn(scope, 'foodDetails');
      scope.foodDetails;
      expect(scope.foodDetails).toHaveBeenCalled();
      spyOn(window.sessionStorage, 'setItem');
      $scope.food = {'name': 'potato','amount':'100','calories': '77','unit': 'g'}
      window.sessionStorage.setItem('currentFood');

      expect(window.sessionStorage.setItem).toHaveBeenCalledWith('currentFood');
      expect(window.sessionStorage.getItem).not.toBe(null);

    });
  });

});
