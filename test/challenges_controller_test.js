describe("ChallengesCtrl", function(){

 beforeEach(module('app.controllers'));

 var $controller, $rootScope, scope, $state, $window;

 beforeEach(inject(function(_$controller_, _$rootScope_){
   // The injector unwraps the underscores (_) from around the parameter names when matching
   $controller = _$controller_;
   $rootScope = _$rootScope_;
   scope = _$rootScope_.$new();
   $controller('ChallengesCtrl', { $scope: scope,
     $state: $state,
     $window: $window,
     $rootScope: $rootScope
     });
 }));

 it('threeKm distance and time should be 3 and 20', function() {
   spyOn(scope, 'threeKm');
   $rootScope.distance = 3;
   $rootScope.time = 20;
   $scope.threeKm();
   expect($scope.threeKm).toHaveBeenCalled();
   expect($scope.distance).toBe(3);
   expect($scope.time).toBe(20);
 });

 it('fiveKm distance and time should be 5 and 35', function() {
   spyOn(scope, 'fiveKm');
   $rootScope.distance = 5;
   $rootScope.time = 35;
   $scope.fiveKm();
   expect($scope.fiveKm).toHaveBeenCalled();
   expect($scope.distance).toBe(5);
   expect($scope.time).toBe(35);
 });

 it('tenKm distance and time should be 5 and 35', function() {
   spyOn(scope, 'tenKm');
   $scope.tenKm();
   $rootScope.distance = 10;
   $rootScope.time = 50;
   expect($scope.tenKm).toHaveBeenCalled();
   expect($scope.distance).toBe(10);
   expect($scope.time).toBe(50);
 });

 it('customGoal distance and time should be undefined', function() {
  spyOn($scope, 'customGoal');
  $scope.customGoal();
  $rootScope.distance = 1;
  $rootScope.time = 5;
  expect($scope.customGoal).toHaveBeenCalled();
  expect($scope.distance).toBe(1);
  expect($scope.time).toBe(5);
 });
});
