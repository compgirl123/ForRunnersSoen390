describe("CreatePlanCtrl", function(){

    beforeEach(module('app.controllers'));
   
    var $controller, $rootScope, $scope, $state;
   
    beforeEach(inject(function(_$controller_, _$rootScope_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        $controller('CreatePlanCtrl', { $scope: $scope,
          $state: $state,
          $rootScope: $rootScope
          });
      }));
   
    it('excercise function testing', function() {
      spyOn($scope, 'exercise');
      $scope.exercise();
      expect($scope.exercise).toHaveBeenCalled();
      //expect($state.go).toHaveBeenCalledWith("app.excercise");
    });
    it('tips function testing', function() {
        spyOn($scope, 'tips');
        $scope.tips();
        expect($scope.tips).toHaveBeenCalled();
       // expect($state.go).toHaveBeenCalledWith("app.tips");
      });
   });