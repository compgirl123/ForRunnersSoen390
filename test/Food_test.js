
describe("Food Tests", function(){

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

  var FoodCtrl;
  var $scope;
  var $rootScope, $state, $window,$ionicPopup;

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
    FoodCtrl = $controller('FoodCtrl',{
      $scope:$scope,
      $ionicPopup: $ionicPopup,
      $state: _$state_,
      $window: $window
    });
  }));

  it('Test of foodDetails function', function(){
    var food={'name': 'potato','amount':'100','calories': '77','unit': 'g'};
    this.$state.expectedTransitions.push('app.foodInfo');
    $scope.foodDetails(food);
    expect(window.sessionStorage.getItem('currentFood')).toEqual(JSON.stringify(food));
  });

  it('Test of addFood function', function(){
    this.$state.expectedTransitions.push('app.newFood');
    $scope.addFood();
  });

  it('Test of change function',function(){
    $scope.makeFoodList();
    expect($scope.foods).not.toBe(null);
    var rootRef = firebase.database().ref("Foods").orderByKey();
    rootRef.once("value",function(snapshot) {
        $scope.mockedFood=[];
        snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();
        $scope.mockedFood.push(childData);
      });
    }).then(function(){
      expect($scope.foods).toBe($scope.mockedFood);
      console.info($scope.mockedFood);
      $scope.foodName="potato";
      $scope.change();
      //When food is already in the list
      expect($scope.errorMessage).toBe(true);
      $scope.foodName="newFoodName";
      $scope.change();
      //When food is not in the list
      expect($scope.errorMessage).toBe(false);
    });
  });

  it('Test of save function', function(){
    this.$state.expectedTransitions.push('app.food');
    $scope.foodName="Strawberries";
    $scope.calories=47;
    $scope.amount=1;
    $scope.unit="cup (144g)";
    var moockedfood={'name':$scope.foodName,'calories':$scope.calories,
      'amount':$scope.amount,'unit': $scope.unit};
    var newFood=$scope.save();
    expect(newFood).toEqual(moockedfood);
  });


});
