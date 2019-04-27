
describe("Calendar Controller", function(){

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

  var CalendarCtrl;
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
    CalendarCtrl = $controller('CalendarCtrl',{
      $scope:$scope,
      $state: _$state_
    });
  }));

  it('Test of Previous function', function(){

    //Mocking User
    var userMock = {
      'username': 'Test1',
      'email':'test@gmail.com',
      'age': '21',
      'weight': '65',
      'height': '1.8',
      'gender':'Male',
      'activity':'Very active',
      'uid':'1Kqk6qtIlNZUOmwyCtxRoH9yLC23'
    };

    window.sessionStorage.setItem('currentUser',JSON.stringify(userMock));
    //Mocking Day;
    var today=new Date();
    expect($scope.month).toEqual($scope.months[today.getMonth()]);
    expect($scope.year).toEqual(today.getFullYear());
    $scope.previous();
    expect($scope.month).toEqual('March');
    $scope.previous();
    expect($scope.month).toEqual('February');
    $scope.previous();
    expect($scope.month).toEqual('January');
    $scope.previous();
    expect($scope.month).toEqual('December');
    expect($scope.year).toEqual(today.getFullYear()-1);

  });

  it('Test of Next function', function(){

    //Mocking User
    var userMock = {
      'username': 'Test1',
      'email':'test@gmail.com',
      'age': '21',
      'weight': '65',
      'height': '1.8',
      'gender':'Male',
      'activity':'Very active',
      'uid':'1Kqk6qtIlNZUOmwyCtxRoH9yLC23'
    };

    window.sessionStorage.setItem('currentUser',JSON.stringify(userMock));
    //Mocking Day;
    var today=new Date();
    expect($scope.month).toEqual($scope.months[today.getMonth()]);
    expect($scope.year).toEqual(today.getFullYear());
    $scope.next();
    expect($scope.month).toEqual('May');
    $scope.next();
    expect($scope.month).toEqual('June');
    $scope.next();
    expect($scope.month).toEqual('July');

    $scope.month='December';
    $scope.next();
    expect($scope.month).toEqual('January');
    expect($scope.year).toEqual(today.getFullYear()+1);

  });

  it('Test of addEvent function',function(){
    this.$state.expectedTransitions.push('app.createEvent');
    $scope.addEvent();
  });

});
