describe("Dashboard Tests", function(){
  
    beforeEach(module('app.controllers'));
  
    var $controller, $rootScope, $scope, $state, $window;

    beforeEach(inject(function(_$controller_, _$rootScope_){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      
      $controller = _$controller_;
      $rootScope = _$rootScope_;
    }));
  
  
    describe('DashboardCtrl', function() {
      it('Expecting the getvalues() function to show challenge is failed', function() {
        var $scope = $rootScope.$new();
        $scope.getvalues = () => {}
        var controller = $controller('DashboardCtrl', 
        { $scope: $scope,
          $window = $window
        });


        $scope.getvalues.challengeStarted = false;
        $scope.getvalues.actual_time = "0:15:00";
        $scope.getvalues.target_time = 20;
        $scope.getvalues.target_distance = 3;
        $scope.getvalues.actual_distance = 1.5;
        $scope.getvalues();
        spyOn($window, 'getvalues').andCallThrough();
        expect(spy).toHaveBeenCalled();
        expect(getvalues.progress).toEqual(50);
        expect(getvalues.calculator).toEqual(180);
        expect(getvalues.status).toEqual("failed");
        expect(getvalues.session.bar).toEqual(1);

      });
      it('Expecting the getvalues() function to show challenge is passed', function() {
        var $scope = $rootScope.$new();
        $scope.getvalues = () => {}
        var controller = $controller('DashboardCtrl', 
        { $scope: $scope,
          $window = $window
        });


        $scope.getvalues.challengeStarted = false;
        $scope.getvalues.actual_time = "0:15:00";
        $scope.getvalues.target_time = 20;
        $scope.getvalues.target_distance = 3;
        $scope.getvalues.actual_distance = 3;
        $scope.getvalues();
        spyOn($window, 'getvalues').andCallThrough();
        expect(spy).toHaveBeenCalled();
        expect(getvalues.progress).toEqual(100);
        expect(getvalues.calculator).toEqual(360);
        expect(getvalues.status).toEqual("passed");
        expect(getvalues.session.bar).toEqual(1);
        expect(getvalues.gotocongratulations).toHaveBeenCalled();
      });
      
    });
    
  });

