
describe("Sign In Tests", function(){
  
  beforeEach(module('app.controllers'));

  var $controller, $rootScope;

  beforeEach(inject(function(_$controller_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    $rootScope = _$rootScope_;
  }));


  describe('SignInCtrl', function() {
    it('Testing the query() function', function() {
      var $scope = $rootScope.$new();
      var controller = $controller('SignInCtrl', { $scope: $scope });
      $scope.username = 'gintoki@gintama.com'
      $scope.password = 'referencesEverywhere';
      $scope.query();
      expect($scope.count).toEqual(1);
    });
  });
  
});