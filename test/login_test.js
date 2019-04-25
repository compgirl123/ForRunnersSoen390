
describe("Login In Tests", function(){
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
  var LoginCtrl, $scope, CommonProp, $window;
  var testUser = {uid:"test", username:"testName", email:"test@test.com", age:"42", weight:"125 lb", height:"6.5", gender:"male", activity:"regular"};
  // Create mocked $state.
  beforeEach(function() {
    errorCase = false;
    var self = this;
    
   
    module(function($provide) {
      $provide.service('$window', function() {
        this.location = {
            href:"", 
            reload:function(){}
          };
      });

      $provide.service('$state', function() {
        this.reload = function(){};
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
    spyOn(sessionStorage, 'setItem').and.callFake(function (key, value) {
      return store[key] = value + '';
    });
    spyOn(sessionStorage, 'removeItem').and.callFake(function (key, value) {
      return store[key] = value + '';
    });
    spyOn(sessionStorage, 'clear').and.callFake(function () {
        store = {};
    });

    spyOn(firebase, 'auth').and.returnValue(
    {
        signInWithEmailAndPassword: function(email, password) {
          return {catch: function(callback){
            if (errorCase)
              callback({code: "test error", message: "test message"});
          }}
        },
        onAuthStateChanged: function(callback) {
          callback(testUser);
        },
        
    });
    spyOn(firebase, 'database').and.returnValue(
      {   
        ref: function(string) {
          return {
            once: function(strng){
              return {then: function(callback){
                callback({val: function(){return testUser;}});
              }}
            }
          };
        }
      }
    );
  });

  beforeEach(inject(function($controller, $rootScope, _$state_,_$q_, _$window_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    var self = this;
    CommonProp = {};
    CommonProp.getUserId = () => {};
    CommonProp.logoutUser = () => {};
    $scope = $rootScope.$new();
    self.$q = _$q_;
    self.$state = _$state_;
    self.$CommonProp = CommonProp;
    self.$window = _$window_;
    LoginCtrl = $controller('LoginCtrl', {
      $scope: $scope,
      $state: _$state_,
      CommonProp: CommonProp,
      $window: _$window_,
    });
  }));


  describe('LoginCtrl', function() {
    // Added positive test with properly formatted elements
    it('Testing the signIn() function (successful login)', function() {
      $scope.query = () => {};
      $scope.user = {email:'sajeel155@yahoo.com', password:'test1234'};
     
      this.$state.expectedTransitions.push("app.profile");

      $scope.signIn(firebase);
      
      expect($scope.errMsg).toBeFalsy();
      
      expect(sessionStorage.setItem).toHaveBeenCalledWith('currentUser','{"username":"testName","email":"test@test.com","age":"42","weight":"125 lb","height":"6.5","gender":"male","activity":"regular"}');
    }); 

    it('Testing the signIn() function (error message)', function() {
      errorCase = true;
      $scope.query = () => {};
      $scope.user = {email:'sajeel155@yahoo.com', password:'test1234'};
     
      this.$state.expectedTransitions.push("app.profile");

      $scope.signIn(firebase);
      
      expect($scope.errMsg).toBeTruthy();
      expect($scope.errorMessage).toBe("test message");
    }); 

    it('Testing the signout() function', function() {
      errorCase = true;
      $scope.query = () => {};
      $scope.user = {email:'sajeel155@yahoo.com', password:'test1234'};
     
      this.$state.expectedTransitions.push("app.profile");

      $scope.signout();
      
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('currentUser');
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('currentFood');
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('foodList');
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('selectedDay');
      expect(this.$window.location.href).toBe("#/app/login","The logout does not redirects to the login page");
    }); 
  });

});
 