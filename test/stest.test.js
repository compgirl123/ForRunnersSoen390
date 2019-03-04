require('../node_modules/angular/angular.js');
require('../node_modules/angular-mocks/angular-mocks.js');
require('../www/js/app.js');
require('../www/js/controllers.js');
//require('www/lib/ionic/js/ionic.bundle.js');
//require('www/lib/ionic/js/ionic-angular.js');



describe('SignUpCtrl', function() {    
  beforeEach(angular.mock.module("app"));
  
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