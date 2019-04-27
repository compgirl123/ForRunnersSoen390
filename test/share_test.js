describe("ShareCtrl", function(){

    beforeEach(module('app.controllers'));
   
    var $controller, $rootScope, $scope;
   
    beforeEach(inject(function(_$controller_, _$rootScope_){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      $scope = _$rootScope_.$new();
      $controller('ShareCtrl', { $scope: $scope
        });
    }));
   
    it('share function', function() {
      spyOn($scope, 'share');
      $scope.share();
      expect($scope.share).toHaveBeenCalled();
    });
   });