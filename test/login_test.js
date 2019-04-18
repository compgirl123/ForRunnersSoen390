
describe("Login In Tests", function(){
 
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
  // Create mocked $state.
  beforeEach(function() {
    
    var self = this;

    module(function($provide) {
      // mock firebase object
      $provide.service('firebase', function() {
        this.auth = function() {
          return {
            signInWithEmailAndPassword: function(email, password) {},
            onAuthStateChanged: function(key) {},
            database: function(){
              return {
                ref: function(string) {
                  return {
                    once: function(string){
                      return Promise({val: "value"});
                    }
                  };
                }
              };
            }
          };
        }
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
  });

  // Set spies
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
  
  
  
  

  beforeEach(inject(function($controller, $rootScope, _$state_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    var self = this;
    CommonProp = {};
    CommonProp.getUserId = () => {};
    CommonProp.logoutUser = () => {};
    $scope = $rootScope.$new();
    self.$state = _$state_;
    self.$CommonProp = CommonProp;
    LoginCtrl = $controller('LoginCtrl', {
      $scope: $scope,
      $state: _$state_,
      CommonProp: CommonProp,
      $window: $window,
    });
  }));


  describe('LoginCtrl', function() {
    // Added positive test with properly formatted elements
    it('Testing the signIn() function (successful login)', function() {
      
      $scope.query = () => {};
      
      
      $scope.user = {email:'sajeel155@yahoo.com', password:'test1234'};
     
      
      
  
      $scope.signIn();

      
      var value = {'username': 'sajeel', 'email': $scope.user.email,'age': '55', 'weight': '29', 'height': '2.6', 'gender':'Male'};
      
    }); 
  });

});
 