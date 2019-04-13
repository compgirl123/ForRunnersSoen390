
describe("FoodInfo Tests", function(){

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

  var FoodInfoCtrl;
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

  beforeEach(function () {
    var store = {};

    spyOn(window.sessionStorage, 'getItem').and.callFake(function (key) {
      return store[key];
    });
    spyOn(window.sessionStorage, 'setItem').and.callFake(function (key, value) {
      return store[key] = value + '';
    });
    spyOn(window.sessionStorage, 'clear').and.callFake(function () {
        store = {};
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
    FoodInfoCtrl = $controller('FoodInfoCtrl',{
      $scope:$scope,
      $state: _$state_,
      $window: $window
    });
  }));

  it('Test of change function', function(){
    $scope.food={'amount':4};
    $scope.localAmount=1;
    $scope.localCalories=60;
    var calories=$scope.change();
    expect(calories).toEqual(240);
  });

  it('Test of addToList function', function(){
    this.$state.expectedTransitions.push('app.food');
    $scope.food={'name':"Strawberries",'calories':47,
      'amount':1,'unit': "cup (144g)"};
    var  foodTestArray = [];
    foodTestArray.push($scope.food);
    var value ={'currentCalories':$scope.food.calories,'list':[$scope.food]};
    $scope.addToList();
    expect(window.sessionStorage.getItem).toHaveBeenCalledWith('foodList');
    expect(window.sessionStorage.setItem).toHaveBeenCalledWith('foodList',JSON.stringify(value));
    var storageValue=JSON.parse(window.sessionStorage.getItem('foodList'));
    expect(storageValue).toEqual(value);
    $scope.food={'name':"Cheddar cheese",'calories':113,
      'amount':1,'unit': "slice (28g)"};
    foodTestArray.push($scope.food);
    console.info(value);
    var value2 ={'currentCalories':47+113,'list':foodTestArray};
    this.$state.expectedTransitions.push('app.food');
    $scope.addToList();
    expect(window.sessionStorage.getItem).toHaveBeenCalledWith('foodList');
    var storageValue2=JSON.parse(window.sessionStorage.getItem('foodList'));
    expect(storageValue2).toEqual(value2);
  });

});
