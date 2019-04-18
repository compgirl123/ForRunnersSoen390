/* 
describe("Profile Tests", function(){
  
  beforeAll(function(){
    firebase.initializeApp({
      apiKey: "AIzaSyCEI0nzK-GjzeRM72y92ORMQZSLxpXoYS0",
          authDomain: "forrunners-soen390-a6772.firebaseapp.com",
          databaseURL: "https://forrunners-soen390-a6772.firebaseio.com",
          projectId: "forrunners-soen390-a6772",
          storageBucket: "forrunners-soen390-a6772.appspot.com",
          messagingSenderId: "961868385218"
    });
   });

  beforeEach(module('app.controllers'));

  var $controller, $rootScope, $scope, $firebaseAuth, $state, $window, $firebaseObject;
  

  beforeEach(inject(function(_$controller_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    
    $controller = _$controller_;
    $rootScope = _$rootScope_;
  }));


  describe('ProfileCtrl', function() {
    it('Testing change function', function() {
      var $scope = $rootScope.$new();
      $controller = $controller('ProfileCtrl', { $scope: $scope,
        $firebaseAuth: $firebaseAuth,
        $state: $state,
        $firebaseObject: $firebaseObject,
        $window: $window
       });
      
      $scope.genders=["Male","Female"];
      $scope.activity=["Little/ no exercise","Moderately active","Very active"];
      // create a variable 
      //sessionStorage = spyOn(sessionStorage, 'setItem').and.callFake((arg) => {return "key:currentUser"})
      //expect(sessionStorage).toHaveBeenCalledWith(['currentUser', {"key": "currentUser"}])
      //expect($scope.count).toEqual(1);

      spyOn(window.sessionStorage, 'getItem');
      $scope.user = {'username': 'Test1','email':'test@gmail.com','age': '21','weight': '65', 'height': '1.8','gender':'Male','activity':'Very active'}
      window.sessionStorage.getItem('currentUser');
      
      expect(window.sessionStorage.getItem).toHaveBeenCalledWith('currentUser');
      expect(window.sessionStorage.getItem).not.toBe(null);

    });
  });
  
}); */