
describe("Event Controller", function(){

  beforeAll(function(){
    if(!firebase.apps.length){
      firebase.initializeApp({
        apiKey: "AIzaSyCEI0nzK-GjzeRM72y92ORMQZSLxpXoYS0",
            authDomain: "forrunners-soen390-a6772.firebaseapp.com",
            databaseURL: "https://forrunners-soen390-a6772.firebaseio.com",
            projectId: "forrunners-soen390-a6772",
            storageBucket: "forrunners-soen390-a6772.appspot.com",
            messagingSenderId: "961868385218"
      });
    }

   });

  beforeEach(module('app.controllers'));

  var EventCtrl;
  var $scope;
  var $rootScope, $state, $window;

  // Create mocked $state.
  beforeEach(function() {

      var self = this;

      module(function($provide) {
        $provide.service('$state', function() {

          this.expectedTransitions = [];
          this.current = {};
          this.params = {};
          this.transitionTo = function(stateName, params) {

            if (this.expectedTransitions.length > 0) {
              var expectedState = this.expectedTransitions.shift();
              if (expectedState !== stateName) {
                throw Error('Expected transition to state: ' + expectedState + ' but transitioned to ' + stateName);
              }
            } else {
              throw Error('No more transitions were expected! Tried to transition to ' + stateName);
            }
            this.current.name = stateName;
            this.params = params || {};
            return self.$q.resolve();
          };
          this.go = this.transitionTo;
          this.expectTransitionTo = function(stateName) {
            this.expectedTransitions.push(stateName);
          };

          this.ensureAllTransitionsHappened = function() {
            if (this.expectedTransitions.length > 0) {
              throw Error('Not all transitions happened!');
            }
          };

        });
      });
    });

  beforeEach(inject(function($controller, $rootScope,_$state_,_$q_){
    var self = this;
    $scope = $rootScope.$new();
    self.$q = _$q_;
    self.$state = _$state_;
    self.params = {};
    self.$transition$ = {
          params: function() {
              return self.params;
            }
          };
    EventCtrl = $controller('EventCtrl',{
      $scope:$scope,
      $state: _$state_,
      $window: $window
    });
  }));

  it('Test of changeStart function with no errors', function(){
      $scope.changeStart();
      expect($scope.startError).toEqual(false);
      expect($scope.endError).toEqual(false);
  });

  it('Test of changeStart function with errors', function(){
      $scope.eventStartTime = 10;
      $scope.eventEndTime   = 5;
      $scope.changeStart();
      expect($scope.startError).toEqual(true);
  });

  it('Test of changeEnd function with no errors', function(){
      $scope.changeEnd();
      expect($scope.endError).toEqual(false);
      expect($scope.startError).toEqual(false);
  });

  it('Test of changeEnd function with errors', function(){
      $scope.eventStartTime = 10;
      $scope.eventEndTime   = 5;
      $scope.changeEnd();
      expect($scope.endError).toEqual(true);
  });

});
