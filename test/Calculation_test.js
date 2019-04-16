
describe("Calculation Controller", function(){

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

  var CalculationCtrl;
  var $scope;
  var $rootScope, $state;

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
    CalculationCtrl = $controller('CalculationCtrl',{
      $scope:$scope,
      $state: _$state_
    });
  }));

  it('Test of calculate without mocking', function(){

    //sometimes window.storage keep items from previous test
    if(window.sessionStorage.getItem('currentUser')!=null &&
       window.sessionStorage.getItem('foodList')!=null){
         window.sessionStorage.removeItem('currentUser');
         window.sessionStorage.removeItem('foodList');
         expect(window.sessionStorage.getItem('currentUser')).toEqual(null);
         expect(window.sessionStorage.getItem('foodList')).toEqual(null);
       }else{
         if(window.sessionStorage.getItem('currentUser') &&
            window.sessionStorage.getItem('foodList')){
              expect(window.sessionStorage.getItem('currentUser')).toEqual(undefined);
              expect(window.sessionStorage.getItem('foodList')).toEqual(undefined);
            }
       }
    var response=$scope.calculate();
    expect(response).toEqual(false);
  });

  it('Testing calculate when less calories are consumed', function(){
    //Mocking User
    var userMock = {
      'username': 'Test1',
      'email':'test@gmail.com',
      'age': '21',
      'weight': '65',
      'height': '1.8',
      'gender':'Male',
      'activity':'Very active'};

    var food1={'name':"Strawberries",'calories':47,
      'amount':1,'unit': "cup (144g)"};
    var food2={'name':"Cheddar cheese",'calories':113,
      'amount':1,'unit': "slice (28g)"};
    var  foodTestArray = [];
    foodTestArray.push(food1);
    foodTestArray.push(food2);
    var listMock= {'currentCalories':47+113,'list':foodTestArray};
    window.sessionStorage.setItem('currentUser',JSON.stringify(userMock));
    window.sessionStorage.setItem('foodList',JSON.stringify(listMock));
    var response=$scope.calculate();
    expect(response).toEqual(true);
  });

  it('Testing calculate when more calories are consumed', function(){
    //Mocking User
    var userMock = {
      'username': 'Test1',
      'email':'test@gmail.com',
      'age': '18',
      'weight': '65',
      'height': '1.8',
      'gender':'Female',
      'activity':'Little/ no exercise'};

    var food1={'name':"Strawberries",'calories':940,
      'amount':20,'unit': "cup (144g)"};
    var food2={'name':"Cheddar cheese",'calories':1695,
      'amount':15,'unit': "slice (28g)"};
    var  foodTestArray = [];
    foodTestArray.push(food1);
    foodTestArray.push(food2);
    var listMock= {'currentCalories':940+1695,'list':foodTestArray};
    window.sessionStorage.setItem('currentUser',JSON.stringify(userMock));
    window.sessionStorage.setItem('foodList',JSON.stringify(listMock));
    var response=$scope.calculate();
    expect(response).toEqual(1.3);
  });

});
