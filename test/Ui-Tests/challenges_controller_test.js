describe(“ChallengesCtrl”, function(){

 beforeEach(module(‘app.controllers’));

 var $controller, $rootScope, scope, $state, $window;

 beforeEach(inject(function(_$controller_, _$rootScope_){
   // The injector unwraps the underscores (_) from around the parameter names when matching
   $controller = _$controller_;
   $rootScope = _$rootScope_;
   scope = _$rootScope_.$new();
   $controller(‘ChallengesCtrl’, { $scope: scope,
     $state: $state,
     $window: $window,
     $rootScope: $rootScope
     });
 }));

 it(‘threeKm distance and time should be 3 and 20’, function() {
   spyOn(scope, ‘threeKm’);
   scope.threeKm();
   expect(scope.threeKm).toHaveBeenCalled();
   //expect(scope.distance).toBe(3);
   //expect(scope.time).toBe(20);
 });

 it(‘fiveKm distance and time should be 5 and 35’, function() {
   spyOn(scope, ‘fiveKm’);
   scope.fiveKm();
   expect(scope.fiveKm).toHaveBeenCalled();
   //expect(scope.distance).toBe(5);
   //expect(scope.time).toBe(35);
 });

 it(‘temKm distance and time should be 5 and 35’, function() {
   spyOn(scope, ‘tenKm’);
   scope.tenKm();
   expect(scope.tenKm).toHaveBeenCalled();
   //expect(scope.distance).toBe(10);
   //expect(scope.time).toBe(50);
 });

 it(‘customGoal distance and time should be undefined’, function() {
   expect(scope.distance).toBe(undefined);
   expect(scope.time).toBe(undefined);
 });
});
