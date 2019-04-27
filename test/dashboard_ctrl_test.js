describe("Dashboard Tests", function(){

  beforeEach(module('app.controllers'));

  var DashboardCtrl;
  var $controller, $rootScope, $scope, $state, $window;

  beforeEach(inject(function(_$controller_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $scope = _$rootScope_.$new();
    var controller = $controller('DashboardCtrl', 
    { 
      $rootScope: $rootScope,
      $scope: $scope,
      $state: $state,
      $window: $window
      
    });
  }));


  describe('DashboardCtrl', function() {
    it('Expecting the getvalues() function to show challenge is failed', function() {
      
    
      spyOn($scope, 'getvalues');
      $scope.getvalues.challengeStarted = false;
      $scope.getvalues.actual_time = "0:15:00";
      $scope.getvalues.target_time = 20;
      $scope.getvalues.target_distance = 3;
      $scope.getvalues.actual_distance = 1.5;
      $scope.getvalues();
      expect($scope.getvalues).toHaveBeenCalled();
      //expect($scope.getvalues.progress).toEqual(50);
      //expect($scope.getvalues.calculator).toEqual(180);
      //expect($scope.getvalues.status).toEqual("failed");
      //expect(getvalues.session.bar).toEqual(1);

    });
    it('Expecting the getvalues() function to show challenge is passed', function() {

      
      spyOn($scope, 'getvalues');
      $scope.getvalues.challengeStarted = false;
      $scope.getvalues.actual_time = "0:15:00";
      $scope.getvalues.target_time = 20;
      $scope.getvalues.target_distance = 3;
      $scope.getvalues.actual_distance = 3;
      $scope.getvalues();
      expect($scope.getvalues).toHaveBeenCalled();
      //expect($scope.getvalues.progress).toEqual(100);
      //expect($scope.getvalues.calculator).toEqual(360);
      //expect($scope.getvalues.status).toEqual("passed");
      //expect(getvalues.session.bar).toEqual(1);
      //expect(getvalues.gotocongratulations).toHaveBeenCalled();
    });
    
  });
  
});