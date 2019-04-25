
describe("Sign Up Tests", function(){
  var errorCase;
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
  var RegisterCtrl, $scope, CommonProp, $window;
  var testUser = {uid:"test", username:"testName", email:"test@test.com", age:"42", weight:"125 lb", height:"6.5", gender:"male", activity:"regular"};
  // Create mocked $state.
  beforeEach(function() {
    errorCase = false;
    var self = this;
    
   
    module(function($provide) {
      // $provide.service('$window', function() {
      //   this.location = {
      //       href:"", 
      //       reload:function(){}
      //     };
      // });
      $provide.service('$ionicPopup', function() {
        this.alert = function(object){};
      });

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
    var store = {};
    
    // all spies
    spyOn(firebase, 'auth').and.returnValue(
    {
      createUserWithEmailAndPassword: function(email, password) {
        return {
          then: function(callback){
            if (errorCase){
              return {code: "test error", message: "test message"};
            }
            else{
              callback();
              return {catch: function(callback){}};
            }
          }
        }
      },
      currentUser: testUser
    });
    spyOn(firebase, 'database').and.returnValue(
      {
        ref: function(string) {
          return {
            set: function(object){}
          };
        }      
      }
    );
  });

  beforeEach(inject(function($controller, $rootScope, _$state_,_$q_, _$ionicPopup_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    var self = this;
    $scope = $rootScope.$new();
    self.$q = _$q_;
    self.$state = _$state_;
    self.$ionicPopup = _$ionicPopup_;
    RegisterCrtl = $controller('RegisterCtrl', {
      $scope: $scope,
      $state: _$state_,
      $ionicPopup: _$ionicPopup_
    });
  }));


  describe('RegisterCtrl', function() {
   
    it('Testing the signUp() function (successful login)', function() {
      $scope.query = () => {};
      $scope.user = {email:'sajeel155@yahoo.com', password:'test1234'};
     
      this.$state.expectedTransitions.push("app.login");

      $scope.signUp(firebase);
      
      expect($scope.errMsg).toBeFalsy();
    }); 

 
  });

});