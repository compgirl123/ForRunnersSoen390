describe('SignUpCtrl', function() {
    beforeEach(module('app'));
  
    var $controller;
  
    beforeEach(inject(function(_$controller_){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $controller = _$controller_;
    }));
  
    describe('$scope.submit', function() {
      var $scope, controller;
  
      beforeEach(function() {
        $scope = {};
        controller = $controller('SignUpCtrl', { $scope: $scope });
      });
  
      it('Checks if user registration is successful ', function() {
        $scope.user.Username = 'tanya';
        $scope.user.email = 'user15@gmail.com';
        $scope.user.password = 'concordia'
        $scope.submit();
        expect($scope.count).toEqual(3);
      });
    });
  });