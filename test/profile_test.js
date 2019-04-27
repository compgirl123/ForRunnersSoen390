describe("Profile Tests", function(){
  var ref = {update: function(object){}};
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
  var ProfileCtrl, $scope, CommonProp, $window;
  var testUser = {uid:"test", username:"testName", email:"test@test.com", age:"42", weight:"125 lb", height:"6.5", gender:"male", activity:"regular"};
  // Create mocked $state.
  beforeEach(function() {
    errorCase = false;
    var self = this;
    
    
   
    module(function($provide) {
      var store = {};
      spyOn(sessionStorage, 'setItem').and.callFake(function (key, value) {
        return store[key] = value + '';
      });
      spyOn(firebase, 'auth').and.returnValue(
      {
        currentUser: testUser
      });
      spyOn(ref, 'update');
      spyOn(firebase, 'database').and.returnValue(
        {   
          ref: function(string) {
            return ref;
          }
        }
      );
    });
  });

  beforeEach(inject(function($controller, $rootScope){
    var self = this;
    $scope = $rootScope.$new();

    LoginCtrl = $controller('ProfileCtrl', {
      $scope: $scope,
    });
  }));


  describe('ProfileCtrl', function() {
    it('Testing the change() function', function() {
      $scope.user = testUser;

      $scope.change(firebase);
      
      expect(sessionStorage.setItem).toHaveBeenCalledWith('currentUser','{"uid":"test","username":"testName","email":"test@test.com","age":"42","weight":"125 lb","height":"6.5","gender":"male","activity":"regular"}');
      expect(ref.update).toHaveBeenCalledWith({age: $scope.user.age});
      expect(ref.update).toHaveBeenCalledWith({weight: $scope.user.weight});
      expect(ref.update).toHaveBeenCalledWith({height: $scope.user.height});
      expect(ref.update).toHaveBeenCalledWith({gender: $scope.user.gender});
      expect(ref.update).toHaveBeenCalledWith({activity: $scope.user.activity});
    }); 
  });
});
