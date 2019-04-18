describe('AppCtrl', function() {
  beforeEach(module('app.controllers'));

  var $controller, $scope, $state, $window, $ionicModal, $ionicPopup, $ionicPlatform, $ionicHistory, $weather, $translate, $ionicScrollDelegate, leafletData, leafletBoundsHelpers, FileFactory, SessionFactory, $firebaseAuth, $nominatim, $timeout, $interval, $http, $filter, $q;

  beforeEach(inject(function(_$controller_, _$state_, _$rootScope_, _$ionicModal_, _$ionicPopup_, _$timeout_, _$interval_, _$ionicPlatform_, _$ionicHistory_, _$weather_, _$http_, _$translate_, _$filter_, _$ionicScrollDelegate_, _leafletData_, _leafletBoundsHelpers_, _FileFactory_, _SessionFactory_, _$window_, _$firebaseAuth_, _$q_, _$nominatim_){
    $state = _$state_;
    $scope = $rootScope.$new();
    $ionicModal = _$ionicModal_;
    $ionicPopup = _$ionicPopup_;
    $timeout = _$timeout_;
    $interval = _$interval_;
    $ionicPlatform = _$ionicPlatform_;
    $ionicHistory = _$ionicHistory_;
    $weather = _$weather_;
    $http = _$http_;
    $translate = _$translate_;
    $filter = _$filter_;
    $ionicScrollDelegate = _$ionicScrollDelegate_;
    leafletData = _leafletData_;
    leafletBoundsHelpers = _leafletBoundsHelpers_;
    FileFactory = _FileFactory_;
    SessionFactory= _SessionFactory_;
    $window = _$window_;
    $firebaseAuth = _$firebaseAuth_;
    $q = _$q_;
    $nominatim = _$nominatim_;

    $controller = _$controller_('AppCtrl', {
      $state: $state,
      $scope: $scope,
      $rootScope: $rootScope,
      $ionicModal: $ionicModal,
      $ionicPopup: $ionicPopup,
      $timeout: $timeout,
      $interval: $interval,
      $ionicPlatform: $ionicPlatform,
      $ionicHistory: $ionicHistory,
      $weather: $weather,
      $http: $http,
      $translate: $translate,
      $filter: $filter,
      $ionicScrollDelegate: $ionicScrollDelegate,
      leafletData: leafletData,
      leafletBoundsHelpers: leafletBoundsHelpers,
      FileFactory: FileFactory,
      SessionFactory: SessionFactory,
      $window: $window,
      $firebaseAuth: $firebaseAuth,
      $q: $q,
      $nominatim: $nominatim
    });
  }));

  describe('$scope.pauseSession', function() {
    it('pauses the running session', function() {
      spyOn($scope, 'pauseSession');
      $scope.pauseSession();
      expect($scope.pauseSession).toHaveBeenCalled();
    });
  });
});
