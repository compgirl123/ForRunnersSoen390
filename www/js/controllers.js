angular
  .module("app.controllers", [])

  .filter("ldate", function() {
    "use strict";
    return function(date) {
      return moment(date).format("llll");
    };
  })

  .filter("duration", function() {
    "use strict";
    return function(date) {
      return moment(date).format("HH:mm");
    };
  })

  .filter("translatei18", function($filter) {
    "use strict";
    return function(text) {
      return $filter("translate")(text.replace("-", ""));
    };
  })

  .directive("navBarClass", function() {
    "use strict";
    return {
      restrict: "A",
      compile: function(element, attrs) {
        // We need to be able to add a class the cached nav-bar
        // Which provides the background color
        var cachedNavBar = document.querySelector(
          '.nav-bar-block[nav-bar="cached"]'
        );
        var cachedHeaderBar = cachedNavBar.querySelector(".bar-header");

        // And also the active nav-bar
        // which provides the right class for the title
        var activeNavBar = document.querySelector(
          '.nav-bar-block[nav-bar="active"]'
        );
        var activeHeaderBar = activeNavBar.querySelector(".bar-header");
        var barClass = attrs.navBarClass;
        var ogColors = [];
        var colors = [
          "positive",
          "stable",
          "light",
          "royal",
          "dark",
          "assertive",
          "calm",
          "energized"
        ];
        var cleanUp = function() {
          for (var i = 0; i < colors.length; i++) {
            var currentColor = activeHeaderBar.classLists("bar-" + colors[i]);
            if (currentColor) {
              ogColors.push("bar-" + colors[i]);
            }
            activeHeaderBar.classList.remove("bar-" + colors[i]);
            cachedHeaderBar.classList.remove("bar-" + colors[i]);
          }
        };
        return function($scope) {
          $scope.$on("$ionicView.beforeEnter", function() {
            cleanUp();
            cachedHeaderBar.classList.add(barClass);
            activeHeaderBar.classList.add(barClass);
          });

          $scope.$on("$stateChangeStart", function() {
            for (var j = 0; j < ogColors.length; j++) {
              activeHeaderBar.classList.add(ogColors[j]);
              cachedHeaderBar.classList.add(ogColors[j]);
            }
            cachedHeaderBar.classList.remove(barClass);
            activeHeaderBar.classList.remove(barClass);
            ogColors = [];
          });
        };
      }
    };
  })

  .controller('PasswordController', function PasswordController($scope) {
    $scope.password = '';
    $scope.grade = function() {
      var size = $scope.password.length;
      if (size > 8) {
        $scope.strength = 'strong';
      } else if (size > 3) {
        $scope.strength = 'medium';
      } else {
        $scope.strength = 'weak';
      }
    };
  })

  .controller("AppCtrl", function(
    $state,
    $scope,
    $rootScope,
    $ionicModal,
    $ionicPopup,
    $timeout,
    $interval,
    $ionicPlatform,
    $ionicHistory,
    $weather,
    $http,
    $translate,
    $filter,
    $ionicScrollDelegate,
    leafletData,
    leafletBoundsHelpers,
    FileFactory,
    SessionFactory,
    $window,
    $firebaseAuth,
    $q,
    $nominatim
  ) {
    "use strict";

    try {
      cordova.getAppVersion.getVersionNumber().then(function(version) {
        $scope._version = version;
      });
    } catch (err) {
      console.error("Version Plugin Missing!");
    }

    try {
      $scope.platform = window.device.platform;

      if ($scope.platform === "iOS") {
        $scope.dataPath = cordova.file.documentsDirectory;
      } else {
        $scope.dataPath = cordova.file.externalApplicationStorageDirectory;
      }

      $scope.android_version = window.device.version.toLowerCase();
      if ($scope.platform === "android") {
        if (parseInt(window.device.version) < 5) {
          $scope.platform = "oldandroid";
        }
      }
    } catch (err) {
      $scope.platform = "Browser";
      console.warn(err);
    }
    $scope.weather = $weather;
    $scope.nominatim = $nominatim;

    try {
      window.plugins.intent.getCordovaIntent(
        function(intent) {
          console.debug(intent);
        },
        function() {}
      );
    } catch (err) {
      console.warn(err);
    }
    $scope.running = false;
    $scope.fullyLoaded = false;
    $scope.prefs = {};

    $scope.prefs.minrecordingaccuracy = 14;

    $scope.prefs.minrecordinggap = 100;
    $scope.prefs.unit = "kms";
    $scope.prefs.first_run = true;
    $scope.prefs.timevocalannounce = true;
    $scope.prefs.distvocalannounce = true;
    $scope.prefs.avgpacevocalannounce = true;
    $scope.prefs.avgspeedvocalannounce = true;
    $scope.prefs.language = "English";
    try {
      navigator.globalization.getPreferredLanguage(
        function(language) {
          $scope.prefs.language = language.value;
          console.log("Prefered language: " + $scope.prefs.language);
        },
        function() {
          console.error("Error getting language\n");
        }
      );
    } catch (err) {
      console.info("Globalization module probably not available: " + err);
    }

    try {
      cordova.plugins.backgroundMode.on("activate", function() {
        cordova.plugins.backgroundMode.disableWebViewOptimizations();
      });
    } catch (err) {
      console.error("cordova.plugins.backgroundMode:" + err);
    }

    $scope.prefs.heartrateannounce = false;
    $scope.prefs.gpslostannounce = true;

    $scope.prefs.delay = 10 * 1000;
    $scope.prefs.usedelay = true;
    $scope.prefs.debug = false;
    $scope.prefs.keepscreenon = true;

    $scope.prefs.togglemusic = true;
    $scope.prefs.distvocalinterval = 0; //en km (0 == None)
    $scope.prefs.timevocalinterval = 5; //en minutes
    $scope.prefs.timefastvocalinterval = 0; //en minutes
    $scope.prefs.timeslowvocalinterval = 0; //en minutes

    $scope.prefs.heartratemax = 190;
    $scope.prefs.heartratemin = 80;
    $scope.prefs.registeredBLE = {};

    $scope.prefs.usegoogleelevationapi = false;
    $scope.bluetooth_scanning = false;

    $scope.equipments = [];

    if(sessionStorage.getItem("currentUser")!=null){
        $scope.isLogged=true;
      }else{
        $scope.isLogged=false;
      }

    $scope.dateTimeReviver = function(key, value) {
      if (key === "duration" || key === "pace") {
        if (typeof value === "string") {
          return new Date(value);
        }
      }
      return value;
    };

    $scope.parseFloatOr = function(shouldbefloat) {
      if (!shouldbefloat) {
        return 0;
      } else {
        try {
          return parseFloat(shouldbefloat);
        } catch (err) {
          console.info("shouldbefloat:" + err);
          return 0.0;
        }
      }
    };

    $scope.computeKalmanLatLng = function(datas) {
      var Q_metres_per_second = 3;
      var TimeStamp_milliseconds;
      var tinc;
      var lat;
      var lng;
      var newlat;
      var newlng;
      var variance = -1; // P matrix.  Negative means object uninitialised.  NB: units irrelevant, as long as same units used throughout
      var K;
      var accuracy;
      var kalmanEle = new KalmanFilter(0.2, 3, 10);

      return datas.map(function(item, idx) {
        accuracy = $scope.parseFloatOr(item[5]);
        newlat = parseFloat(item[0]);
        newlng = parseFloat(item[1]);
        if (accuracy < 1) {
          accuracy = 1;
        }
        if (variance < 0) {
          TimeStamp_milliseconds = new Date(item[2]).getMilliseconds();
          lat = newlat;
          lng = newlng;
          variance = accuracy * accuracy;
        } else {
          tinc = new Date(item[2]).getMilliseconds() - TimeStamp_milliseconds;
          if (tinc > 0) {
            variance += tinc * Q_metres_per_second * Q_metres_per_second / 1000;
            TimeStamp_milliseconds = new Date(item[2]).getMilliseconds();
          }
          K = variance / (variance + accuracy * accuracy);
          lat += K * (newlat - lat);
          lng += K * (newlng - lng);
          variance = (1 - K) * variance * Q_metres_per_second;
        }

        if (isNaN(item[3]) && idx - 1 > 0) {
          item[3] = datas[idx - 1][3];
        }

        return {
          lat: lat,
          lng: lng,
          timestamp: item[2],
          ele: kalmanEle.update($scope.parseFloatOr(item[3]))[0],
          hr: $scope.parseFloatOr(item[4]),
          accuracy: $scope.parseFloatOr(item[5]),
          cadence: $scope.parseFloatOr(item[6]),
          power: $scope.parseFloatOr(item[7]),
          stryde: $scope.parseFloatOr(item[8])
        };
      });
    };

    $scope.computeSessionSimplifyAndFixElevation = function(asession, doSave) {
      var gpx_path = [];
      var gpxPoints = [];

      if (
        asession.nottracked === true ||
        asession.gpxData === undefined ||
        asession.gpxData.length == 0
      ) {
        //Manually edited session we cant recompute them
        asession.nottracked = true;
        return asession;
      }

      gpxPoints = simplifyGPX(
        $scope.computeKalmanLatLng(asession.gpxData),
        0.00002
      );

      //Do it before and talk after
      //Thats here for preventing waiting too long an answer which could be
      //long to get on slow mobile network and so the session is displayed
      //with a 0 km run
      asession = $scope.computeSessionFromGPXPoints(
        asession,
        gpxPoints,
        doSave
      );

      console.log(
        "test scope.prefs.usegoogleelevationapi:" +
          $scope.prefs.usegoogleelevationapi
      );
      if ($scope.prefs.usegoogleelevationapi === true) {
        console.log("scope.prefs.usegoogleelevationapi");
        gpx_path = gpxPoints.map(function(item) {
          return [item.lat, item.lng];
        });

        var gpx_paths = [];
        var i,
          j,
          chunk = 100;
        for (i = 0, j = gpx_path.length; i < j; i += chunk) {
          gpx_paths.push(gpx_path.slice(i, i + chunk));
        }
        var encpaths = gpx_paths.map(function(path) {
          return L.polyline(path).encodePath();
        });
        //console.log(encpaths);
        encpaths.map(function(encpath, encidx) {
          $http({
            url:
              "https://maps.googleapis.com/maps/api/elevation/json?key=AIzaSyCIxn6gS4TePkbl7Pdu49JHoMR6POMafdg&locations=enc:" +
              encpath,
            method: "GET"
          }).then(
            function(response) {
              if (response.data.status === "OK") {
                for (var idx = 0; idx < response.data.results.length; idx++) {
                  gpxPoints[encidx * 100 + idx].ele =
                    response.data.results[idx].elevation;
                }
                if (encidx === encpaths.length - 1) {
                  asession.fixedElevation = true;
                  asession = $scope.computeSessionFromGPXPoints(
                    asession,
                    gpxPoints,
                    doSave
                  );
                }
              } else {
                console.log("Can t retrieve data from google elevation api");
              }
            },
            function(error) {
              console.log(error);
            }
          );
        });
      }

      return asession;
    };

    $scope.computeSessionFromGPXData = function(asession, doSave) {
      return $scope.computeSessionSimplifyAndFixElevation(asession, doSave);
    };

    $scope.recomputeEverythings = function() {
      $scope.sessionsIndex = undefined;
      $scope.sessionsIndexLength = 0;
      $scope.sortedSessionsIndex = undefined;
      $scope.loadAllJsonSessions($scope.dataPath).then(function(fullyLoaded) {
        for (var recid in $scope.sessions) {
          if ($scope.sessions.hasOwnProperty(recid)) {
            $scope.computeSessionFromGPXData($scope.sessions[recid], true);
          }
        }
        $ionicPopup.alert({
          title: $scope.translateFilter("_recompute_end_title"),
          template: $scope.translateFilter("_recompute_end_text")
        });
      });
    };

    $scope.computeSessionFromGPXPoints = function(session, gpxPoints, doSave) {
      console.debug("computeSessionFromGPXPoints");
      var hrZ1 =
        parseInt($scope.prefs.heartratemin) +
        parseInt($scope.prefs.heartratemax - $scope.prefs.heartratemin) * 0.6;
      var hrZ2 =
        parseInt($scope.prefs.heartratemin) +
        parseInt($scope.prefs.heartratemax - $scope.prefs.heartratemin) * 0.7;
      var hrZ3 =
        parseInt($scope.prefs.heartratemin) +
        parseInt($scope.prefs.heartratemax - $scope.prefs.heartratemin) * 0.8;
      var hrZ4 =
        parseInt($scope.prefs.heartratemin) +
        parseInt($scope.prefs.heartratemax - $scope.prefs.heartratemin) * 0.9;
      var hrZ = [0, 0, 0, 0, 0];
      var hr_color = 0;
      session.hhr_colors = [
        "#dcdcdc",
        "#97BBCD",
        "#46BFBD",
        "#FDB45C",
        "#F7464A"
      ];
      session.hr_colors = [
        "rgba(220,220,220,0.5)",
        "rgba(151, 187, 205, 0.5)",
        "rgba(70, 191, 189, 0.5)",
        "rgba(253, 180, 92, 0.5)",
        "rgba(247, 70, 74, 0.5)"
      ];
      session.hhr_colors = [
        {
          fillColor: "rgba(220,220,220,0.5)",
          strokeColor: "rgba(220,220,220,0.7)"
        },
        {
          fillColor: "rgba(151, 187, 205, 0.5)",
          strokeColor: "rgba(151, 187, 205, 0.7)"
        },
        {
          fillColor: "rgba(70, 191, 189, 0.5)",
          strokeColor: "rgba(70, 191, 189, 0.7)"
        },
        {
          fillColor: "rgba(253, 180, 92, 0.5)",
          strokeColor: "rgba(253, 180, 92, 0.7)"
        },
        {
          fillColor: "rgba(247, 70, 74, 0.5",
          strokeColor: "rgba(247, 70, 74, 0.7"
        }
      ];

      //Max and min for leaflet and ele
      var minHeight = gpxPoints[0].ele;
      var maxHeight = minHeight;
      var lonMin = gpxPoints[0].lng;
      var lonMax = lonMin;
      var latMax = gpxPoints[0].lat;
      var latMin = latMax;
      var eleDown = 0;
      var eleUp = 0;
      var maxHeartRate = 0;

      //For calc
      var curLat = gpxPoints[0].lat;
      var curLng = gpxPoints[0].lng;
      var curDate = gpxPoints[0].timestamp;
      var curEle = gpxPoints[0].ele;
      var curHeartRate = gpxPoints[0].hr;
      var curAcc = gpxPoints[0].accuracy;
      var curCadence = gpxPoints[0].cadence;
      var curPower = gpxPoints[0].power;
      var curStryde = gpxPoints[0].stryde;

      var oldLat = curLat;
      var oldLng = curLng;
      var oldDate = curDate;
      var oldEle = curEle;

      var timeStartTmp = new Date(gpxPoints[0].timestamp);
      var timeEndTmp = 0;

      var mz = 1;
      var dTemp = 0;
      var dTotal = 0;
      var dMaxTemp = 1000; // kilometer marker
      var stepDetails = [];

      var mz2 = 1;
      var eleStartTmp = curEle;
      var heartRatesTmp = [];
      var heartRatesTmp2 = [];
      var cadenceTmp = [];
      var cadenceTmp2 = [];
      var powerTmp = [];
      var powerTmp2 = [];
      var strydeTmp = [];
      var strydeTmp2 = [];
      var dTemp2 = 0;
      var smallStepDetail = [];
      var timeStartTmp2 = new Date(gpxPoints[0].timestamp);
      var timeEndTmp2 = 0;
      var dMaxTemp2 = 250;

      var paths = {};
      paths.p1 = {
        color: "#3F51B5",
        weight: 2,
        latlngs: []
      };
      var markers = {};
      markers.s = {
        lat: curLat,
        lng: curLng,
        icon: {
          type: "div",
          className: "leaflet-circle-marker-start",
          html: "S",
          iconSize: [20, 20]
        },
        message: "S",
        draggable: false,
        opacity: 0.8
      };
      markers.e = {
        lat: gpxPoints[gpxPoints.length - 1].lat,
        lng: gpxPoints[gpxPoints.length - 1].lng,
        icon: {
          type: "div",
          className: "leaflet-circle-marker-end",
          html: "E",
          iconSize: [20, 20]
        },
        message: "S",
        draggable: false,
        opacity: 0.8
      };
      //var dists = [];
      var gpxspeedtmp;
      var gpxpacetmp;
      var timeDiff;
      var dLat;
      var dLon;
      var dLat1;
      var dLat2;
      var dtd;
      var dspeed;
      var a, c, d;
      var idx = 0;
      var dwithoutpause = 0;

      for (var p = 0; p < gpxPoints.length; p++) {
        curLat = gpxPoints[p].lat;
        curLng = gpxPoints[p].lng;
        curEle = gpxPoints[p].ele;
        curDate = gpxPoints[p].timestamp;
        curHeartRate = gpxPoints[p].hr;
        curAcc = gpxPoints[p].accuracy;
        curCadence = gpxPoints[p].cadence;
        curPower = gpxPoints[p].power;
        curStryde = gpxPoints[p].stryde;
        //Distances
        dLat = (curLat - oldLat) * Math.PI / 180;
        dLon = (curLng - oldLng) * Math.PI / 180;
        dLat1 = oldLat * Math.PI / 180;
        dLat2 = curLat * Math.PI / 180;
        a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(dLat1) *
            Math.cos(dLat1) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        d = 6371 * c;
        //Speed between this and previous point
        dtd = new Date(curDate) - new Date(oldDate);
        dspeed = Math.round(d * 100) / 100 / (dtd / 1000 / 60 / 60);

        console.log(d + ":" + curAcc);

        if (d < 0.0001) {
          console.log("stop point:" + d);
        } else {
          //Leaflet
          paths.p1.latlngs.push({
            lat: curLat,
            lng: curLng
          });
          if (curLat < latMin) {
            latMin = curLat;
          }
          if (curLat > latMax) {
            latMax = curLat;
          }
          if (curLng < lonMin) {
            lonMin = curLng;
          }
          if (curLng > lonMax) {
            lonMax = curLng;
          }

          //Max elevation
          if (curEle > maxHeight) {
            maxHeight = curEle;
          }
          if (curEle < minHeight) {
            minHeight = curEle;
          }
          if (curHeartRate > maxHeartRate) {
            {
              maxHeartRate = curHeartRate;
            }
          }

          if (p > 0) {
            //Time without same
            if (dspeed > 0.001) {
              console.log(dspeed);
              dwithoutpause += dtd;
            }

            dTotal += d;
            gpxPoints[p].dist = dTotal;

            if (curHeartRate) {
              heartRatesTmp.push(curHeartRate);
              heartRatesTmp2.push(curHeartRate);

              if (curHeartRate > hrZ4) {
                idx = 4;
              } else {
                if (curHeartRate > hrZ3) {
                  idx = 3;
                } else {
                  if (curHeartRate > hrZ2) {
                    idx = 2;
                  } else {
                    if (curHeartRate > hrZ1) {
                      idx = 1;
                    } else {
                      idx = 0;
                    }
                  }
                }
              }
              hrZ[idx] += dtd / 60000;
            }

            if (curPower) {
              powerTmp.push(curPower);
              powerTmp2.push(curPower);
            }

            if (curCadence) {
              cadenceTmp.push(curCadence);
              cadenceTmp2.push(curCadence);
            }

            if (curStryde) {
              strydeTmp.push(curStryde);
              strydeTmp2.push(curStryde);
            }

            dTemp += d * 1000;
            if ((dTotal - (mz - 1)) * 1000 >= dMaxTemp) {
              markers[mz] = {
                lat: curLat,
                lng: curLng,
                icon: {
                  type: "div",
                  className: "leaflet-circle-marker",
                  html: mz,
                  iconSize: [20, 20]
                },
                message: mz + " Km(s)",
                draggable: false,
                opacity: 0.8
              };
              timeEndTmp = new Date(gpxPoints[p].timestamp);
              timeDiff = timeEndTmp - timeStartTmp;
              gpxpacetmp = timeDiff / (dTemp / 1000);
              gpxpacetmp = Math.round(gpxpacetmp * 100) / 100 * 1;
              gpxspeedtmp =
                Math.round(dTemp / 1000 * 100) /
                100 /
                (timeDiff / 1000 / 60 / 60);
              gpxspeedtmp = Math.round(gpxspeedtmp * 100) / 100;
              stepDetails.push({
                pace: new Date(gpxpacetmp),
                speed: gpxspeedtmp,
                km: mz * dMaxTemp / 1000,
                hr: average(heartRatesTmp, 0),
                cadence: average(cadenceTmp, 0),
                power: average(powerTmp, 0),
                stryde: average(strydeTmp, 1)
              });
              timeStartTmp = new Date(gpxPoints[p].timestamp);
              mz++;
              dTemp = 0;
              heartRatesTmp = [];
              powerTmp = [];
              cadenceTmp = [];
            }
            dTemp2 += d * 1000;
            if (dTotal * 1000 - mz2 * 250 >= dMaxTemp2) {
              timeEndTmp2 = new Date(gpxPoints[p].timestamp);
              timeDiff = timeEndTmp2 - timeStartTmp2;
              gpxpacetmp = timeDiff / (dTemp / 1000);
              gpxpacetmp = Math.round(gpxpacetmp * 100) / 100 * 1;
              gpxspeedtmp =
                Math.round(dTemp2 / 1000 * 100) /
                100 /
                (timeDiff / 1000 / 60 / 60);
              gpxspeedtmp = Math.round(gpxspeedtmp * 100) / 100;
              smallStepDetail.push({
                pace: new Date(gpxpacetmp),
                speed: gpxspeedtmp,
                km: mz2 * dMaxTemp2 / 10 / 100,
                ele: (eleStartTmp + curEle) / 2,
                hr: average(heartRatesTmp2, 0),
                cadence: average(cadenceTmp2, 0),
                power: average(powerTmp2, 0),
                stryde: average(strydeTmp2, 1)
              });
              timeStartTmp2 = new Date(gpxPoints[p].timestamp);
              mz2++;
              dTemp2 = 0;
              eleStartTmp = curEle;
              heartRatesTmp2 = [];
            }
          }
          if (gpxPoints.length - 1 === p) {
            timeEndTmp = new Date(gpxPoints[p].timestamp);
            timeDiff = timeEndTmp - timeStartTmp;
            gpxpacetmp = timeDiff / (dTemp / 1000);
            gpxpacetmp = Math.round(gpxpacetmp * 100) / 100 * 1;
            gpxspeedtmp =
              Math.round(dTemp / 1000 * 100) /
              100 /
              (timeDiff / 1000 / 60 / 60);
            gpxspeedtmp = Math.round(gpxspeedtmp * 100) / 100;
            stepDetails.push({
              pace: new Date(gpxpacetmp),
              speed: gpxspeedtmp,
              km: Math.round(dTotal * 10) / 10,
              hr: average(heartRatesTmp, 0),
              cadence: average(cadenceTmp, 0),
              power: average(powerTmp, 0),
              stryde: average(strydeTmp, 1)
            });
            timeEndTmp2 = new Date(gpxPoints[p].timestamp);
            timeDiff = timeEndTmp2 - timeStartTmp2;
            if (timeDiff > 0) {
              gpxpacetmp = timeDiff / (dTemp / 1000);
              gpxpacetmp = Math.round(gpxpacetmp * 100) / 100 * 1;
              gpxspeedtmp =
                Math.round(dTemp2 / 1000 * 100) /
                100 /
                (timeDiff / 1000 / 60 / 60);
              gpxspeedtmp = Math.round(gpxspeedtmp * 100) / 100;
              smallStepDetail.push({
                pace: new Date(gpxpacetmp),
                speed: gpxspeedtmp,
                km: Math.round(dTotal * 10) / 10,
                ele: (eleStartTmp + curEle) / 2,
                hr: average(heartRatesTmp2, 0),
                cadence: average(cadenceTmp2, 0),
                power: average(powerTmp2, 0),
                stryde: average(strydeTmp2, 1)
              });
            }
          }
        }
        oldLat = curLat;
        oldLng = curLng;
        oldDate = curDate;
        oldEle = curEle;
      }

      //Date
      session.date = moment(new Date(gpxPoints[0].timestamp)).format("llll");

      //Points
      session.gpxPoints = gpxPoints;

      if (session.type === undefined) {
        session.type = "Run";
      }

      //Maps markers
      if (session.map === undefined) {
        session.map = {
          center: {
            lat: 48,
            lng: 4,
            zoom: 5,
            autoDiscover: false
          },
          paths: {},
          bounds: {},
          controls: {
            scale: true
          },
          markers: {},
          tiles: {
            url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        };
      }
      session.map.markers = markers;
      session.map.paths = paths;

      //Maps bounds
      session.map.bounds = leafletBoundsHelpers.createBoundsFromArray([
        [latMin, lonMin],
        [latMax, lonMax]
      ]);
      session.map.defaults = {
        scrollWheelZoom: false
      };

      //Pace by km
      session.paceDetails = stepDetails;

      //Heart Rate OK ?
      if (
        hrZ[0] === 0 &&
        hrZ[1] === 0 &&
        hrZ[2] === 0 &&
        hrZ[3] === 0 &&
        hrZ[4] === 0
      ) {
        session.heartRate = false;
      } else {
        session.heartRate = true;
      }

      //Version of computation
      session.version = $scope._version;
      //Graph speed / ele
      session.chart_options = {
        animation: false,
        showTooltips: false,
        showScale: true,
        scaleIntegersOnly: true,
        bezierCurve: true,
        pointDot: false,
        responsive: true,
        scaleUse2Y: true,
        legendTemplate:
          "<ul class='<%=name.toLowerCase()%>-legend'><% for (var i=0; i<datasets.length; i++){%><li><span style='background-color:<%=datasets[i].strokeColor%>'></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
      };
      session.chart2_options = {
        animation: false,
        showTooltips: false,
        showScale: true,
        scaleIntegersOnly: true,
        bezierCurve: true,
        pointDot: false,
        responsive: true,
        legendTemplate: ""
      };
      session.chart4_options = {
        animation: false,
        showTooltips: false,
        showScale: true,
        scaleIntegersOnly: true,
        bezierCurve: true,
        pointDot: false,
        responsive: true,
        legendTemplate: ""
      };
      session.chart3_labels = [
        $scope.translateFilter("_hr_zone0") + " < 60%",
        $scope.translateFilter("_hr_zone1") + " > 60%",
        $scope.translateFilter("_hr_zone2") + " > 70%",
        $scope.translateFilter("_hr_zone3") + " > 80%",
        $scope.translateFilter("_hr_zone4") + " > 90%"
      ];
      for (var i = 0; i < hrZ.length; i++) {
        hrZ[i] = hrZ[i].toFixed(1);
      }
      session.chart3_data = hrZ;

      session.chart_labels = [];
      session.chart2_labels = [];
      session.chart4_labels = [];
      session.chart_data = [[], []];
      session.chart2_data = [[]];
      session.chart4_data = [[]];
      session.chart2_type = "Heartrate";
      session.chart_series = [
        $scope.translateFilter("_speed_kph"),
        $scope.translateFilter("_altitude_meters")
      ];
      session.chart2_series = [
        $scope.translateFilter("_speed_kph"),
        $scope.translateFilter("_bpms_label")
      ];
      session.chart4_type = "Heartrate";
      session.chart4_series = [
        $scope.translateFilter("_altitude_meters"),
        $scope.translateFilter("_bpms_label")
      ];
      session.avg_hr = [];
      session.avg_cadence = [];
      session.avg_power = [];
      session.chart3_type = "DoughnutWithValue";
      smallStepDetail.map(function(step) {
        if (step.hr > hrZ4) {
          hr_color = 4;
        } else {
          if (step.hr > hrZ3) {
            hr_color = 3;
          } else {
            if (step.hr > hrZ2) {
              hr_color = 2;
            } else {
              if (step.hr > hrZ1) {
                hr_color = 1;
              } else {
                hr_color = 0;
              }
            }
          }
        }
        if (Math.round(step.km) === step.km) {
          session.chart_labels.push(step.km);
          session.chart2_labels.push(
            step.km + "|" + session.hr_colors[hr_color]
          );
          session.chart4_labels.push(
            step.km + "|" + session.hr_colors[hr_color]
          );
        } else {
          session.chart_labels.push("");
          session.chart2_labels.push("|" + session.hr_colors[hr_color]);
          session.chart4_labels.push("|" + session.hr_colors[hr_color]);
        }

        session.chart_data[0].push(step.speed);
        session.chart_data[1].push(step.ele);
        session.chart2_data[0].push(step.speed);
        session.chart4_data[0].push(step.ele);

        //Calc avg hr
        session.avg_hr.push(step.hr);

        //Calc avg power & cadence
        session.avg_power.push(step.power);
        session.avg_cadence.push(step.cadence);
      });

      session.avg_hr = average(session.avg_hr, 0);
      session.avg_power = average(session.avg_power, 0);
      session.avg_cadence = average(session.avg_cadence, 0);

      session.chart3_options = {
        animation: false,
        animationEasing: "easeOutBounce",
        showTooltips: true,
        showScale: false,
        showLegend: true,
        scaleIntegersOnly: true,
        responsive: true,
        legendTemplate:
          '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>',
        averageValue: session.avg_hr
      };

      eleUp = 0;
      eleDown = 0;
      for (p = 0; p < gpxPoints.length; p++) {
        curEle = gpxPoints[p].ele;
        if (p > 0) {
          oldEle = gpxPoints[p - 1].ele;
          if (curEle > oldEle) {
            eleUp += curEle - oldEle;
          } else if (curEle < oldEle) {
            eleDown += oldEle - curEle;
          }
        }
      }

      var gpxStart = gpxPoints[0].timestamp;
      var gpxEnd = gpxPoints[gpxPoints.length - 1].timestamp;

      var d1 = new Date(gpxStart);
      var d2 = new Date(gpxEnd);
      var miliseconds = d2 - d1;

      var tmpMilliseconds = miliseconds;

      var seconds = miliseconds / 1000;
      var minutes = seconds / 60;
      var hours = minutes / 60;
      var days = hours / 24;

      days = tmpMilliseconds / 1000 / 60 / 60 / 24;
      days = Math.floor(days);

      tmpMilliseconds = tmpMilliseconds - days * 24 * 60 * 60 * 1000;
      hours = tmpMilliseconds / 1000 / 60 / 60;
      hours = Math.floor(hours);

      tmpMilliseconds = tmpMilliseconds - hours * 60 * 60 * 1000;
      minutes = tmpMilliseconds / 1000 / 60;
      minutes = Math.floor(minutes);

      tmpMilliseconds = tmpMilliseconds - minutes * 60 * 1000;
      seconds = tmpMilliseconds / 1000;
      seconds = Math.floor(seconds);

      var gpxpace = miliseconds / dTotal;
      gpxpace = Math.round(gpxpace * 100) / 100 * 1;
      gpxpace = new Date(gpxpace);

      var gpxspeed =
        Math.round(dTotal * 100) / 100 / (miliseconds / 1000 / 60 / 60);
      gpxspeed = Math.round(gpxspeed * 100) / 100;
      var gpxspeedwithoutpause =
        Math.round(
          Math.round(dTotal * 100) /
            100 /
            (dwithoutpause / 1000 / 60 / 60) *
            100
        ) / 100;
      var gpxpacewithoutpause = new Date(dwithoutpause / dTotal);
      session.gpxMaxHeight = Math.round(maxHeight);
      session.gpxMinHeight = Math.round(minHeight);
      //session.distance = Math.round(dTotal * 100) / 100;
      session.distance = Math.round($rootScope.distance_travelled * 100) / 100;
      session.pace = gpxpace;
      session.speed = gpxspeed;
      session.bar = 0;
      session.progress = 0;
      session.customDistance = 0;
      session.speedinmvt = gpxspeedwithoutpause;
      session.paceinmvt = gpxpacewithoutpause;
      session.eleUp = Math.round(eleUp);
      session.eleDown = Math.round(eleDown);
      session.distk = session.distance.toFixed(0);
      //session.duration = new Date(d2 - d1);
      var total_duration = new Date(Date.UTC(0, 0, 0, $scope.hours, $scope.minute, $scope.second));
      session.duration = total_duration;
      session.start = gpxPoints[0].timestamp;
      session.end = gpxPoints[gpxPoints.length - 1].timestamp;
      session.overnote = (
        parseInt(gpxspeedwithoutpause) *
          1000 *
          (miliseconds / 1000 / 60) *
          0.000006 +
        (Math.round(eleUp) - Math.round(eleDown)) * 0.04
      ).toFixed(1);
      $scope.sessions[session.recclicked] = session;
      try {
        var sf = new SessionFactory();
        sf.saveToFile(session, $scope.dataPath).then(function() {
          $scope.updateIndex(session);
        });
      } catch (err) {
        console.warn(err);
      }

      return session;
    };

    // remove file system entry
    $scope.deleteFileSession = function(recid) {
      if ($scope.platform === "Browser") {
        //$scope.writeSessionsToFile($scope.sessions);
        $scope.storageSetObj("sessions", $scope.sessions);
        $scope.computeResumeGraph();
      } else {
        var path = $scope.dataPath + "sessions";
        $scope.remove_file = function(entry) {
          entry.remove(function() {
            $scope.computeResumeGraph();
            console.log(entry.toURI(), null, "Session deleted");
          }, null);
        };

        // retrieve a file and truncate it
        window.resolveLocalFileSystemURL(
          path,
          function(dirEntry) {
            dirEntry.getFile(
              recid + ".json",
              {
                create: false
              },
              $scope.remove_file,
              null
            );
          },
          function(err) {
            console.error(err);
          }
        );
      }
    };

    $scope.migrateFromOldSessionFile = function() {
      // Migration fron one file format
      console.error("Error? Migrating from old format");
      if ($scope.platform === "Browser") {
        return;
      }
      $scope.loadFromFile(
        "sessions.gpxs",
        function(datas) {
          $scope.sessions = datas;
          $scope.fullyLoaded = true;
        },
        function(err) {
          console.error("migrateSessionsFromFile failed :" + err);
          $timeout(function() {
            try {
              $scope.sessions = JSON.parse(
                localStorage.getItem("sessions"),
                $scope.dateTimeReviver
              );
            } catch (err) {
              console.warn(err.message);
            }
            $scope.fullyLoaded = true;
          }, 100);
        }
      );
    };

    $scope.loadAllJsonSessions = function(dataPath) {
      var deferred = $q.defer();
      var fs = new FileFactory();
      var path;
      $scope.sessions = {};

      try {
        path = dataPath + "sessions";
      } catch (err) {
        console.warn(err);
        return deferred.failed;
      }

      fs.getEntries(path).then(
        function(result) {
          result = result.filter(function(i) {
            if (i.name.slice(-5) === ".json") {
              return i;
            }
          });

          // Check if conform to the index
          console.log($scope.resume);
          console.debug("debug resume ^");
          if (
            ($scope.sortedSessionsIndex !== undefined) &
            ($scope.resume !== undefined)
          ) {
            if (
              (result.length === $scope.sortedSessionsIndex.length) &
              ($scope.resume.avspeed !== "NaN") &
              ($scope.resume.avdistance != "NaN")
            ) {
              console.log("Resume and Index OK, not loading sessions");
              if (navigator && navigator.splashscreen) {
                navigator.splashscreen.hide();
              }
              return deferred.promise;
            }
          }

          console.log("Loading all sessions");
          // Else load all sessions
          $scope.session_files = result.sort(function(a, b) {
            var x = parseInt(a.name.slice(0, -5));
            var y = parseInt(b.name.slice(0, -5));
            return (x < y ? -1 : x > y ? 1 : 0) * -1;
          });

          var idx = 0;
          var sf = new SessionFactory();
          $scope.session_files.forEach(function(file) {
            console.debug(file.name);
            localStorage.setItem('test1', 'test');
            //console.debug("asdf");
            //console.debug(localStorage.getItem("1554445027804"));
            if (file.name.slice(-5) === ".json") {
              $timeout(function() {
                sf.loadFromFile(file.name.slice(0, -5)).then(function(session) {
                  if (typeof session.duration === "string") {
                    session.duration = new Date(session.duration);
                  }
                  if (typeof session.pace === "string") {
                    session.pace = new Date(session.pace);
                  }

                  $scope.sessions[session.recclicked] = session;

                  $scope.updateIndex(session);
                  if (
                    Object.keys($scope.sessions).length ===
                    $scope.session_files.length
                  ) {
                    //$scope.postLoadSessions();
                    $scope.fullyLoaded = true;
                    $scope.computeResumeGraph();
                    $scope.cleanIndex();
                    console.log("All sessions loaded");
                    if (navigator && navigator.splashscreen) {
                      navigator.splashscreen.hide();
                    }
                    deferred.resolve(true);
                  }
                });
              }, idx * 100);
              idx += 1;
            }
          });
        },
        function(error) {
          console.error(error);
          console.error("Load OLD SESSION FILE !!");
          $scope.migrateFromOldSessionFile();
          if (navigator && navigator.splashscreen) {
            navigator.splashscreen.hide();
          }
        }
      );
      return deferred.promise;
    };

    $scope.importFIT = function(file) {
      var deferred = $q.defer();

      console.log("importing FIT:" + file);
      var reader = new FileReader();

      // Require the moduleP
      var EasyFit = window.easyFit.default;

      reader.onloadend = function() {
        // Create a EasyFit instance (options argument is optional)
        var easyFit = new EasyFit({
          force: true,
          speedUnit: "km/h",
          lengthUnit: "km",
          temperatureUnit: "celcius",
          elapsedRecordField: true,
          mode: "cascade"
        });

        // Parse your file
        easyFit.parse(this.result, function(error, data) {
          // Handle result of parse method
          if (error) {
            console.log(error);
          } else {
            for (var sessions_idx in data.activity.sessions) {
              var asession = {};
              asession.gpxData = [];

              for (var lap_idx in data.activity.sessions[sessions_idx].laps) {
                for (var record_idx in data.activity.sessions[sessions_idx]
                  .laps[lap_idx].records) {
                  var pnt =
                    data.activity.sessions[sessions_idx].laps[lap_idx].records[
                      record_idx
                    ];
                  asession.gpxData.push([
                    pnt.position_lat,
                    pnt.position_long,
                    pnt.timestamp,
                    pnt.altitude,
                    pnt.heart_rate,
                    0,
                    pnt.cadence,
                    pnt.power,
                    pnt.vertical_oscillation
                  ]);
                }
              }

              asession.recclicked = new Date(asession.gpxData[0][2]).getTime();
              //Save session already compute session
              $scope.saveSession(asession);
              deferred.resolve();
            }
          }
        });
      };

      reader.readAsArrayBuffer(file);
      return deferred.promise;
    };

    $scope.importJSON = function(file) {
      var deferred = $q.defer();

      console.log("importing JSON:" + file);
      var reader = new FileReader();

      reader.onloadend = function() {
        var asession = JSON.parse(this.result);
        //Save session already compute session
        $scope.saveSession(asession);
        deferred.resolve();
      };

      reader.readAsText(file);

      return deferred.promise;
    };

    $scope.importGPX = function(file) {
      var deferred = $q.defer();

      console.log("importing GPX:" + file);
      var reader = new FileReader();

      reader.onloadend = function() {
        var x2js = new X2JS();
        var json = x2js.xml_str2json(this.result);

        var gpxPoints = [];

        if (json.gpx.trk.trkseg instanceof Array) {
          json.gpx.trk.trkseg.map(function(item) {
            gpxPoints = gpxPoints.concat(item.trkpt);
          });
        } else {
          gpxPoints = json.gpx.trk.trkseg.trkpt;
        }

        //NOW RECOMPUTE AND CREATE
        var asession = {};
        asession.gpxData = [];

        gpxPoints.map(function(item) {
          var bpms;
          var accuracy;
          var power;
          var cadence;
          var stryde;

          try {
            bpms = parseFloat(item.extensions.TrackPointExtension.hr.__text);
          } catch (exception) {
            try {
              bpms = parseFloat(item.extensions.hr.__text);
            } catch (exception2) {
              bpms = undefined;
            }
          }
          try {
            power = parseFloat(
              item.extensions.TrackPointExtension.power.__text
            );
          } catch (exception) {
            try {
              power = parseFloat(item.extensions.power.__text);
            } catch (exception2) {
              power = undefined;
            }
          }
          try {
            cadence = parseFloat(
              item.extensions.TrackPointExtension.cad.__text
            );
          } catch (exception) {
            try {
              cadence = parseFloat(item.extensions.cad.__text);
            } catch (exception2) {
              cadence = undefined;
            }
          }
          try {
            accuracy = parseFloat(
              item.extensions.TrackPointExtension.accuracy.__text
            );
          } catch (exception) {
            try {
              accuracy = parseFloat(item.extensions.accuracy.__text);
            } catch (exception2) {
              accuracy = undefined;
            }
          }
          try {
            stryde = parseFloat(
              item.extensions.TrackPointExtension.stryde.__text
            );
          } catch (exception) {
            try {
              stryde = parseFloat(item.extensions.stryde.__text);
            } catch (exception2) {
              stryde = undefined;
            }
          }

          asession.gpxData.push([
            item._lat,
            item._lon,
            item.time,
            item.ele,
            bpms,
            accuracy,
            cadence,
            power,
            stryde
          ]);
        });

        asession.recclicked = new Date(gpxPoints[0].time).getTime();
        //Save session already compute session
        $scope.saveSession(asession);

        deferred.resolve();
      };

      reader.readAsText(file);

      return deferred.promise;
    };

    $scope.iosFilePicker = function() {
      var p = [];

      window.FilePicker.pickFile(
        function(path) {
          window.resolveLocalFileSystemURL(
            path,
            function(fileEntry) {
              fileEntry.file(function(file) {
                if (file.name.slice(-4) == ".gpx") {
                  p.push($scope.importGPX(file));
                } else if (file.name.slice(-4) == ".fit") {
                  p.push($scope.importFIT(file));
                } else if (file.name.slice(-4) == "json") {
                  p.push($scope.importJSON(file));
                }
              });
            },
            function(err) {
              console.error(err);
            }
          );
        },
        function(err) {
          $ionicPopup.alert({
            title: $scope.translateFilter("_file_import_title"),
            template: err
          }); //, utis);
        }
      );

      $q.all(p).then(function() {
        $ionicPopup.alert({
          title: $scope.translateFilter("_file_import_title"),
          template: $scope.translateFilter("_file_file_imported")
        });
      });
    };

    $scope.doFileChooser = function() {
      if ($scope.platform === "iOS") {
        $scope.iosFilePicker();
      } else if ($scope.platform === "OldAndroid") {
        $state.go("app.filepicker");
      } else {
        $timeout(function() {
          document.getElementById("gpxFile").click();
        }, 100);
      }
    };

    $scope.sendLogs = function() {
      window.open(
        "mailto:khertan@khertan.net?subject=ForRunners Log&body=" +
          JSON.stringify(window.initialLogs, null, 2)
      );
    };

    $scope.importFiles = function(element) {
      var p = [];

      for (var idx in element.files) {
        if (typeof element.files[idx] === "object") {
          var file = element.files[idx];
          if (file.name.slice(-4) == ".gpx") {
            p.push($scope.importGPX(file));
          } else if (file.name.slice(-4) == ".fit") {
            p.push($scope.importFIT(file));
          } else if (file.name.slice(-4) == "json") {
            p.push($scope.importJSON(file));
          }
        }
      }

      $q.all(p).then(function() {
        $ionicPopup.alert({
          title: $scope.translateFilter("_file_import_title"),
          template: $scope.translateFilter("_file_file_imported")
        });
        $scope.computeResumeGraph();
      });

      return true;
    };

    $scope.writeGPX = function(dirEntry, filename, session) {
      var gpxHead = '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n';
      gpxHead +=
        '<gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1" creator="ForRunners" version="1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www.garmin.com/xmlschemas/GpxExtensionsv3.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd">';
      gpxHead += "<metadata>\n";
      gpxHead += '<link href="http://www.khertan.net"/>\n';
      gpxHead += "<text>Khertan Software</text>\n";
      gpxHead += "</link>\n";
      gpxHead += "<time>" + moment().format() + "</time>\n";
      gpxHead += "</metadata>\n";
      gpxHead += "<trk>\n";
      gpxHead += "<trkseg>\n";

      var gpxSubHead = "";
      var gpxFoot = "</trkseg></trk>\n</gpx>";

      dirEntry.getFile(
        filename,
        {
          create: true
        },
        function(fileEntry) {
          fileEntry.createWriter(
            function(writer) {
              // Already in JSON Format
              writer.onwrite = function() {};
              writer.onerror = function(e) {
                $ionicPopup.alert({
                  title: $scope.translateFilter("_gpx_error_title"),
                  template: $scope.translateFilter("_gpx_error_content")
                });
                console.error(e);
                console.error(writer.error);
              };
              writer.fileName = filename;
              gpxSubHead = "<name>" + session.date + "</name>\n";

              var gpxPoints = "";
              session.gpxData.map(function(pts) {
                gpxPoints +=
                  '<trkpt lat="' + pts[0] + '" lon="' + pts[1] + '">\n';
                gpxPoints += "<ele>" + pts[3] + "</ele>\n";
                gpxPoints += "<time>" + pts[2] + "</time>\n";
                if (pts[4] || pts[5] || pts[6] || pts[7] || pts[8]) {
                  gpxPoints += "<extensions><gpxtpx:TrackPointExtension>";
                  if (pts[4]) {
                    gpxPoints += "<gpxtpx:hr>" + pts[4] + "</gpxtpx:hr>\n";
                  }
                  if (pts[5]) {
                    gpxPoints +=
                      "<gpxtpx:accuracy>" + pts[5] + "</gpxtpx:accuracy>\n";
                  }
                  if (pts[6]) {
                    gpxPoints += "<gpxtpx:cad>" + pts[6] + "</gpxtpx:cad>\n";
                  }
                  if (pts[7]) {
                    gpxPoints +=
                      "<gpxtpx:power>" + pts[7] + "</gpxtpx:power>\n";
                  }
                  if (pts[8]) {
                    gpxPoints +=
                      "<gpxtpx:stryde>" + pts[8] + "</gpxtpx:stryde>\n";
                  }
                  gpxPoints += "</gpxtpx:TrackPointExtension></extensions>";
                }
                gpxPoints += "</trkpt>\n";
              });
              writer.write(gpxHead + gpxSubHead + gpxPoints + gpxFoot, {
                type: "text/plain"
              });
            },
            function() {
              console.log("failed can t create writer");
            }
          );
        },
        function() {
          console.log("failed to get file");
        }
      );
    };

    $scope.exportAGPX = function(dirEntry, session, overwrite) {
      if (overwrite === false) {
        dirEntry.getFile(
          moment(session.recclicked).format("YYYYMMDD_hhmm") + ".gpx",
          {
            create: false
          },
          function() {}, //exist so don t overwrite
          function() {
            $scope.writeGPX(
              dirEntry,
              moment(session.recclicked).format("YYYYMMDD_hhmm") + ".gpx",
              session
            );
          }
        );
      } else {
        $scope.writeGPX(
          dirEntry,
          moment(session.recclicked).format("YYYYMMDD_hhmm") + ".gpx",
          session
        );
      }
    };

    $scope.exportGPXs = function(overwrite) {
      try {
        $scope.loadAllJsonSessions($scope.dataPath).then(function() {
          for (var recclicked in $scope.sessions) {
            if ($scope.sessions.hasOwnProperty(recclicked)) {
              var stordir = $scope.dataPath;

              window.resolveLocalFileSystemURL(
                stordir,
                function(dirEntry) { //noqa
                  $scope.exportAGPX(
                    dirEntry,
                    $scope.sessions[recclicked],
                    overwrite
                  );
                },
                function() {
                  console.log("failed can t open fs");
                }
              );
            }
          }
          if (overwrite) {
            $ionicPopup.alert({
              title: $scope.translateFilter("_gpx_export_title"),
              template: $scope.translateFilter("_gpx_file_exported")
            });
          }
        });
      } catch (err) {
        console.error("Export as GPX failed : " + err);
      }
    };

    $scope.storageSetObj = function(key, value) {
      try {
        if ($scope.platform === "Browser") {
          localStorage.setItem(key, JSON.stringify(value));
        } else {
          NativeStorage.setItem(
            key,
            value,
            function() {},
            function(err) {
              console.error("Native Storage SET Failed:" + err);
            }
          );
        }
      } catch (err) {
        console.warn(err);
        localStorage.setItem(key, value);
      }
    };

    $scope.storageGetObj = function(key, success, error) {
      var v;
      try {
        if ($scope.platform === "Browser") {
          v = localStorage.getItem(key);
          if (typeof v === "string") {
            v = JSON.parse(v);
          }
          return success(v);
        } else {
          NativeStorage.getItem(key, success, function(err) {
            console.error("Native Storage GET " + key + " Failed:" + err);
            error();
          });
        }
      } catch (err) {
        console.warn(err);
        try {
          v = localStorage.getItem(key);
          if (typeof v === "string") {
            v = JSON.parse(v);
          }
          return success(v);
        } catch (err) {
          console.warn(err);
        }
      }
    };

    $scope.setLang = function() {
      var lang = "en-US";
      if ($scope.prefs.language) {
        lang = $scope.prefs.language;
      }
      $translate.use(lang);
      moment.locale(lang);
    };

    $scope.cleanSessions = function() {};

    $scope.writeToFile = function(datas, filename) {
      if ($scope.platform === "Browser") {
        return;
      }

      var path = $scope.dataPath;

      try {
        window.resolveLocalFileSystemURL(
          path,
          function(dirEntry) {
            dirEntry.getFile(
              filename,
              {
                create: true
              },
              function(fileEntry) {
                fileEntry.createWriter(
                  function(writer) {
                    // Already in JSON Format
                    writer.onwrite = function() {};
                    writer.onerror = function(e) {
                      console.error(e);
                    };
                    writer.fileName = filename;
                    writer.write(
                      new Blob([JSON.stringify(datas)], {
                        type: "text/plain"
                      })
                    );
                  },
                  function() {
                    console.error("Cant write " + filename);
                  }
                );
              },
              function() {
                console.error("Cant write 2nd " + filename);
              }
            );
          },
          function() {
            console.error("Cant write 3th " + filename);
          }
        );
      } catch (err) {
        console.error("writeSessionsToFile:" + err);
      }
    };

    $scope.resumeSessionForIndex = function(session) {
      if (session.equipments === undefined) {
        session.equipments = [];
      }
      if (session.name === undefined) {
        session.name = "";
      }
      return {
        name: session.name,
        recclicked: session.recclicked,
        date: session.date,
        overnote: session.overnote,
        start: session.start,
        distk: session.distk,
        distance: session.distance,
        duration: session.duration,
        pace: session.pace,
        speed: session.speed,
        bar: session.bar,
        progress: session.progress,
        customDistance: session.customDistance,
        eleUp: session.eleUp,
        eleDown: session.eleDown,
        type: session.type,
        equipmentUUIDs: session.equipments.map(function(eq) {
          if (eq) {
            return eq.uuid;
          }
        }),
        cityname: session.cityname
      };
    };

    $scope.cleanIndex = function() {
      for (var recclicked in $scope.sessionsIndex) {
        if ($scope.sessionsIndex.hasOwnProperty(recclicked)) {
          if ($scope.sessions[recclicked] === undefined) {
            delete $scope.sessionsIndex[recclicked];
            $scope.sortSessions();
          }
        }
      }
      $scope.storageSetObj("index", $scope.sessionsIndex);
    };

    $scope.updateIndex = function(session) {
      if ($scope.sessionsIndex === undefined || $scope.sessionsIndex === null) {
        $scope.sessionsIndex = {};
      }
      $scope.sessionsIndex[session.recclicked] = $scope.resumeSessionForIndex(
        session
      );
      $scope.sortSessions();
      $scope.storageSetObj("index", $scope.sessionsIndex);
    };

    $scope.writeEquipmentsToFile = function(equipments) {
      if ($scope.platform === "Browser") {
        try {
          localStorage.setItem("equipments", JSON.stringify($scope.equipments));
        } catch (err) {
          console.warn(err);
        }
        return;
      }
      $scope.writeToFile(equipments, "equipments.json");
    };

    $scope.writeResumeToFile = function(resume) {
      $scope.storageSetObj("resume", resume);
    };

    $scope.loadFromFile = function(filename, success, fail) {
      if ($scope.platform === "Browser") {
        return;
      }

      var path = $scope.dataPath;
      if (typeof window.resolveLocalFileSystemURL === "function") {
        window.resolveLocalFileSystemURL(
          path,
          function(fileEntry) {
            if (typeof fileEntry === ' promise ') {
              console.log("its a promise");
            }
            fileEntry.file(function(file) {
              var reader = new FileReader();
              reader.onloadend = function() {
                success(JSON.parse(this.result, $scope.dateTimeReviver));
                console.log("loaded from file:" + filename);
              };
              reader.readAsText(file);
            });
          },
          function(err) {
            fail(err);
          }
        );
      } else {
        $timeout(function() {
          $scope.loadFromFile(filename, success, fail);
        }, 500);
      }
    };

    $scope.loadEquipmentsFromFile = function() {
      if ($scope.platform === "Browser") {
        try {
          $scope.equipments = JSON.parse(
            localStorage.getItem("equipments"),
            $scope.dateTimeReviver
          );
        } catch (err) {
          $scope.equipments = [];
        }

        return;
      }

      $scope.loadFromFile(
        "equipments.json",
        function(datas) {
          $scope.equipments = datas;
        },
        function(err) {
          //old wronng file path keep for compatibility
          $scope.loadFromFile(
            "equipments.gpxs",
            function(datas) {
              $scope.equipments = datas;
            },
            function(err) {
              console.warn("LoadEquipmentsFromFile failed :" + err);
              $timeout(function() {
                try {
                  $scope.equipments = JSON.parse(
                    localStorage.getItem("equipments"),
                    $scope.dateTimeReviver
                  );
                } catch (err) {
                  $scope.equipments = [];
                }
              }, 100);
            }
          );
        }
      );
    };

    $scope.loadEquipments = function() {
      try {
        $scope.loadEquipmentsFromFile();
      } catch (exception) {
        console.warn(exception);
        $timeout(function() {
          try {
            $scope.equipments = JSON.parse(
              localStorage.getItem("equipments"),
              $scope.dateTimeReviver
            );
          } catch (err) {
            $scope.equipments = [];
          }
        }, 100);
      }
    };

    $scope.sortSessions = function() {
      $scope.sortedSessionsIndex = [];
      for (var recclicked in $scope.sessionsIndex) {
        if ($scope.sessionsIndex.hasOwnProperty(recclicked)) {
          $scope.sortedSessionsIndex.push($scope.sessionsIndex[recclicked]);
        }
      }
      if ($scope.sortedSessionsIndex !== undefined) {
        $scope.sortedSessionsIndex.sort(function(a, b) {
          var x = parseInt(a.recclicked);
          var y = parseInt(b.recclicked);
          return (x < y ? -1 : x > y ? 1 : 0) * -1;
        });
      }
    };

    $scope.computeResumeGraph = function() {
      console.debug("Debug Resume Graph");
      $scope.resume = {};
      $scope.resume.chart_labels = [];
      $scope.resume.chart_series = [
        $scope.translateFilter("_overnote"),
        $scope.translateFilter("_duration_minutes")
      ];
      $scope.resume.chart_data = [[], []];
      $scope.resume.chart_options = {
        responsive: true,
        animation: false,
        showScale: false,
        scaleShowLabels: false,
        pointHitDetectionRadius: 10,
        scaleUse2Y: true,
        legendTemplate:
          '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
      };

      $scope.resume.overnote = 0;
      $scope.resume.avduration = 0;
      $scope.resume.avdistance = 0;
      $scope.resume.avspeed = 0;

      $scope.resume.longesttime = new Date(0);
      $scope.resume.bestdistance = 0;
      $scope.resume.bestspeed = 0;

      var sessionIndexLength = 0;
      for (var recclicked in $scope.sessionsIndex) {
        if ($scope.sessionsIndex.hasOwnProperty(recclicked)) {
          var item = $scope.sessionsIndex[recclicked];
          sessionIndexLength += 1;
          $scope.resume.chart_labels.push(item.date);
          try {
            $scope.resume.chart_data[1].push(
              item.duration.getUTCMinutes() + item.duration.getUTCHours() * 60
            );
            $scope.resume.chart_data[0].push(item.overnote);
            $scope.resume.elapsed += item.duration.getTime();
          } catch (err) {
            console.error("item.duration.getUTCMinutes");
          }
          $scope.resume.avspeed += item.speed;
          $scope.resume.avdistance += item.distance;
          $scope.resume.avduration += item.duration.getTime();
          $scope.resume.overnote += parseFloat(item.overnote);

          if (item.speed > $scope.resume.bestspeed) {
            $scope.resume.bestspeed = item.speed;
          }
          if (item.duration > $scope.resume.longesttime) {
            $scope.resume.longesttime = item.duration;
          }
          if (item.distance > $scope.resume.bestdistance) {
            $scope.resume.bestdistance = item.distance;
          }
        }
      }

      if ($scope.resume.chart_labels.length > 25) {
        $scope.resume.chart_labels = $scope.resume.chart_labels.slice(0, 24);
        $scope.resume.chart_data[0] = $scope.resume.chart_data[0].slice(0, 24);
        $scope.resume.chart_data[1] = $scope.resume.chart_data[1].slice(0, 24);
      }

      $scope.resume.chart_labels.reverse();
      $scope.resume.chart_data[0].reverse();
      $scope.resume.chart_data[1].reverse();

      if (sessionIndexLength > 0) {
        $scope.resume.avdistance =
          $scope.resume.avdistance / sessionIndexLength;
        $scope.resume.avspeed = $scope.resume.avspeed / sessionIndexLength;
        $scope.resume.avduration = new Date(
          $scope.resume.avduration / sessionIndexLength
        );
        $scope.resume.overnote = Math.round(
          $scope.resume.overnote / sessionIndexLength,
          1
        );
      }

      // $scope.resume.bestspeed = $scope.resume.bestspeed;
      // $scope.resume.bestdistance = $scope.resume.bestdistance;

      try {
        $scope.storageSetObj("resume", $scope.resume);
      } catch (err) {
        console.warn(err);
      }
      $ionicScrollDelegate.resize();
    };

    $scope.loadResumeGraph = function() {
      $scope.storageGetObj(
        "resume",
        function(resume) {
          if (resume) {
            $timeout(function() {
              if (resume.avspeed != 0) {
                $scope.resume = resume;
              } else {
                $scope.computeResumeGraph();
              }

              console.log("Resume loaded from native storage");
            }, 0);
          } else {
            $timeout($scope.computeResumeGraph, 0);
          }
        },
        function(err) {
          console.log(err);
        }
      );
    };

    $scope.loadSessionsIndex = function() {
      $scope.storageGetObj(
        "index",
        function(datas) {
          console.log("Load index");
          $scope.sessionsIndex = datas;
          for (var recclicked in $scope.sessionsIndex) {
            if ($scope.sessionsIndex.hasOwnProperty(recclicked)) {
              if (
                typeof $scope.sessionsIndex[recclicked].duration === "string"
              ) {
                $scope.sessionsIndex[recclicked].duration = new Date(
                  $scope.sessionsIndex[recclicked].duration
                );
              }
              if (typeof $scope.sessionsIndex[recclicked].pace === "string") {
                $scope.sessionsIndex[recclicked].pace = new Date(
                  $scope.sessionsIndex[recclicked].pace
                );
              }
            }
          }
          $scope.sortSessions();
          $scope.loadAllJsonSessions($scope.dataPath);
        },
        function(err) {
          console.log(err);
          $scope.loadAllJsonSessions($scope.dataPath);
        }
      );
    };

    // Run
    // Load Session Index
    $scope.loadSessionsIndex();

    // Load Resume
    $scope.loadResumeGraph();

    $timeout(function() {
      $scope.detectBLEDevice();
    }, 200);

    $timeout(function() {
      $scope.loadEquipments();
    }, 500);

    $scope.translateFilter = $filter("translate");

    $scope.storageGetObj(
      "prefs",
      function(prefs) {
        if (prefs) {
          for (var prop in prefs) {
            $scope.prefs[prop] = prefs[prop];
          }
          $scope.setLang();
        }
      },
      function(err) {
        console.log(err);
      }
    );

    $scope.glbs = {
      heartRate: {
        service: "180d",
        measurement: "2a37"
      },
      cadence: {
        service: "1814",
        measurement: "2a53"
      },
      power: {
        service: "1818",
        measurement: "2a63"
      },
      radius: {
        miles: 3959,
        kms: 6371
      },
      tounit: {
        miles: 1609.344,
        kms: 1000
      },
      pace: {
        miles: 26.8224,
        kms: 16.6667
      },
      speed: {
        miles: 2.2369,
        kms: 3.6
      },
      pacelabel: {
        miles: " min/mile",
        kms: " min/km"
      },
      speedlabel: {
        miles: " mph",
        kms: " kph"
      },
      distancelabel: {
        miles: " miles",
        kms: " km"
      }
    };

    $ionicPlatform.registerBackButtonAction(function() {
      if ($scope.running === false) {
        var view = $ionicHistory.backView();
        if (view) {
          view.go();
        }
      } else {
        $state.go("app.running");
      }
    }, 100);

    $scope.openModal = function() {
      $state.go("app.running");
    };

    $scope.closeModal = function() {
      $state.go("app.sessions");
    };
    $scope.gotoapp = function() {
      window.location="index.html";
    };
    $scope.gotodashboard = function() {
      $state.go("app.dashboard");
    };
    $scope.gotocongratulations = function() {
      $state.go("app.congratulations");
    };

    $scope.registerBluetoothDevice = function(id) {
      if (id in $scope.prefs.registeredBLE) {
        delete $scope.prefs.registeredBLE[id];
      } else {
        $scope.prefs.registeredBLE[id] = $scope.bluetooth_devices[id];
      }
      $scope.savePrefs();
    };

    $scope.detectBLEDevice = function() {
      $scope.bluetooth_devices = {};

      for (var prop in $scope.prefs.registeredBLE) {
        $scope.bluetooth_devices[prop] = {
          id: prop,
          name: $scope.prefs.registeredBLE[prop].name,
          registered: true
        };
      }
      $scope.bluetooth_scanning = true;

      try {
        ble.startScan(
          [],
          function(bledevice) {
            $scope.$apply(function() {
              if (!(bledevice.id in $scope.bluetooth_devices)) {
                if (bledevice.id in $scope.prefs.registeredBLE) {
                  $scope.bluetooth_devices[bledevice.id] = {
                    id: bledevice.id,
                    name: bledevice.name ? bledevice.name : "Unknow",
                    registered: true
                  };
                } else {
                  $scope.bluetooth_devices[bledevice.id] = {
                    id: bledevice.id,
                    name: bledevice.name ? bledevice.name : "Unknow",
                    registered: false
                  };
                }
              }
            });
          },
          function() {
            $scope.$apply(function() {
              $scope.bluetooth_scanning = false;
            });
          }
        );

        setTimeout(function() {
          ble.stopScan(
            function() {
              $scope.$apply(function() {
                $scope.bluetooth_scanning = false;
              });
            },
            function() {
              $scope.$apply(function() {
                $scope.bluetooth_scanning = false;
              });
            }
          );
        }, 5000);
      } catch (exception) {
        $scope.bluetooth_scanning = false;
        console.info("BluetoothLE not available");
      }
    };

    $scope.heartRateOnConnect = function(peripheral) {
      //HEARTRATE

      ble.startNotification(
        peripheral.id,
        $scope.glbs.heartRate.service,
        $scope.glbs.heartRate.measurement,
        $scope.heartRateOnData,
        function(err) {
          console.error("BLE HR error :" + err);
          $scope.session.beatsPerMinute = null;
        }
      );

      //CADENCE
      ble.startNotification(
        peripheral.id,
        $scope.glbs.cadence.service,
        $scope.glbs.cadence.measurement,
        $scope.cadenceOnData,
        function(err) {
          console.error("BLE Cadence error :" + err);
          $scope.session.instantCadence = null;
        }
      );

      //POWER
      ble.startNotification(
        peripheral.id,
        $scope.glbs.power.service,
        $scope.glbs.power.measurement,
        $scope.powerOnData,
        function(err) {
          console.error("BLE Power error :" + err);
          $scope.session.instantPower = null;
          $scope.session.intantStride = null;
        }
      );
    };

    $scope.heartRateOnData = function(buffer) {
      var data = new DataView(buffer);
      if (data.getUint8(0) === 0x1000) {
        $scope.session.beatsPerMinute = data.getUint16(1);
      } else {
        $scope.session.beatsPerMinute = data.getUint8(1);
      }
    };

    $scope.cadenceOnData = function(buffer) {
      //
      var data = new DataView(buffer);
      $scope.session.instantCadence = data.getUint8(3);
      console.log("Instant Cadence" + $scope.session.instantCadence);
      console.log("Data1" + data.getUint8(1));
      console.log("Data2" + data.getUint8(2));
      console.log("Data3" + data.getUint8(3));
      console.log("Data4" + data.getUint8(4));

      if (data.getUint8(0) === 0x1000) {
        $scope.session.instantStride = data.getUint16(4);
      }
    };

    $scope.powerOnData = function(buffer) {
      var data = new DataView(buffer);
      $scope.session.instantPower = data.getInt16(2, true);
    };

    $scope.heartRateOnDisconnect = function(reason) {
      console.debug("BLE Disconnected:" + reason);
      $scope.session.beatsPerMinute = null;
      if ($scope.session.connectedBLE) {
        $scope.session.connectedBLE = null;
      }
    };

    $scope.heartRateScan = function() {
      if (
        Object.keys($scope.prefs.registeredBLE).length > 0 &&
        $scope.session.beatsPerMinute === null
      ) {
        ble.scan(
          [$scope.glbs.heartRate.service],
          5,
          //onScan
          function(peripheral) {
            console.debug("Found " + JSON.stringify(peripheral));

            if (peripheral.id in $scope.prefs.registeredBLE) {
              ble.connect(
                peripheral.id,
                $scope.heartRateOnConnect,
                $scope.heartRateOnDisconnect
              );
              $scope.session.connectedBLE = peripheral.id;
            } else {
              console.debug("Device " + peripheral.id + " not registered");
            }
          },
          function() {
            console.error("BluetoothLE scan failed");
          }
        );
      }
    };
//mywork
$scope.stopChallengeSession = function() {
  $scope.session.saving = true;
  $timeout(function() {
    try {
      GPSLocation.clearWatch($scope.session.watchId);
      console.debug("Session recording stopped");
    } catch (exception) {
      try {
        navigator.geolocation.clearWatch($scope.session.watchId);
        console.debug("Session recording stopped");
      } catch (exception2) {console.error(exception2);}
    }
    $interval.cancel($scope.runningTimeInterval);

    try {
      delete $scope.session.firsttime;
      delete $scope.paused_time;
      delete $scope.initial_paused_time;
      delete $scope.isPaused;
      delete $scope.isResumed;
      delete $scope.paused_time_after_resume;
    } catch (exception) {
      console.warn(exception.message);
    }

    if ($scope.session.gpxData.length > 0) {
      //Session cleaning
      delete $scope.session.accuracy;
      delete $scope.session.elapsed;
      delete $scope.session.firsttime;
      delete $scope.session.elevation;
      delete $scope.session.time;
      delete $scope.session.pace;
      delete $scope.session.speed;
      delete $scope.session.maxspeed;
      delete $scope.session.equirect;
      delete $scope.session.altold;
      delete $scope.session.latold;
      delete $scope.session.lonold;
      delete $scope.session.latold;
      delete $scope.session.lastdisptime;
      delete $scope.session.maxalt;
      delete $scope.session.minalt;
      delete $scope.session.avpace;
      delete $scope.session.avspeed;
      delete $scope.session.lastdistvocalannounce;
      delete $scope.session.lasttimevocalannounce;
      delete $scope.session.timeslowvocalinterval;
      delete $scope.session.lastfastvocalannounce;
      delete $scope.session.kalmanDist;
      $scope.session.fixedElevation = undefined;

      //Set default equipments
      if (!$scope.session.equipments && $scope.equipments) {
        $scope.session.equipments = $scope.equipments
          .map(function(eq) {
            if (eq.isDefault === true) {
              return eq;
            }
            return undefined;
          })
          .filter(function(eq) {
            if (eq !== undefined) return eq;
          });
      }
      $scope.saveSession($scope.session);
    }
    $scope.running = false;
    try {
      cordova.plugins.backgroundMode.disable();
    } catch (exception) {
      console.debug("ERROR: cordova.plugins.backgroundMode disable");
    }
    try {
      window.plugins.insomnia.allowSleepAgain();
    } catch (exception) {
      console.debug("ERROR: cordova.plugins.insomnia allowSleepAgain");
    }

    try {
      window.powerManagement.release(
        function() {
          console.log("Wakelock released");
        },
        function() {
          console.log("Failed to release wakelock");
        }
      );
    } catch (exception) {
      console.warn(exception.message);
    }

    try {
      cordova.plugins.ActivityRecognition.StopActivityUpdates(
        function(msg) {
          cordova.plugins.ActivityRecognition.Dissconnect(
            function(msg) {},
            function(msg) {}
          );
        },
        function(msg) {}
      );
    } catch (exception) {
      console.debug("ERROR: window.ActivityRecognition not enabled");
    }

    try {
      clearInterval($scope.btscanintervalid);
    } catch (exception) {
      console.warn(exception.message);
    }

    if ($scope.platform === "firefoxos") {
      try {
        $scope.screen_lock.unlock();
      } catch (exception) {
        console.warn(exception.message);
      }
      try {
        $scope.gps_lock.unlock();
      } catch (exception) {
        console.warn(exception.message);
      }
    }

    try {
      if ($scope.session.connectedBLE !== null) {
        ble.stopNotification(
          $scope.session.connectedBLE,
          $scope.glbs.heartRate.service,
          $scope.glbs.heartRate.measurement,
          function() {
            console.debug("Diconnected HR Notification");
            $scope.session.beatsPerMinute = null;
          },
          function(err) {
            console.error("BLE HR error :" + err);
            $scope.session.beatsPerMinute = null;
          }
        );

        //CADENCE
        ble.stopNotification(
          $scope.session.connectedBLE,
          $scope.glbs.cadence.service,
          $scope.glbs.cadence.measurement,
          function() {
            console.debug("Diconnected Cadence Notification");
            $scope.session.beatsPerMinute = null;
          },
          function(err) {
            console.error("BLE Cadence error :" + err);
            $scope.session.instantCadence = null;
          }
        );

        //POWER
        ble.stopNotification(
          $scope.session.connectedBLE,
          $scope.glbs.power.service,
          $scope.glbs.power.measurement,
          function() {
            console.debug("Diconnected Power Notification");
            $scope.session.beatsPerMinute = null;
          },
          function(err) {
            console.error("BLE Power error :" + err);
            $scope.session.instantPower = null;
            $scope.session.intantStride = null;
          }
        );

        ble.disconnect($scope.session.connectedBLE);
      }
    } catch (exception) {
      console.warn(exception);
    }

     //$scope.gotodashboard();
    $scope.session.saving = false;
    console.debug('Saving session ended');
  }, 10);
  if($rootScope.challengeStarted){

        $rootScope.getvalues();

      }
};

    //my work
    $scope.stopSession = function() {
      $scope.session.saving = true;
      $timeout(function() {
        try {
          GPSLocation.clearWatch($scope.session.watchId);
          console.debug("Session recording stopped");
        } catch (exception) {
          try {
            navigator.geolocation.clearWatch($scope.session.watchId);
            console.debug("Session recording stopped");
          } catch (exception2) {console.error(exception2);}
        }
        $interval.cancel($scope.runningTimeInterval);

        try {
          delete $scope.session.firsttime;
          delete $scope.paused_time;
          delete $scope.initial_paused_time;
          delete $scope.isPaused;
          delete $scope.isResumed;
          delete $scope.paused_time_after_resume;
        } catch (exception) {
          console.warn(exception.message);
        }

        if ($scope.session.gpxData.length > 0) {
          //Session cleaning
          delete $scope.session.accuracy;
          delete $scope.session.elapsed;
          delete $scope.session.firsttime;
          delete $scope.session.elevation;
          delete $scope.session.time;
          delete $scope.session.pace;
          delete $scope.session.speed;
          delete $scope.session.maxspeed;
          delete $scope.session.equirect;
          delete $scope.session.altold;
          delete $scope.session.latold;
          delete $scope.session.lonold;
          delete $scope.session.latold;
          delete $scope.session.lastdisptime;
          delete $scope.session.maxalt;
          delete $scope.session.minalt;
          delete $scope.session.avpace;
          delete $scope.session.avspeed;
          delete $scope.session.lastdistvocalannounce;
          delete $scope.session.lasttimevocalannounce;
          delete $scope.session.timeslowvocalinterval;
          delete $scope.session.lastfastvocalannounce;
          delete $scope.session.kalmanDist;
          $scope.session.fixedElevation = undefined;

          //Set default equipments
          if (!$scope.session.equipments && $scope.equipments) {
            $scope.session.equipments = $scope.equipments
              .map(function(eq) {
                if (eq.isDefault === true) {
                  return eq;
                }
                return undefined;
              })
              .filter(function(eq) {
                if (eq !== undefined) return eq;
              });
          }
          $scope.saveSession($scope.session);
        }
        $scope.running = false;
        try {
          cordova.plugins.backgroundMode.disable();
        } catch (exception) {
          console.debug("ERROR: cordova.plugins.backgroundMode disable");
        }
        try {
          window.plugins.insomnia.allowSleepAgain();
        } catch (exception) {
          console.debug("ERROR: cordova.plugins.insomnia allowSleepAgain");
        }

        try {
          window.powerManagement.release(
            function() {
              console.log("Wakelock released");
            },
            function() {
              console.log("Failed to release wakelock");
            }
          );
        } catch (exception) {
          console.warn(exception.message);
        }

        try {
          cordova.plugins.ActivityRecognition.StopActivityUpdates(
            function(msg) {
              cordova.plugins.ActivityRecognition.Dissconnect(
                function(msg) {},
                function(msg) {}
              );
            },
            function(msg) {}
          );
        } catch (exception) {
          console.debug("ERROR: window.ActivityRecognition not enabled");
        }

        try {
          clearInterval($scope.btscanintervalid);
        } catch (exception) {
          console.warn(exception.message);
        }

        if ($scope.platform === "firefoxos") {
          try {
            $scope.screen_lock.unlock();
          } catch (exception) {
            console.warn(exception.message);
          }
          try {
            $scope.gps_lock.unlock();
          } catch (exception) {
            console.warn(exception.message);
          }
        }

        try {
          if ($scope.session.connectedBLE !== null) {
            ble.stopNotification(
              $scope.session.connectedBLE,
              $scope.glbs.heartRate.service,
              $scope.glbs.heartRate.measurement,
              function() {
                console.debug("Diconnected HR Notification");
                $scope.session.beatsPerMinute = null;
              },
              function(err) {
                console.error("BLE HR error :" + err);
                $scope.session.beatsPerMinute = null;
              }
            );

            //CADENCE
            ble.stopNotification(
              $scope.session.connectedBLE,
              $scope.glbs.cadence.service,
              $scope.glbs.cadence.measurement,
              function() {
                console.debug("Diconnected Cadence Notification");
                $scope.session.beatsPerMinute = null;
              },
              function(err) {
                console.error("BLE Cadence error :" + err);
                $scope.session.instantCadence = null;
              }
            );

            //POWER
            ble.stopNotification(
              $scope.session.connectedBLE,
              $scope.glbs.power.service,
              $scope.glbs.power.measurement,
              function() {
                console.debug("Diconnected Power Notification");
                $scope.session.beatsPerMinute = null;
              },
              function(err) {
                console.error("BLE Power error :" + err);
                $scope.session.instantPower = null;
                $scope.session.intantStride = null;
              }
            );

            ble.disconnect($scope.session.connectedBLE);
          }
        } catch (exception) {
          console.warn(exception);
        }
        if ($rootScope.challengeStarted) {
            $rootScope.getvalues();


        }
        else {

        $scope.closeModal();}
        $scope.session.saving = false;
        console.debug('Saving session ended');
      }, 10);
    };

    $scope.speakText = function(text) {
      try {
        var utterance = new SpeechSynthesisUtterance();

        utterance.text = text;
        utterance.volume = 1;
        utterance.lang = $scope.prefs.language;
        speechSynthesis.speak(utterance);
      } catch (exception) {
        console.debug("SpeechSynthesisUtterance not available : " + exception);
      }
    };

    $scope.testRunSpeak = function() {
      $scope.session = {};
      $scope.session.equirect = 3.24;
      $scope.session.avspeed = 10.21;
      $scope.session.avpace = "5:48";
      $scope.session.time = "1:28:23";
      $scope.session.beatsPerMinute = 160;
      $scope.runSpeak();
    };

    $scope.runSpeak = function() {
      var speechText = "";
      if ($scope.prefs.distvocalannounce) {
        speechText +=
          $scope.session.equirect.toFixed(2) +
          " " +
          $scope.translateFilter("_kilometers") +
          " ";
      }
      if ($scope.prefs.timevocalannounce) {
        speechText += ", ";
        var hs = $scope.session.time.split(":")[0];
        if (parseInt(hs, 10) > 0) {
          speechText +=
            parseInt(hs).toFixed(0) +
            " " +
            $scope.translateFilter("_hours") +
            " " +
            $scope.translateFilter("_and") +
            " ";
        }
        speechText +=
          parseInt($scope.session.time.split(":")[1]).toFixed(0) +
          " " +
          $scope.translateFilter("_minutes");
      }

      if ($scope.prefs.avgspeedvocalannounce) {
        speechText +=
          ", " +
          $scope.session.speed +
          " " +
          $scope.translateFilter("_kilometers_per_hour") +
          " ";
      }
      if ($scope.prefs.avgpacevocalannounce) {
        speechText += ", ";
        speechText +=
          parseInt($scope.session.avpace.split(":")[0]).toFixed(0) +
          " " +
          $scope.translateFilter("_minutes") +
          " " +
          $scope.translateFilter("_and") +
          " ";
        speechText +=
          parseInt($scope.session.avpace.split(":")[1]).toFixed(0) +
          " " +
          $scope.translateFilter("_seconds_per_kilometers");
      }
      if (
        $scope.prefs.heartrateannounce === true &&
        $scope.session.beatsPerMinute > 0
      ) {
        speechText +=
          ", " +
          $scope.session.beatsPerMinute +
          " " +
          $scope.translateFilter("_bpms") +
          " ";
      }

      $scope.speakText(speechText);
    };

    $scope.activityCallback = function(obj) {
      console.log("ActivityType:" + obj.ActivityType);
      console.log("Probability:" + obj.Propability);
      if (obj.Propability > 80) {
        if (obj.ActivityType == "On Bicycle") {
          $scope.session.types.Ride += 1;
        } else if (obj.ActivityType == "Running") {
          $scope.session.types.Run += 1;
        } else if (obj.ActivityType == "On Foot") {
          $scope.session.types.Run += 1;
        } else if (obj.ActivityType == "Tilting") {
          $scope.session.types.Tilt += 1;
        } else if (obj.ActivityType == "Walking") {
          $scope.session.types.Walk += 1;
        } else {
          console.log("Unknow activity : " + obj.ActivityType);
        }
      }
    };

    $scope.activityErrorCallback = function(obj) {
      console.error(obj);
    };

    $scope.recordPosition = function(pos) {
      console.log(pos);
      console.log("HI" + pos.timestamp);
      if ($scope.mustdelay === false) {
        var latnew = pos.coords.latitude;
        var lonnew = pos.coords.longitude;

        // timenew => gets current time in a number form
        var timenew;
        if($scope.session.distcovered == 0){
          timenew = pos.timestamp;
        }
        else{
          //var timenew = pos.timestamp;
          // Problem lies here : figure out what we need to do to fix problem with changing position
          // Make it count down
        }

        var altnew = "x";
        var elapsed = 0;
        var tinc;
        var K;
        var Q = 1;

        if (typeof pos.coords.altitude === "number") {
          altnew = pos.coords.altitude;
        }

        $scope.$apply(function() {

          $scope.session.accuracy = pos.coords.accuracy;



          if (

            pos.coords.accuracy <= $scope.prefs.minrecordingaccuracy &&

            timenew > $scope.session.recclicked &&

            $scope.session.latold !== "x" &&

            $scope.session.lonold !== "x"

          ) {

            $scope.session.gpsGoodSignalToggle = true;

            if ($scope.prefs.gpslostannounce) {

              $scope.gpslostlastannounce = timenew;

            }

          }



          if (

            pos.coords.accuracy >= $scope.prefs.minrecordingaccuracy &&

            $scope.session.gpsGoodSignalToggle === true &&

            timenew > $scope.session.recclicked

          ) {

            // In case we lost gps we should announce it

            $scope.session.gpsGoodSignalToggle = false;

            if (

              $scope.prefs.gpslostannounce &&

              timenew - 30 > $scope.gpslostlastannounce

            ) {





              $scope.speakText($scope.translateFilter("_gps_lost"));

              $scope.gpslostlastannounce = timenew;

            }

          }



          if ($scope.session.firsttime !== 0) {

            //Elapsed time
            if($scope.isResumed){
              elapsed = Date.now() - $scope.session.firsttime - $scope.session.deltagpstime - $scope.paused_time;
              $scope.elapsed_time = elapsed;

            }else if($scope.isPaused){
              elapsed = $scope.elapsed_time;

            }else {
            elapsed = timenew - $scope.session.firsttime;
            $scope.elapsed_time = elapsed;
            }
            var hour = Math.floor(elapsed / 3600000);

            var minute = (

              "0" +

              (Math.floor(elapsed / 60000) - hour * 60)

            ).slice(-2);

            var second = ("0" + Math.floor((elapsed % 60000) / 1000)).slice(-2);

            $scope.session.time = hour + ":" + minute + ":" + second;

            $scope.session.elapsed = elapsed;



            if (pos.coords.accuracy <= $scope.prefs.minrecordingaccuracy) {

              // Not first point

              if (

                $scope.session.latold !== "x" &&

                $scope.session.lonold !== "x"

              ) {

              //Limit ok

                if (

                  timenew - $scope.session.lastdisptime >=

                  $scope.prefs.minrecordinggap

                ) {

                  $scope.session.lastdisptime = timenew;



                  // Filter new position with a KalmanFilter

                  var accuracy = pos.coords.accuracy;

                  if (accuracy < 1) {

                    accuracy = 1;

                  }

                  if ($scope.session.variance < 0) {

                    $scope.session.variance = accuracy * accuracy;

                  } else {

                    tinc = new Date(timenew) - new Date($scope.session.timeold);

                    if (tinc > 0) {

                      $scope.session.variance += tinc * Q * Q / 1000;

                    }

                    K =

                      $scope.session.variance /

                      ($scope.session.variance + accuracy * accuracy);

                    latnew = $scope.session.latold + (K * (latnew - $scope.session.latold));

                    lonnew = $scope.session.lonold + (K * (lonnew - $scope.session.lonold));

                    $scope.session.variance = (1 - K) * $scope.session.variance;

                  }



                  //FIXME GetActivity

                  try {

                    cordova.plugins.ActivityRecognition.GetActivity(

                      $scope.activityCallback,

                      $scope.activityErrorCallback

                    );

                  } catch (err) {
                    console.warn(err.message);
                  }



                 //Distances

                  var dLat;

                  var dLon;

                  var dLat1;

                  var dLat2;

                  var a, d;

                  var dtd;

                  var dspeed;



                  dLat = (latnew - $scope.session.latold) * Math.PI / 180;

                  dLon = (lonnew - $scope.session.lonold) * Math.PI / 180;

                  dLat1 = $scope.session.latold * Math.PI / 180;

                  dLat2 = latnew * Math.PI / 180;

                  a =

                    Math.sin(dLat / 2) * Math.sin(dLat / 2) +

                    Math.cos(dLat1) *

                      Math.cos(dLat1) *

                      Math.sin(dLon / 2) *

                      Math.sin(dLon / 2);

                  d = (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))) * 6371;



                  //Speed between this and previous point

                  dtd = new Date(timenew) - new Date($scope.session.timeold);

                  dspeed = d / (dtd / 1000 / 60 / 60);



                  elapsed = timenew - $scope.session.firsttime;

                  if (dspeed > 0.001) {
                    if(!$scope.isPaused){
                      $scope.session.equirect += d;
                      $rootScope.distance_travelled += d;
                    }

                  }



                  //Elevation?

                  if ($scope.session.altold !== "x") {

                    $scope.session.altold = altnew;

                    if (altnew > $scope.session.maxalt) {

                      $scope.session.maxalt = altnew;

                      $scope.session.elevation =

                        $scope.session.maxalt - $scope.session.minalt;

                    }

                    if (altnew < $scope.session.minalt) {

                      $scope.session.minalt = altnew;

                      $scope.session.elevation =



                        $scope.session.maxalt - $scope.session.minalt;

                    }

                  }

                  $scope.session.distk = $scope.session.equirect.toFixed(0);

                  if ($scope.session.equirect > 0) {

                    var averagePace =

                      elapsed / ($scope.session.equirect * 60000);

                    $scope.session.avpace =

                      Math.floor(averagePace) +

                      ":" +

                      ("0" + Math.floor((averagePace % 1) * 60)).slice(-2);

                    $scope.session.avspeed = elapsed / $scope.session.equirect;

                  }



                  //Workarround for some device not aving cor speed

                  var gpsspeed;

                  if (pos.coords.speed === null) {

                    gpsspeed = dspeed;

                  } else {

                    gpsspeed = pos.coords.speed;

                  }

                  if (!isNaN(gpsspeed)) $scope.session.speeds.push(gpsspeed);

                  $scope.session.speeds = $scope.session.speeds.slice(-5);

                  $scope.session.speed = average($scope.session.speeds, 1);



                  var currentPace =

                    $scope.glbs.pace[$scope.prefs.unit] / $scope.session.speed;

                  $scope.session.pace =

                    Math.floor(currentPace) +

                    ":" +

                    ("0" + Math.floor((currentPace % 1) * 60)).slice(-2);

                  if ($scope.session.maxspeed < $scope.session.speed) {

                    $scope.session.maxspeed = $scope.session.speed;

                  }



                  $scope.session.latold = latnew;

                  $scope.session.lonold = lonnew;

                  $scope.session.altold = altnew;

                  $scope.session.timeold = timenew;



                  //Alert and Vocal Announce

                  if (parseInt($scope.prefs.distvocalinterval) > 0) {

                    $scope.session.lastdistvocalannounce = 0;

                    if (

                      $scope.session.equirect -

                        $scope.session.lastdistvocalannounce >

                      $scope.prefs.distvocalinterval * 1000

                    ) {

                      $scope.session.lastdistvocalannounce =

                        $scope.session.equirect;

                      $scope.runSpeak();

                    }

                  }



                  if (parseInt($scope.prefs.timevocalinterval) > 0) {

                    if (

                      timenew - $scope.session.lasttimevocalannounce >

                      $scope.prefs.timevocalinterval * 60000

                    ) {

                      /*fixme*/ $scope.session.lasttimevocalannounce = timenew;

                      $scope.runSpeak();

                    }

                  }



                  if (parseInt($scope.prefs.timeslowvocalinterval) > 0) {

                    if (

                      $scope.session.lastslowvocalannounce !== -1 &&

                      timenew - $scope.session.lastslowvocalannounce >

                        $scope.prefs.timeslowvocalinterval * 60000

                    ) {

                      /*fixme*/ $scope.session.lastslowvocalannounce = -1;

                      $scope.session.lastfastvocalannounce = timenew;

                      $scope.speakText($scope.translateFilter("_run_fast"));

                    }

                  }

                  if (parseInt($scope.prefs.timefastvocalinterval) > 0) {

                    if (

                      $scope.session.lastfastvocalannounce !== -1 &&

                      timenew - $scope.session.lastfastvocalannounce >

                        $scope.prefs.timefastvocalinterval * 60000

                    ) {

                      /*fixme*/ $scope.session.lastslowvocalannounce = timenew;

                      $scope.session.lastfastvocalannounce = -1;

                      $scope.speakText($scope.translateFilter("_run_slow"));

                    }

                  }

                }

              }

            }

          } else {

            $scope.session.firsttime = timenew;

            $scope.session.deltagpstime = Date.now() - timenew;

            $scope.session.lastdisptime = timenew;

            $scope.session.lastdistvocalannounce = 0;

            $scope.session.lasttimevocalannounce = timenew;

            $scope.session.lastslowvocalannounce = timenew;

            $scope.session.lastfastvocalannounce = -1;

            $scope.session.latold = latnew;

            $scope.session.lonold = lonnew;

            $scope.session.time = "00:00:00";

            $scope.session.maxspeed = 0;

            $scope.session.speed = 0;

            $scope.session.avspeed = 0;

            $scope.session.elapsed = 0;

            $scope.session.minalt = 99999;

            $scope.session.maxalt = 0;

            $scope.session.elevation = 0;

            $scope.session.speeds = [];

            $scope.session.variance = -1;

          }

          if (

            timenew - $scope.session.lastrecordtime >=

              $scope.prefs.minrecordinggap &&

            pos.coords.accuracy <= $scope.prefs.minrecordingaccuracy

          ) {

            var pointData = [

              pos.coords.latitude.toFixed(6),

              pos.coords.longitude.toFixed(6),

              new Date(timenew).toISOString()

            ];



            if (typeof pos.coords.altitude === "number") {

              pointData.push(pos.coords.altitude);

            } else {

              pointData.push("x");

            }



            if ($scope.session.beatsPerMinute) {

              pointData.push($scope.session.beatsPerMinute);

            } else {

              pointData.push("x");

            }



            pointData.push(pos.coords.accuracy);



            if ($scope.session.instantCadence) {

              pointData.push($scope.session.instantCadence);

            } else {

              pointData.push("x");

            }



            if ($scope.session.instantPower) {

              pointData.push($scope.session.instantPower);

            } else {

              pointData.push("x");

            }



            if ($scope.session.instantStride) {

              pointData.push($scope.session.instantStride);

            } else {

              pointData.push("x");

            }



            $scope.session.gpxData.push(pointData);

            $scope.session.lastrecordtime = timenew;



            // Record Weather

            if ($scope.session.weather === "") {

              $scope.weather

                .byLocation({

                  latitude: latnew,

                  longitude: lonnew

                })

                .then(function(weather) {

                  $scope.session.weather = weather;

                });

            }

          }

        });
      }
    };

    $scope.toRad = function(x) {
      return x * Math.PI / 180;
    };

    $scope.updateEquipments = function(asession) {
      if ($scope.equipments === undefined || $scope.equipments === null) {
        $scope.equipments = [];
      }
      asession.equipments.map(function(equipment) {
        if (
          !$scope.equipments.some(function(e) {
            return e.uuid == equipment.uuid;
          })
        ) {
          $scope.equipments.push(equipment);
        }
      });
      $scope.writeEquipmentsToFile();
    };

    $scope.errorPosition = function(err) {
      console.debug("errorPosition:" + err.message + ":" + err.code);
      $scope.session.gpsGoodSignalToggle = false;
      console.debug("gpsGoodSignalToggle set to false");
      var timenew = Date.now();
      if (
        $scope.prefs.gpslostannounce &&
        timenew - 30 > $scope.gpslostlastannounce
      ) {
        $scope.speakText($scope.translateFilter("_gps_lost"));
        $scope.gpslostlastannounce = timenew;
      }
    };

    $scope.pauseSession = function() {
      $scope.initial_paused_time = Date.now();
      $scope.isPaused = true;
      $scope.isResumed = false;
    };

    $scope.resumeSession = function() {
      $scope.paused_time_after_resume = (Date.now() - $scope.initial_paused_time);
      $scope.paused_time = $scope.paused_time+ $scope.paused_time_after_resume;
      $scope.isPaused = false;
      $scope.isResumed = true;
    };

    $scope.startSession = function() {
      $scope.running = true;
      $scope.gpslostannounced = false;
      $rootScope.distance_travelled = 0;
      $scope.isPaused = false;
      $scope.session = {
        gpsGoodSignalToggle: true,
        recclicked: new Date().getTime(),
        date: moment().format("llll"),
        connectedBLE: null,

        mdate: moment().format("MMMM YYYY"),
        ddate: new Date().getDate(),
        gpxData: [],

        unit: $scope.prefs.unit,
        speedlabel: $scope.glbs.speedlabel[$scope.prefs.unit],
        pacelabel: $scope.glbs.pacelabel[$scope.prefs.unit],
        distancelabel: $scope.glbs.distancelabel[$scope.prefs.unit],

        lastrecordtime: 0,
        elapsed: 0,
        firsttime: 0,

        latold: "x",
        lonold: "x",
        altold: "x",

        time: "00:00:00",
        time2: "00:00:00",
        challenge10k : "50:00",
        challenge5k : "35:00",
        challenge3k : "25:00",
        dist: 0,
        distcovered: 0,

        kalmanDist: new KalmanFilter(0.2, 3, 10),
        equirect: 0,
        elevation: 0,
        maxspeed: 0,
        speed: 0,
        avspeed: 0,
        avpace: "00:00",
        speeds: [],
        weather: "",
        temp: "",
        type: "Run",
        types: { Run: 0, Ride: 0, Walk: 0, Drive: 0, Tilt: 0 }
      };

      $scope.screen_lock = null;
      $scope.gps_lock = null;
      $scope.gpslostlastannounce = 0;

      try {
        if ($scope.platform === "android") {
          cordova.plugins.locationAccuracy
            .request(
              cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY
            )
            .then(
              function() {
                console.log("locationAccuracy success");
              },
              function(err) {
                console.log("Error requesting location permissions", error);
              }
            );
        } else if ($scope.platform === "iOS") {
          cordova.plugins.locationAccuracy.request().then(
            function() {
              console.log("locationAccuracy success");
            },
            function(err) {
              console.log("Error requesting location permissions", error);
            }
          );
        }
      } catch (err) {
        console.error("locationAccuracy plugin seems not available:" + err);
      }

      $scope.mustdelay = $scope.prefs.useDelay === true;
      $scope.delay = new Date().getTime();
      if ($scope.mustdelay === true) {
        $scope.mustdelaytime = new Date().getTime();
        $scope.mustdelayintervalid = setInterval($scope.delayCheck, 500);
      }
      try {
        cordova.plugins.backgroundMode.setDefaults({
          title: "ForRunners",
          ticker: $scope.translateFilter("_notification_slug"),
          text: $scope.translateFilter("_notification_message"),
          color: "FFF",
          hidden: false
        });
        cordova.plugins.backgroundMode.onactivate = function() {
          console.log("backgroundMode onActivate");
          try {
            $scope.session.watchBgId = GPSLocation.watchPosition(
              $scope.recordPosition,
              $scope.errorPosition,
              {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 3000
              }
            );
          } catch (err) {
            $scope.session.watchBgId = navigator.geolocation.watchPosition(
              $scope.recordPosition,
              $scope.errorPosition,
              {
                enableHighAccuracy: true,
                maximumAge: 1000,
                timeout: 6000
              }
            );
          }
        };

        cordova.plugins.backgroundMode.ondeactivate = function() {
          // after several times of interval log, this get called
          if ($scope.session.watchBgId) {
            GPSLocation.clearWatch($scope.session.watchBgId);
          }
          console.log("backgroundMode.ondeactivate");
        };
        cordova.plugins.backgroundMode.enable();
      } catch (exception) {
        console.debug("ERROR: cordova.plugins.backgroundMode not enabled");
      }

      try {
        window.powerManagement.dim(
          function() {
            console.log("Wakelock acquired");
          },
          function() {
            console.log("Failed to acquire wakelock");
          }
        );

        window.powerManagement.setReleaseOnPause(
          false,
          function() {
            console.log("setReleaseOnPause successfully");
          },
          function() {
            console.log("Failed to set");
          }
        );
      } catch (exception) {
        console.warn("ERROR: cordova powerManagement not enabled");
      }

      try {
        cordova.plugins.ActivityRecognition.Connect(
          function(msg) {
            console.log(msg);
            cordova.plugins.ActivityRecognition.StartActivityUpdates(
              10,
              function(msg) {
                console.log(msg);
              },
              function(msg) {
                console.log(msg);
              }
            );
          },
          function(msg) {
            console.log(msg);
          }
        );
      } catch (exception) {
        console.debug("ERROR: window.ActivityRecognition not enabled");
      }

      if ($scope.prefs.keepscreenon === true) {
        try {
          window.plugins.insomnia.keepAwake().then(function() {
            console.log("keepAwake enabled");
          });
        } catch (exception) {
          console.debug("ERROR: window.plugins.insomnia keepAwake");
        }
      }

      try {
        $scope.session.beatsPerMinute = null;
        $scope.btscanintervalid = setInterval($scope.heartRateScan, 10000);
      } catch (exception) {
        console.debug("ERROR: BLEScan:" + exception);
      }

      if ($scope.prefs.debug) {
        $scope.prefs.minrecordingaccuracy = 49;
      } else {
        if ($scope.platform === "iOS") {
          $scope.prefs.minrecordingaccuracy = 33;
        } else {
          $scope.prefs.minrecordingaccuracy = 33;
        }
      }

      if ($scope.platform === "firefoxos") {
        try {
          $scope.gps_lock = window.navigator.requestWakeLock("gps");
          if ($scope.prefs.keepscreenon === true) {
            $scope.screen_lock = window.navigator.requestWakeLock("screen");
          }
        } catch (exception) {
          console.debug(
            "ERROR: Can't set background GPS or keep screen on setting for FirefoxOS:" +
              exception
          );
        }
      }

      if ($scope.platform === "android") {
        $scope.session.watchId = GPSLocation.watchPosition(
          $scope.recordPosition,
          $scope.errorPosition,
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 3000
          }
        );
      } else {
        $scope.session.watchId = navigator.geolocation.watchPosition(
          $scope.recordPosition,
          $scope.errorPosition,
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 3000
          }
        );
      }

      //Timer to update time
      $scope.runningTimeInterval = $interval(function() {

        if ($scope.session.firsttime > 0) {
          var elapsed;
          console.debug($scope.session.firsttime);

          if($scope.isResumed){

            elapsed = Date.now() - $scope.session.firsttime - $scope.session.deltagpstime - $scope.paused_time;
            $scope.elapsed_time = elapsed;

          }else if($scope.isPaused){

            elapsed = $scope.elapsed_time;

          }else {
            elapsed = Date.now() - $scope.session.firsttime - $scope.session.deltagpstime;
            $scope.elapsed_time = elapsed;
            $scope.paused_time = 0;
          }

          var hour = Math.floor(elapsed / 3600000);
          $scope.hours = hour;

          var minute = ("0" + (Math.floor(elapsed / 60000) - hour * 60)).slice(

            -2

          );
          $scope.minute = minute;

          var second = ("0" + Math.floor((elapsed % 60000) / 1000)).slice(-2);
          $scope.second = second;

          $scope.session.time = hour + ":" + minute + ":" + second;

          $rootScope.time_travelled = hour + ":" + minute + ":" + second;

          $scope.time_travelled_in_minutes = minute;

          $scope.session.elapsed = elapsed;

          if($rootScope.challengeStarted){

            if($scope.time_travelled_in_minutes>=$rootScope.time){

              $scope.stopChallengeSession();

            }

          }

        }

      }, 2000);



      $scope.openModal();

    };



          /* for the time function, get the variable from the rootscope
          to get the appropriate time countdown*/

          /*$scope.session.challenge10k = ("0" + (49-minute)).slice(-2) + ":" + ( "0" + (59 - second)).slice(-2);
          $scope.session.challenge5k = ("0" + (34-minute)).slice(-2) + ":" + ( "0" + (59 - second)).slice(-2);
          $scope.session.challenge3k = ("0" + (0-minute)).slice(-2) + ":" + ( "0" + (59 - second)).slice(-2); */
        //  $scope.session.distcovered = $rootScope.distance;













    $scope.delayCheck = function() {
      if (new Date().getTime() - $scope.mustdelaytime < $scope.prefs.delay) {
        $scope.delay = new Date().getTime() - $scope.mustdelaytime;
        $scope.session.time = (
          -($scope.prefs.delay - $scope.delay) / 1000
        ).toFixed(0);
        $scope.$apply();
      } else {
        $scope.mustdelay = false;
        $scope.speakText($scope.translateFilter("go"));
        //$scope.session.time = "00:00:00";

        if ($scope.session.distcovered == 3){
          $scope.session.time = "25:00";
        }
        else if ($scope.session.distcovered == 5){
          $scope.session.time = "35:00";
        }
        else if ($scope.session.distcovered == 10){
          $scope.session.time = "50:00";
        }
        else{
          $scope.session.time = "00:00:00";
        }

        clearInterval($scope.mustdelayintervalid);
        $scope.$apply();
      }
    };

    $scope.saveSession = function(asession) {
      var sessions = $scope.sessions;
      if (!sessions) {
        sessions = {};
        $scope.sessions = {};
      }

      var session_type_nb = 0;
      for (var session_type in asession.types) {
        if (session_type_nb < asession.types[session_type]) {
          session_type_nb = asession.types[session_type];
          asession.type = session_type;
        }
      }

      if (asession.map === undefined) {
        asession.map = {
          center: {
            lat: 48,
            lng: 4,
            zoom: 5,
            autoDiscover: false
          },
          paths: {},
          bounds: {},
          controls: {
            scale: true
          },
          markers: {},
          tiles: {
            url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        };
      }

      if (asession.cityname === undefined && asession.gpxPoints !== undefined) {
        $scope.nominatim
          .byLocation({
            latitude: asession.gpxPoints[0].lat,
            longitude: asession.gpxPoints[0].lng
          })
          .then(function(cityname) {
            console.log(cityname);
            asession.cityname = cityname;
            $scope.saveSessionModifications(asession);
          });
      }

      // Remap Equipments
      try {
        asession.equipments.map(function(equipment, idx) {
          if ($scope.equipments !== undefined && $scope.equipments !== null) {
            if (
              !$scope.equipments.some(function(e) {
                return e.uuid == equipment.uuid;
              })
            ) {
              $scope.equipments.map(function(e) {
                if (e.name === equipment.name) {
                  asession.equipments[idx].uuid = e.uuid;
                }
              });
            }
          }
        });
      } catch (err) {
        console.warn(err);
      }

      $scope.sessions[asession.recclicked] = asession;

      try {
        new SessionFactory()
          .saveToFile(asession, $scope.dataPath)
          .then(function() {
            $scope.updateIndex(asession);
            $scope.updateEquipments(asession);
          });
      } catch (err) {
        console.warn(err);
      }

      try {
        asession = $scope.computeSessionFromGPXData(asession, true);
      } catch (exception) {
        console.error("ComputeSessionFromGPX Failed on save:" + exception);
      }

      //Automated backup
      setTimeout(function() {
        $scope.exportGPXs(false);
      }, 5000);
    };

    $scope.checkPrefs = function() {
      if ($scope.prefs.useVocalAnnounce !== true) {
        $scope.prefs.distvocalinterval = 0;
        $scope.prefs.timevocalinterval = 0;
        return;
      }
    };

    $scope.savePrefs = function() {
      $scope.storageSetObj("prefs", $scope.prefs);
      $scope.setLang();
    };

    $scope.saveSessionModifications = function(asession) {
      $scope.sessions[asession.recclicked] = asession;
      new SessionFactory()
        .saveToFile(asession, $scope.dataPath)
        .then(function() {
          $scope.updateIndex(asession);
        });
      $scope.storageSetObj("version", $scope._version);
    };

    $scope.computeEquipmentsDatas = function() {
      var distance = {};

      if ($scope.equipments) {
        for (var recclicked in $scope.sessionsIndex) {
          if ($scope.sessionsIndex.hasOwnProperty(recclicked)) {
            var idx = $scope.sessionsIndex[recclicked];

            if (idx.equipmentUUIDs !== undefined) {
              for (var eidx in idx.equipmentUUIDs) {
                if (distance[idx.equipmentUUIDs[eidx]] === undefined) {
                  distance[idx.equipmentUUIDs[eidx]] = 0;
                }
                distance[idx.equipmentUUIDs[eidx]] += idx.distance;
              }
            }
          }
        }

        $scope.equipments = $scope.equipments.map(function(equipment) {
          if (distance[equipment.uuid]) {
            equipment.distance = distance[equipment.uuid];
          } else {
            equipment.distance = 0;
          }
          return equipment;
        });
      }
    };
  })

  .controller("SessionsCtrl", function(
    $scope,
    $timeout,
    $state,
    $ionicPopover
  ) {
    "use strict";

    $ionicPopover
      .fromTemplateUrl("templates/sessions_popover.html", {
        scope: $scope
      })
      .then(function(popover) {
        $scope.popover = popover;
      });

    $scope.openPopover = function($event) {
      $scope.popover.show($event);
    };

    $scope.closePopover = function() {
      $scope.popover.hide();
    };

    //Cleanup the popover when we're done with it!
    $scope.$on("$destroy", function() {
      $scope.popover.remove();
    });

    // Execute action on hidden popover
    $scope.$on("popover.hidden", function() {
      // Execute action
    });

    // Execute action on remove popover
    $scope.$on("popover.removed", function() {
      // Execute action
    });

    $timeout(function() {
      //Get position a first time to get better precision when we really
      //start running
      navigator.geolocation.getCurrentPosition(function() {}, function() {}, {
        enableHighAccuracy: true,
        timeout: 60000,
        maximumAge: 0
      });

      if ($scope.prefs.first_run === true) {
        $scope.prefs.first_run = false;
        $scope.savePrefs();
        $state.go("app.help");
      }
    }, 5000);

    $scope.createManualSession = function() {
      $state.go("app.edit_session");
      $scope.closePopover();
    };
  })

  .controller("EquipmentsCtrl", function($scope, $ionicPopup) {
    "use strict";
    if (!$scope.equipments) {
      $scope.equipments = $scope.$parent.loadEquipments();
    }

    $scope.fakeGuid = function() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
        c
      ) {
        var r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    };

    $scope.saveEquipments = function() {
      try {
        $scope.writeEquipmentsToFile($scope.equipments);
      } catch (err) {
        console.warn(err);
      }
      if ($scope.platform === "Browser") {
        $scope.storageSetObj("equipments", $scope.equipments);
      }
      $scope.storageSetObj("version", $scope._version);
    };

    $scope.addEquipment = function() {
      if (!$scope.equipments) {
        $scope.equipments = [];
      }
      $scope.equipments.push({
        uuid: $scope.fakeGuid(),
        name: "Untitled Shoes",
        distance: 0,
        photo: "img/defaultshoes.png"
      });
    };

    $scope.deleteEquipment = function(idx) {
      // confirm dialog
      var confirmPopup = $ionicPopup.confirm({
        title: $scope.translateFilter("_delete_eq"),
        template: $scope.translateFilter("_confirm_delete_eq")
      });
      confirmPopup.then(function(res) {
        if (res) {
          $scope.equipments.splice(idx, 1);
          $scope.saveEquipments();
        } else {
          console.error("Error confirm delete equipment");
        }
      });
    };

    $scope.setName = function(idx) {
      $scope.equipment = $scope.equipments[idx];
      $ionicPopup.show({
        template: '<input type="text" ng-model="equipment.name">',
        title: "Edit the name",
        subTitle: "Example: Sketchers Go Run Sprint",
        scope: $scope,
        buttons: [
          {
            text: "Cancel"
          },
          {
            text: "<b>Save</b>",
            type: "button-positive",
            onTap: function(e) {
              if (!$scope.equipment.name) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                console.log($scope.equipment.name);
                $scope.equipments[idx] = $scope.equipment;
                $scope.saveEquipments();
                return $scope.equipment.name;
              }
            }
          }
        ]
      });
    };

    $scope.setDefault = function(idx) {
      $scope.equipments[idx].isDefault = !$scope.equipments[idx].isDefault;
      $scope.saveEquipments();
    };

    $scope.savePicture = function(uri, uuid) {
      var stordir = $scope.dataPath;

      window.resolveLocalFileSystemURL(
        stordir,
        function(dirEntry) {
          dirEntry.getDirectory(
            "images",
            {
              create: true
            },
            function(subDirEntry) {
              window.resolveLocalFileSystemURL(uri, function(file) {
                file.moveTo(subDirEntry, uuid + ".jpg");
              });
            },
            function() {
              console.log("failed can t open fs");
            }
          );
        },
        function() {
          console.log("failed can t open fs");
        }
      );

      return stordir + "images/" + uuid + ".jpg";
    };

    $scope.setPhoto = function(idx) {
      try {
        navigator.camera.getPicture(
          function(pictureURI) {
            console.log(pictureURI);
            var newURI = $scope.savePicture(
              pictureURI,
              $scope.equipments[idx].uuid
            );
            $scope.$apply(function() {
              $scope.equipments[idx].photo = newURI;
              $scope.saveEquipments();
            });
          },
          function(err) {
            $ionicPopup.alert({
              title: $scope.translateFilter("_camera_picture_error_title"),
              template: err
            });
          },
          {
            destinationType: Camera.DestinationType.FILE_URL,
            quality: 40,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            correctOrientation: false,
            saveToPhotoAlbum: false
          }
        );
      } catch (err) {
        $ionicPopup.alert({
          title: $scope.translateFilter("_camera_picture_error_title"),
          template: $scope.translateFilter("_camera_not_available")
        });
      }
    };

    $scope.computeEquipmentsDatas();
  })

  .controller("RecordsCtrl", function($scope) {
    "use strict";
    $scope.computeRecords = function() {
      $scope.records = { Ride: {}, Run: {}, Walk: {}, Tilt: {}, Other: {} };
      var sessions = $scope.sortedSessionsIndex;
      $scope.total_kms = { Ride: 0, Run: 0, Walk: 0, Tilt: 0, Other: 0 };

      if (sessions) {
        for (var idx = 0; idx < sessions.length; idx++) {
          var session = sessions[idx];

          if (isNaN(session.distk)) {
            console.error("Ignoring this session as distk missing");
            console.error(session);
            continue;
          }
          if ($scope.records[session.type][session.distk] === undefined) {
            $scope.records[session.type][session.distk] = {
              distk: session.distk,
              speed: 0,
              pace: undefined,
              duration: new Date(),
              speeds: [],
              durations: [],
              paces: [],
              av_speed: undefined,
              av_duration: undefined,
              av_pace: undefined,
              type: session.type
            };
          }
          $scope.total_kms[session.type] += session.distance;

          if (
            $scope.records[session.type][session.distk].speed < session.speed
          ) {
            $scope.records[session.type][session.distk].speed = session.speed;
          }
          if ($scope.records[session.type][session.distk].pace === undefined) {
            $scope.records[session.type][session.distk].pace = session.pace;
          } else {
            if (
              $scope.records[session.type][session.distk].pace > session.pace
            ) {
              $scope.records[session.type][session.distk].pace = session.pace;
            }
          }
          if (
            $scope.records[session.type][session.distk].duration >
            session.duration
          ) {
            $scope.records[session.type][session.distk].duration =
              session.duration;
          }
          console.log($scope.records[session.type][session.distk].paces);
          $scope.records[session.type][session.distk].paces.push(session.pace);
          $scope.records[session.type][session.distk].speeds.push(
            session.speed
          );
          $scope.records[session.type][session.distk].durations.push(
            session.duration
          );
          $scope.records[session.type][session.distk].av_pace = average(
            $scope.records[session.type][session.distk].paces,
            0
          );
          $scope.records[session.type][session.distk].av_speed = average(
            $scope.records[session.type][session.distk].speeds,
            1
          );
          $scope.records[session.type][session.distk].av_duration = average(
            $scope.records[session.type][session.distk].durations,
            0
          );
        }
      }
    };

    $scope.computeRecords();
  })

  .controller("SessionCtrl", function(
    $scope,
    $state,
    $stateParams,
    $ionicPopup,
    $ionicHistory,
    $timeout,
    $ionicScrollDelegate,
    SessionFactory,
    $ionicPopover
  ) {
    "use strict";

    $ionicPopover
      .fromTemplateUrl("templates/session_popover.html", {
        scope: $scope
      })
      .then(function(popover) {
        $scope.popover = popover;
      });

    $scope.openPopover = function($event) {
      $scope.popover.show($event);
    };

    $scope.closePopover = function() {
      $scope.popover.hide();
    };

    //Cleanup the popover when we're done with it!
    $scope.$on("$destroy", function() {
      $scope.popover.remove();
    });

    // Execute action on hidden popover
    $scope.$on("popover.hidden", function() {
      // Execute action
    });

    // Execute action on remove popover
    $scope.$on("popover.removed", function() {
      // Execute action
    });

    $scope.deleteSession = function(recid) {
      // confirm dialog
      var confirmPopup = $ionicPopup.confirm({
        title: $scope.translateFilter("_delete"),
        template: $scope.translateFilter("_confirm_delete")
      });
      confirmPopup.then(function(res) {
        if (res) {
          $scope.deleteFileSession(recid);
          delete $scope.sessionsIndex[recid];
          $scope.sortSessions();
          $scope.storageSetObj("index", $scope.sessionsIndex);

          //Back
          var view = $ionicHistory.backView();
          if (view) {
            view.go();
          }
        } else {
          console.error("Error confirm delete session");
        }
      });
    };

    $scope.editSession = function(rid) {
      $state.go("app.edit_session", { sessionId: rid });
      $scope.closePopover();
    };

    $scope.deleteSessionRecID = function(rid) {
      $scope.deleteSession(rid);
    };

    $scope.addEquipmentToSession = function(asession, newEq) {
      if (!asession.equipments) {
        asession.equipments = [];
      }

      asession.equipments.push(newEq);

      try {
        $scope.saveSessionModifications(asession);
      } catch (err) {
        console.warn(err);
      }
      if ($scope.platform === "Browser") {
        $scope.storageSetObj("sessions", $scope.sessions);
      }
    };

    $scope.removeEquipment = function(asession, idx) {
      var confirmPopup = $ionicPopup.confirm({
        title: $scope.translateFilter("_delete_eq"),
        template: $scope.translateFilter("_confirm_delete_eq")
      });
      confirmPopup.then(function(res) {
        if (res) {
          asession.equipments.splice(idx, 1);
          try {
            $scope.saveSessionModifications(asession);
          } catch (err) {
            console.warn(err);
          }
          if ($scope.platform === "Browser") {
            $scope.storageSetObj("sessions", $scope.sessions);
          }
        } else {
          console.error("Error confirm delete equipment");
        }
      });
    };

    $scope.sharePieceOfDOM = function() {
      //share the image via phonegap plugin
      window.plugins.socialsharing.share(
        $scope.session.distance +
          " Kms in " +
          moment($scope.session.duration)
            .utc()
            .format("HH:mm") +
          " ( " +
          $scope.session.speed +
          " Kph ) tracked with #ForRunners",
        "ForRunners",
        document.getElementById("speedvsalt").toDataURL(),
        "http://khertan.net/#forrunners",
        function() {
          //success callback
        },
        function(err) {
          //error callback
          console.error("error in share", err);
        }
      );
    };

    $scope.session = $scope.sessionsIndex[$stateParams.sessionId];
    if ($scope.session.equipments === undefined) {
      $scope.session.equipments = [];
    }
    if ($scope.session.map === undefined) {
      $scope.session.map = {
        center: {
          lat: 48,
          lng: 4,
          zoom: 5,
          autoDiscover: false
        },
        paths: {},
        bounds: {},
        controls: {
          scale: true
        },
        markers: {},
        tiles: {
          url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        }
      };
    }

    var sf = new SessionFactory();
    sf
      .loadFromFile($stateParams.sessionId, $scope.dataPath)
      .then(function(datas) {
        $scope.session = datas;
        if ($scope.session.map === undefined) {
          $scope.session.map = {
            center: {
              lat: 48,
              lng: 4,
              zoom: 5,
              autoDiscover: false
            },
            paths: {},
            bounds: {},
            controls: {
              scale: true
            },
            markers: {},
            tiles: {
              url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
          };
        }

        if (
          $scope.session.cityname === undefined &&
          $scope.session.gpxPoints !== undefined
        ) {
          var asession = $scope.session;
          $scope.nominatim
            .byLocation({
              latitude: $scope.session.gpxPoints[0].lat,
              longitude: $scope.session.gpxPoints[0].lng
            })
            .then(function(cityname) {
              $scope.session.cityname = cityname;
              $scope.saveSessionModifications(asession);
            });
        }

        if (
          ($scope.session.fixedElevation === undefined &&
            $scope.prefs.usegoogleelevationapi === true) ||
          $scope.session.overnote === undefined ||
          $scope.session.gpxPoints === undefined ||
          $scope.prefs.debug === true ||
          $scope.session.paceDetails === undefined ||
          $scope.session.map.paths === undefined ||
          $scope.session.map.bounds === undefined ||
          $scope.session.map.markers === undefined ||
          $scope.session.version !== $scope._version
        ) {
          //PARSE GPX POINTS
          $timeout(function() {
            $scope.session = $scope.computeSessionFromGPXData(
              $scope.session,
              true
            );
          }, 300);
        }

        // Horrible hack to workarround a resize issue with chart.js and ng
        angular.element(document).ready(function() {
          $timeout(function() {
            $ionicScrollDelegate.resize();
          }, 100);
        });
      });
  })

  .controller("EditSessionCtrl", function(
    $scope,
    $stateParams,
    $ionicPopup,
    $ionicHistory,
    $timeout,
    $ionicScrollDelegate,
    SessionFactory,
    $ionicPopover,
    $filter
  ) {
    "use strict";

    $scope.types = ["Run", "Walk", "Ride"];

    $scope.saveSessionModifications = function(asession) {
      $scope.sessions[asession.recclicked] = asession;
      new SessionFactory()
        .saveToFile(asession, $scope.dataPath)
        .then(function() {
          $scope.updateIndex(asession);
        });
      $scope.storageSetObj("version", $scope._version);
    };

    if ($stateParams.sessionId) {
      $scope.session = $scope.sessionsIndex[$stateParams.sessionId];
    } else {
      $scope.session = {
        //gpsGoodSignalToggle: true,
        recclicked: new Date().getTime(),
        date: moment().format("llll"),
        mdate: moment().format("MMMM YYYY"),
        ddate: new Date().getDate(),
        gpxData: [],
        name: "Untitled",
        unit: $scope.prefs.unit,
        speedlabel: $scope.glbs.speedlabel[$scope.prefs.unit],
        pacelabel: $scope.glbs.pacelabel[$scope.prefs.unit],
        distancelabel: $scope.glbs.distancelabel[$scope.prefs.unit],

        duration: new Date(0),
        pace: new Date(0),
        distance: 0,
        elevation: "0",
        maxspeed: "0",
        speed: 0,
        weather: "",
        temp: "",
        type: "Run",
        avg_power: 0,
        avg_cadence: 0,
        eleUp: 0,
        eleDown: 0
      };
    }

    if ($scope.session.equipments === undefined) {
      $scope.session.equipments = [];
    }
    if ($scope.session.map === undefined) {
      $scope.session.map = {
        center: {
          lat: 48,
          lng: 4,
          zoom: 5,
          autoDiscover: false
        },
        paths: {},
        bounds: {},
        controls: {
          scale: true
        },
        markers: {},
        tiles: {
          url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        }
      };
    }

    var sf = new SessionFactory();
    sf
      .loadFromFile($stateParams.sessionId, $scope.dataPath)
      .then(function(datas) {
        if (datas !== null) {
          $scope.session = datas;
        }
      });

    $scope.editEleUp = function() {

      if ($scope.session.eleUp == undefined) {
        $scope.session.eleUp = "";
      }

      var editPopup = $ionicPopup.prompt({
        template: "Elevation in meters",
        title: "Enter Elevation Up",
        inputType: "text",
        defaultText: $scope.session.eleUp.toString()
      });

      editPopup.then(function(res) {
        $scope.saveElevationUp(res);
      });
    };

    $scope.editEleDown = function() {

      if ($scope.session.eleDown == undefined) {
        $scope.session.eleDown = "";
      }

      var editPopup = $ionicPopup.prompt({
        template: "Elevation in meters",
        title: "Enter Elevation Down",
        inputType: "text",
        defaultText: $scope.session.eleDown.toString()
      });

      editPopup.then(function(res) {
        $scope.saveElevationDown(res);
      });
    };

    $scope.editPower = function() {

      if ($scope.session.avg_power == undefined) {
        $scope.session.avg_power = "";
      }

      var editPopup = $ionicPopup.prompt({
        template: "Power in Watts",
        title: "Enter Power",
        inputType: "text",
        defaultText: $scope.session.avg_power.toString()
      });

      editPopup.then(function(res) {
        $scope.savePower(res);
      });
    };

    $scope.editCadence = function() {

      if ($scope.session.avg_cadence == undefined) {
        $scope.session.avg_cadence = "";
      }

      var editPopup = $ionicPopup.prompt({
        template: "Cadence",
        title: "Enter Cadence",
        inputType: "text",
        defaultText: $scope.session.avg_cadence.toString()
      });

      editPopup.then(function(res) {
        $scope.saveCadence(res);
      });
    };

    $scope.editDistance = function() {
      if ($scope.session.distance == undefined) {
        $scope.session.distance = "";
      }
      var editPopup = $ionicPopup.prompt({
        template: "Distance in Kilometer",
        title: "Enter Distance",
        inputType: "text",
        defaultText: $scope.session.distance.toString()
      });

      editPopup.then(function(res) {
        $scope.saveDistance(res);
      });
    };

    $scope.editName = function() {
      if ($scope.session.name == undefined) {
        $scope.session.name = "";
      }

      var editPopup = $ionicPopup.prompt({
        template: "Session name",
        title: "Enter a name",
        inputType: "text",
        defaultText: $scope.session.name.toString()
      });

      editPopup.then(function(res) {
        $scope.saveName(res);
      });
    };

    $scope.editDuration = function() {
      var editPopup = $ionicPopup.prompt({
        template: "Duration in HH:MM:SS",
        title: "Enter Duration",
        inputType: "text",
        defaultText: $filter("date")($scope.session.duration, "HH:mm:ss", "UTC")
      });

      editPopup.then(function(res) {
        $scope.saveDuration(res);
      });
    };

    $scope.saveType = function(type_) {
      //FIXME Compute Pace Duration Note
      if (type_ === undefined) return;
      $scope.session.type = type_;
      $scope.saveSessionModifications($scope.session);
    };
    $scope.saveCadence = function(avg_cadence) {
      //FIXME Compute Pace Duration Note
      if (avg_cadence === undefined) return;
      $scope.session.avg_cadence = avg_cadence;
      $scope.saveSessionModifications($scope.session);
    };
    $scope.savePower = function(avg_power) {
      //FIXME Compute Pace Duration Note
      if (avg_power === undefined) return;
      $scope.session.avg_power = avg_power;
      $scope.saveSessionModifications($scope.session);
    };
    $scope.saveElevationUp = function(eleup) {
      //FIXME Compute Pace Duration Note
      if (eleup === undefined) return;
      $scope.session.eleUp = eleup;
      $scope.saveSessionModifications($scope.session);
    };
    $scope.saveElevationDown = function(eledown) {
      //FIXME Compute Pace Duration Note
      if (eledown === undefined) return;
      $scope.session.eleDown = eledown;
      $scope.saveSessionModifications($scope.session);
    };

    $scope.saveAvgPace = function(avgPace) {
      //FIXME Compute Speed Duration Note
    };

    $scope.saveDistance = function(dist) {
      //FIXME Compute Speed Pace Note
      if (dist === undefined) return;
      $scope.session.distance = parseFloat(dist);
      $scope.session.distk = $scope.session.distance.toFixed(0);
      var elapsed =
        $scope.session.duration.getUTCHours() * 3600 +
        $scope.session.duration.getUTCMinutes() * 60 +
        $scope.session.duration.getUTCSeconds();
      $scope.session.speed = $scope.session.distance / (elapsed / 3600);
      $scope.session.pace = new Date(60 / $scope.session.speed * 60000);
      $scope.saveSessionModifications($scope.session);
    };

    $scope.saveName = function(name) {
      if (name === undefined) return;
      $scope.session.name = name;
      $scope.saveSessionModifications($scope.session);
    };

    $scope.saveDuration = function(duration) {
      //FIXME Compute Speed Pace Note
      if (duration === undefined) return;
      duration = duration.split(":");
      console.log(duration);
      $scope.session.duration = new Date(
        (parseInt(duration[0]) * 3600 +
          parseInt(duration[1]) * 60 +
          parseInt(duration[2])) *
          1000
      );
      console.log($scope.session.duration);

      var elapsed =
        $scope.session.duration.getUTCHours() * 3600 +
        $scope.session.duration.getUTCMinutes() * 60 +
        $scope.session.duration.getUTCSeconds();
      $scope.session.speed = $scope.session.distance / (elapsed / 3600);
      $scope.session.pace = new Date(60 / $scope.session.speed * 60000);
      $scope.saveSessionModifications($scope.session);
    };
  })

  .controller("FilePickerController", function(
    $scope,
    $ionicPlatform,
    FileFactory,
    $ionicHistory
  ) {
    "use strict";
    var fs = new FileFactory();

    $ionicPlatform.ready(function() {
      fs.getEntries("file:///storage").then(
        function(result) {
          $scope.files = result;
        },
        function(error) {
          console.error(error);
        }
      );

      $scope.getContents = function(path) {
        fs.getEntries(path).then(function(result) {
          if (result instanceof FileEntry) {
            var view = $ionicHistory.backView();
            if (view) {
              view.go();
            }
            result.file(
              function(gotFile) {
                $scope.importGPX(gotFile);
              },
              function(err) {
                console.error(err);
              }
            );
          } else {
            $scope.files = result;
            $scope.files.unshift({
              name: "[parent]"
            });
            fs.getParentDirectory(path).then(function(result) {
              result.name = "[parent]";
              $scope.files[0] = result;
            });
          }
        });
      };
    });
  })

  .controller("SettingsCtrl", function($scope) {
    "use strict";
    //$scope.promptForRating = function() {
    //AppRate.preferences.storeAppURL.android = 'market://details?id=net.khertan.forrunners';
    //AppRate.preferences.promptAgainForEachNewVersion = false;
    //AppRate.promptForRating();
    //};

    //if ($scope.sessions.length > 8) {
    //    $scope.promptForRating();
    //}
  })
  //music api
  .controller('PlaylistCtrl', function($scope, $stateParams, Spotify) {



    var listid = $stateParams.listid;



    var userid = $stateParams.userid;



    $scope.listname = $stateParams.listname;







    $scope.audio = new Audio();







    $scope.tracks = [];







    Spotify.getPlaylist(userid, listid).then(function (data) {



      $scope.tracks = data.tracks.items;



    });







    $scope.playTrack = function(trackInfo) {



      $scope.audio.src = trackInfo.track.preview_url;



      $scope.audio.play();



    };







    $scope.openSpotify = function(link) {



      window.open(link, '_blank', 'location=yes');



    };






    $scope.stop = function() {

      if ($scope.audio.src) {

        $scope.audio.pause();

      }

    };


    $scope.play = function() {
    if ($scope.audio.src) {
      $scope.audio.play();
      }



    };



  })
  .controller('ListsCtrl', function($scope, $ionicPlatform, $cordovaOauth, Spotify) {



      var clientId = '618d5296bbea4ff88e0f759c53bfce1e';



      $scope.playlists = [];







        $scope.performLogin = function() {



          $cordovaOauth.spotify(clientId, ['user-read-private', 'playlist-read-private']).then(function(result) {



            window.localStorage.setItem('spotify-token', result.access_token);



            Spotify.setAuthToken(result.access_token);



            $scope.updateInfo();



          }, function(error) {



              console.log("Error -> " + error);



          });



        };







        $scope.updateInfo = function() {



          Spotify.getCurrentUser().then(function (data) {



            $scope.getUserPlaylists(data.id);



          }, function(error) {



            $scope.performLogin();



          });



        };







        $ionicPlatform.ready(function() {



          var storedToken = window.localStorage.getItem('spotify-token');



          if (storedToken !== null) {



            Spotify.setAuthToken(storedToken);



            $scope.updateInfo();



          } else {



            $scope.performLogin();



          }



        });







        $scope.getUserPlaylists = function(userid) {



          Spotify.getUserPlaylists(userid).then(function (data) {



            $scope.playlists = data.items;



          });



        };



    })
//bilal
  .controller("DashboardCtrl", function($scope,$state,
  $window,
  $rootScope) {

          $scope.startChallenge = function() {
                $rootScope.challengeStarted = true;
                $scope.startSession();
                };


          $rootScope.getvalues = function() {
            $rootScope.challengeStarted = false;

              $rootScope.actual_time = $scope.getActualTime();
              console.log($rootScope.actual_time);
              $rootScope.target_time = $rootScope.time;
              console.log($rootScope.target_time);
              $rootScope.target_distance = $rootScope.distance;
              console.log($rootScope.target_distance);
              $rootScope.actual_distance = $scope.getActualDistance();
              console.log($rootScope.actual_distance);
              console.log($rootScope.distance);
              $rootScope.progress = ($scope.actual_distance/$rootScope.distance)*100; //progress wil always be 0 cause distance cover is 0.0 km
              //$rootScope.progress = 100;
              console.log($rootScope.progress);

              $rootScope.calculator =(($rootScope.progress)/100)*360;

              if($scope.actual_distance >= $rootScope.distance){
                $rootScope.status = "Passed";
              }
              else{
                $rootScope.status = "Failed";

              }
              if($rootScope.calculator <= 180 ){
                $rootScope.degree_right = $rootScope.calculator;
                $rootScope.degree_left = 0;

              }
              if($rootScope.calculator > 180 ){
                $rootScope.degree_right = 180;
                $rootScope.degree_left =  $rootScope.calculator - 180 ;
              }

              if($rootScope.distance == 3)
                {
                $scope.session.bar = 1;
                $scope.session.progress = $rootScope.progress;
                //$scope.session.progress = 20;
                $scope.saveSession($scope.session);
                }
                else if ($rootScope.distance == 5)
                {
                $scope.session.bar = 2;
                $scope.session.progress = $rootScope.progress;
                //$scope.session.progress = 40;
                $scope.saveSession($scope.session);
                }
                else if ($rootScope.distance == 10)
                {
                $scope.session.bar = 3;
                $scope.session.progress = $rootScope.progress;
                $scope.saveSession($scope.session);
                }
                else{
                $scope.session.bar = 4;
                $scope.session.progress = $rootScope.progress;
                $scope.session.customDistance = $rootScope.target_distance;
                $scope.saveSession($scope.session);
                }
              if($rootScope.progress >= 100){
                $scope.gotocongratulations();
              }
              else{
              $scope.gotodashboard();
              }
              };

              $scope.getActualDistance=function(){
            if($rootScope.distance_travelled==undefined || isNaN($rootScope.distance_travelled)){
               return 0;
      }
      else {
        return $rootScope.distance_travelled;
      }
    };

    $scope.getActualTime=function(){
      if($rootScope.time_travelled==undefined){
        return "0:00:00";
      }
      else {
        return $rootScope.time_travelled;
      }
    };








  })
  //bilal

  .controller('LoginCtrl', ['$scope', '$state', 'CommonProp', '$window', function(
      $scope,
      $state,
      CommonProp,
      $window
      ){

  	$scope.userId = CommonProp.getUserId();

    $scope.signout = function(){
    CommonProp.logoutUser();
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentFood');
    sessionStorage.removeItem('foodList');
    sessionStorage.removeItem('selectedDay');
    $window.location.href="#/app/login";
    $window.location.reload();
    };

  	$scope.signIn = function(fb = firebase){
  		var email = $scope.user.email;
  		var password = $scope.user.password;

  		fb.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        $scope.errMsg = true;
        $scope.errorMessage = error.message;
       });

      fb.auth().onAuthStateChanged(function(user) {
        fb.database().ref('Users/' + user.uid).once('value').then(function(snapshot) {
            var userInfo=snapshot.val();
            // ensures that when the user logs in, they are redirected to profile page and side menu
            // can be accessed without going back to login page.
            // redirects to profile page on successful login
            $state.go("app.profile");
            $state.reload();
            $window.location.href="#/app/profile";
            $window.location.reload();

            let key = 'currentUser';
            let value = {'username':userInfo.username,'email':userInfo.email,'age':userInfo.age,
                                  'weight':userInfo.weight, 'height':userInfo.height, 'gender': userInfo.gender, 'activity': userInfo.activity};
            value = JSON.stringify(value);
            sessionStorage.setItem(key, value);


          });
      });

  	};


  }])

  .controller('RegisterCtrl', ['$scope', '$state','$ionicPopup', function($scope, $state, $ionicPopup){

  	$scope.signUp = function(fb = firebase){
      var username = $scope.user.Username;
      var email = $scope.user.email;
  		var password = $scope.user.password;

  		if(email && password){
  			fb.auth().createUserWithEmailAndPassword(email, password).then(function(){
        var id = fb.auth().currentUser.uid;
        var ref = fb.database().ref("Users/"+id).set({email: email, password: password, username: username});
  			$state.go("app.login");
        var registeredPopup= $ionicPopup.alert({
           title: "Successfully Registered"
         });
  			}).catch(function(error){
          var invalidRegistrationPopup = $ionicPopup.alert({
            title: "A user already exists with the specified email address"
          });
  				$scope.errMsg = true;
  				$scope.errorMessage = error.message;
  			});
  		}
  	};

  }])

  .controller('ProfileCtrl', ['$scope', function(
    $scope
    ){

    if(sessionStorage.getItem('currentUser')!=null){
      $scope.user=JSON.parse(sessionStorage.getItem('currentUser'));
    }

    $scope.genders=["Male","Female"];
    $scope.activity=["Little/ no exercise","Moderately active","Very active"];

    //Updates user info without having to press a button "save"
    $scope.change = function(fb = firebase) {
      let key = 'currentUser';
      let value = $scope.user;
      value = JSON.stringify(value);
      sessionStorage.setItem(key, value);
      var id = fb.auth().currentUser.uid;
      var ref = fb.database().ref("Users/"+id);
      ref.update({
        age: $scope.user.age
      });
      ref.update({
        weight: $scope.user.weight
      });
      ref.update({
        height: $scope.user.height
      });
      ref.update({
        gender: $scope.user.gender
      });
      ref.update({
        activity: $scope.user.activity
      });
    };

  }])

  .controller("EmailCtrl",
   function($scope, $http,$stateParams) {
     // train of thought for tmr:
     // store elements in arrays for each function(speed,pace, etc)
     // store html's while looping in functions

      if(sessionStorage.getItem('currentUser')!=null){
        $scope.user=JSON.parse(sessionStorage.getItem('currentUser'));

        var session_id = localStorage.getItem("index").split('"');
        session_ids = [];

        $scope.test=
            session_id.reduce(function(session_ids, e, i) {
            if (e === 'name')
            session_ids.push(i-2);
            return session_ids;
        }, []);

        var distance_arr = [];
        var name_arr = [];
        var dates = [];
        var session_names = [];
        var duration =[];
        var speed = [];
        var pace =[];

        for (i = 0; i < $scope.test.length; i++) {
          console.log("***********");
          console.log(session_id[$scope.test[i]]);

          var name_of_session = session_id[$scope.test[i]] + '.json';
          console.log(name_of_session);
          console.log("***********");
          name_arr.push(name_of_session);
          var get_information_per_session = localStorage.getItem(""+name_of_session+"");

        $scope.distanced=
            localStorage.getItem(name_of_session).split('"').reduce(function(session_ids, e, i) {
            if (e === 'distance')
            session_ids.push(i+1);
            return session_ids;
        }, []);

        console.log($scope.distanced);

        /*var distance_travelled = localStorage.getItem(name_of_session).split('"')[$scope.distanced].substring(1,2);
        distance_arr.push(distance_travelled);
        console.log("CHUNGUS");
        console.log(distance_travelled);
        */
        $scope.date=
            localStorage.getItem(name_of_session).split('"').reduce(function(session_ids, e, i) {
            if (e === 'date')
            session_ids.push(i+2);
            return session_ids;
        }, []);

        var date_of_session = localStorage.getItem(name_of_session).split('"')[$scope.date];

        /*console.log($scope.date);
        console.log(date_of_session);*/
        dates.push(date_of_session);

        $scope.name=
            localStorage.getItem(name_of_session).split('"').reduce(function(session_ids, e, i) {
            if (e === 'name')
            session_ids.push(i+2);
            return session_ids;
        }, []);

        /*console.log($scope.name);
        console.log(localStorage.getItem(name_of_session).split('"')[$scope.name]);*/
        session_names.push(localStorage.getItem(name_of_session).split('"')[$scope.name]);

        $scope.duration=
            localStorage.getItem(name_of_session).split('"').reduce(function(session_ids, e, i) {
            if (e === 'duration')
            session_ids.push(i+2);
            return session_ids;
        }, []);

        /*console.log($scope.duration);
        console.log(localStorage.getItem(name_of_session).split('"')[$scope.duration].substring(11,19));*/
        //duration.push(localStorage.getItem(name_of_session).split('"')[$scope.duration].substring(11,19));

        $scope.speed=
            localStorage.getItem(name_of_session).split('"').reduce(function(session_ids, e, i) {
            if (e === 'speed')
            session_ids.push(i+1);
            return session_ids;
        }, []);

        console.log("HHH");
        //console.log($scope.speed);
        //console.log(localStorage.getItem(name_of_session).split('"')[$scope.speed].substring(1,4));
        speed.push(localStorage.getItem(name_of_session).split('"')[$scope.speed].substring(1,4));

        $scope.pace=
            localStorage.getItem(name_of_session).split('"').reduce(function(session_ids, e, i) {
            if (e === 'pace')
            session_ids.push(i+2);
            return session_ids;
        }, []);

        /*console.log($scope.pace);
        console.log(localStorage.getItem(name_of_session).split('"')[$scope.pace].substring(11,19));*/
        //pace.push(localStorage.getItem(name_of_session).split('"')[$scope.pace].substring(11,19));

      var mailgunUrl = "connectconcordia.tk";
      var mailgunApiKey = window.btoa("api:key-e63cfbbb0bb500d1b5428053228f6360");
      var email = $scope.user.email;
    }
    console.log($scope.user);
    console.log(duration);
    email_template = '';
    for (i = 0; i < $scope.test.length; i++) {
      email_template += "<h1>ForRunners : Your Stats</h1>"
      +"<h2>Name of Session: "+localStorage.getItem(name_arr[i]).split('"')[$scope.name]+"</h2>"
      +"<h2>Date: "+dates[i]+"</h2>"+
      '<div class="grid-container" style = "display: grid;grid-template-columns: auto auto;background-color: #000000;padding: 0px;">'+
      '<div class="grid-item" style="background-color: rgba(255, 255, 255, 0.8);border: 5px solid rgba(255, 255, 255, 255);padding: 30px;font-size: 30px;text-align: center;background-color:#2196F3;"><p style="color:white;background-color:#2196F3;">Average Speed:'+
      speed[i]+'km/hr'+'</p></div>'+
      '<div class="grid-item" style="background-color: rgba(255, 255, 255, 0.8);border: 5px solid rgba(255, 255, 255, 255);padding: 30px;font-size: 30px;text-align: center;background-color:#2196F3;"><p style="color:white;background-color:#2196F3;">Distance:'+' '+
      distance_arr[i] +' km'+'</p></div>'+
      '<div class="grid-item" style="background-color: rgba(255, 255, 255, 0.8);border: 5px solid rgba(255, 255, 255, 255);padding: 30px;font-size: 30px;text-align: center;background-color:#2196F3;"><p style="color:white;background-color:#2196F3;">Total Time of Run: '+
      duration[i]+'</p></div>'+
      '<div class="grid-item" style="background-color: rgba(255, 255, 255, 0.8);border: 5px solid rgba(255, 255, 255, 255);padding: 30px;font-size: 30px;text-align: center;background-color:#2196F3;"><p style="color:white;background-color:#2196F3;">Time for one Km covered: '+
      pace[i]
      +'</p></div>'+
      '</div>';
    }
      }



    /*var curr_date = new Date();
    var hour = curr_date.getHours();
    var minute = curr_date.getMinutes();
    var second = curr_date.getSeconds();
    console.log(minute);

    if(hour == 9 && minute == 00 && second == 00){
      sendEmailInMorning();
    }

    function sendEmailInMorning() {
      var date_of_session = localStorage.getItem(name_of_session).split('"')[$scope.date];
      console.log("HEEERE");

      console.log(distance_arr);
      console.log(date_of_session);
      // do addition of stuff
      $http({
        "method": "POST",
        "url": "https://api.mailgun.net/v3/" + mailgunUrl + "/messages",
        "headers": {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": "Basic " + mailgunApiKey
        },
        data: "from=" + "ForRunners Admin <mailgun@connectconcordia.tk>" + "&to=" + email + "&subject=" + "Your ForRunners Stats"
        + "&html="+ email_template
      }).then(function(success) {
        console.log("SUCCESS " + JSON.stringify(success));
      }, function(error) {
        console.log("ERROR " + JSON.stringify(error));
      });

    }*/

    $scope.send = function() {
      var date_of_session = localStorage.getItem(name_of_session).split('"')[$scope.date];
      console.log("HEEERE");

      console.log(distance_arr);
      console.log(date_of_session);
      // do addition of stuff
      $http({
        "method": "POST",
        "url": "https://api.mailgun.net/v3/" + mailgunUrl + "/messages",
        "headers": {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": "Basic " + mailgunApiKey
        },
        data: "from=" + "ForRunners Admin <mailgun@connectconcordia.tk>" + "&to=" + email + "&subject=" + "Your ForRunners Stats"
        + "&html="+ email_template
      }).then(function(success) {
        console.log("SUCCESS " + JSON.stringify(success));
      }, function(error) {
        console.log("ERROR " + JSON.stringify(error));
      });

  };

  })

  .controller("HelpCtrl", function($scope, $state, $ionicScrollDelegate) {
    "use strict";
    $scope.help_cur = 1;
    $scope.next = function() {
      $scope.help_cur += 1;
      $scope.go();
      $ionicScrollDelegate.scrollTop();
    };
    $scope.previous = function() {
      $scope.help_cur -= 1;
      if ($scope.help_cur <= 0) {
        $scope.help_cur = 1;
      }
      $scope.go();
      $ionicScrollDelegate.scrollTop();
    };

    $scope.go = function() {
      if ($scope.help_cur >= 1 || $scope.help_cur <= 6) {
        $scope.help_path = "img/help_" + $scope.help_cur + ".svg";
        $scope.help_subtitle = $scope.translateFilter(
          "_help_subtitle_" + $scope.help_cur
        );
        $scope.help_desc = $scope.translateFilter(
          "_help_desc_" + $scope.help_cur
        );
      } else if ($scope.help_cur === 7) {
        $state.go("app.sessions");
      }
    };
    $scope.go();
  })

  .controller("FoodCtrl", function(
    $scope,
    $state,
    $ionicPopup,
    $window
  ) {

    $scope.makeFoodList=function(){
      var rootRef = firebase.database().ref("Foods").orderByKey();
      rootRef.on("value",function(snapshot) {
          $scope.foods=[];
          snapshot.forEach(function(childSnapshot) {
          var childData = childSnapshot.val();
          $scope.foods.push(childData);
        });
      });
    };

    $scope.makeFoodList();


    $scope.foodDetails= function(food){

      let key = 'currentFood';
      let value = food;
          value = JSON.stringify(value);
          sessionStorage.setItem(key, value);
      $state.go("app.foodInfo");
    };


    $scope.calculate=function(){
      if(sessionStorage.getItem('currentUser')!=null){
        $scope.user=JSON.parse(sessionStorage.getItem('currentUser'));
      }
      //If all requirements are met user can go to calculation page
      if(sessionStorage.getItem('foodList')!=null &&
        $scope.user.age!=null     &&
        $scope.user.weight!=null  &&
        $scope.user.gender!=null  &&
        $scope.user.activity!= null){
        $state.go("app.calculation");
        $scope.errorFoodList=false;
      }else{
        //If a user info is missing
        if( $scope.user.age==null     ||
            $scope.user.weight==null  ||
            $scope.user.gender==null  ||
            $scope.user.activity== null){
              $state.go("app.profile");
              var profilePopup= $ionicPopup.alert({
                 title: "Please fill all fields of Profile page!"
               });
            }else{
              //if list of food is empty
              $scope.errorFoodList=true;
            }
      }

    };
    $scope.addFood=function(){
      $state.go("app.newFood");
    };

    $scope.change = function() {
      $scope.errorMessage=false;
       for (food in  $scope.foods){
        if($scope.foods[food].name.toLowerCase() == $scope.foodName.toLowerCase()){
          $scope.errorMessage=true;
        }
      }
    };

    $scope.save= function(){

      var rootRef = firebase.database().ref("Foods");
      var lastId;

      if(!$scope.errorMessage){
        rootRef.once("value")
        .then(function(snapshot) {
        lastId = snapshot.numChildren();
        lastId++ ;
        firebase.database().ref("Foods/"+lastId).set({
          'name':$scope.foodName,
          'calories':$scope.calories,
          'amount':$scope.amount,
          'unit': $scope.unit});
        });
        $state.go("app.food");
        var newfood={'name':$scope.foodName,'calories':$scope.calories,
          'amount':$scope.amount,'unit': $scope.unit};
        return newfood;
      }

    };
  })

  .controller("FoodInfoCtrl",function(
    $scope,
    $state,
    $window
  ){
    if(sessionStorage.getItem('currentFood')!=null){
      $scope.food=JSON.parse(sessionStorage.getItem('currentFood'));
      $scope.localAmount=$scope.food.amount;
      $scope.localCalories=$scope.food.calories;
    }

    $scope.change = function() {
      $scope.food.calories=Math.round(($scope.food.amount/$scope.localAmount)*$scope.localCalories);
      return $scope.food.calories;
    };

    $scope.addToList= function(){

      if(sessionStorage.getItem('foodList')==null){
        //This is the first element of the list
        let key = 'foodList';
        let foodArray = [];
        let firstItem={'name':$scope.food.name,'calories':$scope.food.calories,'amount':$scope.food.amount,'unit':$scope.food.unit};
            foodArray.push(firstItem);
        let value ={'currentCalories':$scope.food.calories,'list':foodArray};
        sessionStorage.setItem(key, JSON.stringify(value) );
        $state.go("app.food");
      }else{
        //This to add other foods to list

        let key = 'foodList';
        let foodList=JSON.parse(sessionStorage.getItem('foodList'));

        let calories=foodList.currentCalories + $scope.food.calories;
        let item = {'name':$scope.food.name,'calories':$scope.food.calories,'amount':$scope.food.amount,'unit':$scope.food.unit};
        let foodArray=foodList.list;
            foodArray.push(item);
        let value ={'currentCalories':calories,'list':foodArray};
        sessionStorage.setItem(key, JSON.stringify(value));
        $state.go("app.food");
      }
    };
  })

  .controller("CalculationCtrl",function(
    $scope,
    $state
  ){


    $scope.calculate=function(){
    if(sessionStorage.getItem('currentUser')!=null &&
        sessionStorage.getItem('foodList')!=null){

      $scope.user=JSON.parse(sessionStorage.getItem('currentUser'));
      $scope.consumedFood = JSON.parse(sessionStorage.getItem('foodList'));
      $scope.consumedCalories=$scope.consumedFood.currentCalories;

      //using formula from https://www.runnersworld.com/uk/health/weight-loss/a766022/calculate-your-calorie-needs/
      if ($scope.user.gender == "Male"){
        switch (true) {
            case ($scope.user.age>=1 && $scope.user.age<=18 ):
                $scope.RMR= ($scope.user.weight*12.2)+ 746;
                break;
            case ($scope.user.age>=19 && $scope.user.age<=30 ):
                $scope.RMR= ($scope.user.weight*14.7)+ 496;
                break;
            case ($scope.user.age>=31):
                $scope.RMR= ($scope.user.weight*8.7)+ 829;
                break;
            default:
                console.log("Please enter your age in profile page.");
            }
      }else{
        switch (true) {
            case ($scope.user.age>=1 && $scope.user.age<=18 ):
                $scope.RMR= Math.round(($scope.user.weight*17.5)+ 651);
                break;
            case ($scope.user.age>=19 && $scope.user.age<=30 ):
                $scope.RMR= Math.round(($scope.user.weight*15.3)+ 679);
                break;
            case ($scope.user.age>=31):
                $scope.RMR= Math.round(($scope.user.weight*11.6)+ 879);
                break;
            default:
                console.log("Please enter your age in profile page.");
          }
      }
      switch (true) {
            case ($scope.user.activity == "Little/ no exercise"):
                $scope.expenditure= Math.round($scope.RMR*1.4);
                break;
            case ($scope.user.activity == "Moderately active"):
                $scope.expenditure= Math.round($scope.RMR*1.7);
                break;
            case ($scope.user.activity == "Very active"):
                $scope.expenditure= Math.round($scope.RMR*2.0);
                break;
            default:
                console.log("Please enter your level of activity in profile page.");
          }

          $scope.caloriesToBurn=$scope.consumedCalories-$scope.expenditure;

          //If user consume less calories than he/she needs another message is given
          if($scope.caloriesToBurn<0){
            $scope.negativeMessage=true;
            return $scope.negativeMessage;
          }else{
            $scope.distanceToRun=($scope.caloriesToBurn)/100;
            return $scope.distanceToRun;
          }
    }else{
      return false;
    }
    };
    $scope.calculate();

    $scope.ok= function(){
      sessionStorage.removeItem('foodList');
      $state.go("app.food");
    };
  })


  .controller("ChallengesCtrl", function(
    $scope,
    $state,
    $window,
    $rootScope
  ) {
    $scope.threeKm=function(){
      $rootScope.distance = 3; //km
      $rootScope.time = 20; //min
      $rootScope.source = 'img/'+$rootScope.distance+'k.png';
      $rootScope.src = 'img/about-bg.jpg';
      $rootScope.message = 'A Great Place To Start';
      $state.go("app.challenge");
    };

    $scope.fiveKm=function(){
      $rootScope.distance = 5; //km
      $rootScope.time = 35; //min
      $rootScope.source = 'img/'+$rootScope.distance+'k.png';
      $rootScope.src = 'img/'+$rootScope.distance+'k.jpg';
      $rootScope.message = 'The Next Step';
      $state.go("app.challenge");
    };

    $scope.tenKm=function(){
      $rootScope.distance = 10; //km
      $rootScope.time = 50; //min
      $rootScope.source = 'img/'+$rootScope.distance+'k.png';
      $rootScope.src = 'img/'+$rootScope.distance+'k.jpg';
      $rootScope.message = 'A Serious Goal';
      $state.go("app.challenge");
    };

    $scope.default=function(){
      $rootScope.distance = 0; //km
    };

    $scope.customGoal=function(){
      $rootScope.distance = $scope.goal.distance; //km
      console.log($rootScope.distance);
      $rootScope.time = $scope.goal.time; //min
      console.log($rootScope.time);
      $rootScope.source = 'img/gear-a.png';
      $rootScope.src = 'img/custom-goal-man-tying-shoes.jpeg';
      $rootScope.message = 'Custom Goal';
      $state.go("app.challenge");
    };
  })

  .controller("CalendarCtrl",function(
    $scope,$state
  ){
      $scope.todayDate = new Date();
      var days=[31,28,31,30,31,30,31,31,30,31,30,31]; //Days of each month
      $scope.months=['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      $scope.month=$scope.months[$scope.todayDate.getMonth()];
      $scope.year=$scope.todayDate.getFullYear();
      if(sessionStorage.getItem("currentUser")!=null){
        $scope.user=JSON.parse(sessionStorage.getItem('currentUser'));

        var id=$scope.user.uid;
        var rootRef = firebase.database().ref("Users/"+id+"/events").orderByKey();

        rootRef.once("value",function(snapshot) {
            $scope.allEvents=[];
            snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            $scope.allEvents.push(childData);
          });
        }).then(function(){
            buildMonth();
        });
      }


      $scope.previous=function(){
        var currentMonth = $scope.months.indexOf($scope.month);
        if(currentMonth==0){
          $scope.month='December';
          $scope.year--;
        }else{
          $scope.month=$scope.months[currentMonth-1];
        }
        buildMonth();
      };

      $scope.next=function(){
        var n = $scope.months.indexOf($scope.month);
        if(n==11){
          $scope.month='January';
          $scope.year++;
        }else{
          $scope.month=$scope.months[n+1];
        }
        buildMonth();
      };

      $scope.addEvent = function() {
        $state.go("app.createEvent");
      };

      $scope.seeEvents= function(day){
        if(day!=""){
          let key = 'selectedDay';
          var name=$scope.month+" "+day.number+","+$scope.year;
          var date= Date.parse(new Date($scope.year,$scope.months.indexOf($scope.month), day.number));
          var id = firebase.auth().currentUser.uid;
          var rootRef = firebase.database().ref("Users/"+id+"/events").orderByKey();
          rootRef.once("value",function(snapshot) {
              $scope.events=[];
              snapshot.forEach(function(childSnapshot) {
              var childData = childSnapshot.val();
              $scope.events.push(childData);
            });
          }).then(function(){
            let value = {"name":name,"date":date,"events":$scope.events,"color":day.events};
                value = JSON.stringify(value);
                sessionStorage.setItem(key, value);
            $state.go("app.dayEvents");
          });
        }

      };

      function buildMonth() {
        //Events of this months
        var eventsOfMonth={};
        var color;
        for(ev in $scope.allEvents){
          var eventDate =new Date($scope.allEvents[ev].eventDate);
          if(eventDate.getMonth()==$scope.months.indexOf($scope.month) && eventDate.getFullYear()==$scope.year){
            if(!eventsOfMonth[eventDate.getDate()]){
              var listDayEv=[];
              color=getRandomColor();
              listDayEv.push({"color":color});
              eventsOfMonth[eventDate.getDate()]=listDayEv;
            }else {
              color=getRandomColor();
              eventsOfMonth[eventDate.getDate()].push({"color":color});
            }

          }
        }
        var first_of_month=new Date($scope.year, $scope.months.indexOf($scope.month),1);//First day of month
        var first_day_month=first_of_month.getDay();
        var num_weeks =Math.floor((days[$scope.months.indexOf($scope.month)]+first_day_month)/7);
        if(days[1]==28){
          days[1]+=CheckLeapYear($scope.year)?1:0;
        }else{
          if(days[1]==29 && CheckLeapYear($scope.year)){
            days[1]=29;
          }else{
            days[1]=28;
          }
        }

        $scope.weeks=[];
        var day_number=1;
        for(i=0; i<=num_weeks; i++){
              $scope.weeks[i]=[];
              for(j=0; j<7; j++){
                if(i==0 && j<first_day_month){ // First week of month, incomplet
                  $scope.weeks[i][j]="";
                }else{
                  if(day_number<=days[$scope.months.indexOf($scope.month)]){
                    if(eventsOfMonth[day_number]){
                      $scope.weeks[i][j]={"number":day_number,"events":eventsOfMonth[day_number]};
                    }else{
                      $scope.weeks[i][j]={"number":day_number};
                    }
                    day_number++;
                  }else{
                    $scope.weeks[i][j]="";
                  }
                }
              }// end for week days
            }// end for weeks
        }

      function CheckLeapYear(year){
      return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
      }

      function getRandomColor() {
        var lum = -0.25;
        var hex = String('#' + Math.random().toString(16).slice(2, 8).toUpperCase()).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        var color = "#",
            c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i * 2, 2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 180)).toString(16);
            color += ("00" + c).substr(c.length);
        }
        return color;
      }

  })

  .controller("EventCtrl",function($scope,$state,$window){

    $scope.changeStart = function() {
      if($scope.eventEndTime!=null && $scope.eventStartTime >= $scope.eventEndTime){
        $scope.startError=true;
      }else{
        $scope.startError=false;
        $scope.endError=false;
      }
    };
    $scope.changeEnd = function() {
      if($scope.eventStartTime!=null && $scope.eventEndTime <= $scope.eventStartTime){
        $scope.endError=true;
      }else{
        $scope.endError=false;
        $scope.startError=false;
      }
    };

    $scope.saveEvent= function(){
        var id = firebase.auth().currentUser.uid;
        var eventId=Date.parse(new Date());
        firebase.database().ref("Users/"+id+"/events/"+eventId).set({
          'name':$scope.eventName,
          'eventDate':Date.parse($scope.eventDate),
          'startHour':$scope.eventStartTime.getHours(),
          'startMin':$scope.eventStartTime.getMinutes(),
          'endHour': $scope.eventEndTime.getHours(),
          'endMin': $scope.eventEndTime.getMinutes(),
          'id':eventId
        });
        $window.location.href="#/app/calendar";
        $window.location.reload();
    };
  })

  .controller("EventsCtrl", function(
    $scope,
    $ionicPopup,
    $state,
    $window
  ){

    if(sessionStorage.getItem('selectedDay')!=null){
      $scope.day=JSON.parse(sessionStorage.getItem('selectedDay'));
      var allEvents=$scope.day.events;
      $scope.eventsOfDay=[];
      var counter=0;
      var event;
      for(event in allEvents){
        if(allEvents[event].eventDate==$scope.day.date){
          allEvents[event].startMin=pad2(allEvents[event].startMin);
          allEvents[event].endMin=pad2(allEvents[event].endMin);
          allEvents[event].color=$scope.day.color[counter].color;
          allEvents[event].startTime= new Date("January 01, 1970 "+allEvents[event].startHour+":"+allEvents[event].startMin+":00");
          allEvents[event].endTime= new Date("January 01, 1970 "+allEvents[event].endHour+":"+allEvents[event].endMin+":00");
          counter++;
          $scope.eventsOfDay.push(allEvents[event]);
        }
      }
    }

    function pad2(number) {
      var nb=""+number;
      if(nb.length<2){
           return (number < 10 ? '0' : '') + number;
      }else{
        return number;
      }
    }

    $scope.deleteEvent = function(event){

      // confirm dialog
      var confirmPopup = $ionicPopup.confirm({
        title: "Delete",
        template: "Are you sure you want to delete this event?"
      });
      confirmPopup.then(function(res) {
        if (res) {
          $scope.eventsOfDay.splice($scope.eventsOfDay.indexOf(event), 1);
          var id = firebase.auth().currentUser.uid;
          var ref = firebase.database().ref("Users/"+id+"/events/"+event.id);
          ref.remove();
          $window.location.href="#/app/calendar";
          //reloading so calendar can have correct number of events in day
          $window.location.reload();
        } else {
          console.error("Error confirm delete event");
        }
      });
    };

    $scope.editEvent = function(event){
      if(event.inEdition){
        event.inEdition=false;
      }else{
        event.inEdition=true;
      }
    };

    $scope.submitEdit= function(event){
      event.startHour=event.startTime.getHours();
      event.startMin=pad2(event.startTime.getMinutes());
      event.endHour=event.endTime.getHours();
      event.endMin=pad2(event.endTime.getMinutes());
      event.inEdition=false;
      var id = firebase.auth().currentUser.uid;
      var eventId= event.id;
      var ref = firebase.database().ref("Users/"+id+"/events/"+eventId);
      ref.update({
        startHour: event.startHour
      });
      ref.update({
        startMin: event.startMin
      });
      ref.update({
        endHour: event.endHour
      });
      ref.update({
        endMin: event.endMin
      });
      ref.update({
        name: event.name
      });
    };

    $scope.cancelEdit =function(event){
      event.inEdition=false;
    };

    $scope.addEvent = function() {
      $state.go("app.createEvent");
    };

  })
  //my coach
  .controller("CreatePlanCtrl", function($scope, $state ,$rootScope){


    $scope.exercise=function(){
  $state.go("app.excercise");
};
$scope.tips=function(){
$state.go("app.tips");
};




})

  .controller('ShareCtrl', ['$scope', function($scope){
    $scope.share = function(t){
        var link = "https://play.google.com/store/apps/details?id=net.khertan.forrunners&hl=en";
        var msg = "Hello Friend! \
         I have successfully completed the " + $scope.distance + "K challenge on the ForRunners App!\
         To download the app click on the link below \
         Link: " + link;
         var img = "";
         if($scope.distance == 3)
                {
                  img = "img/3kcongrats.png";
                }
                else if ($scope.distance == 5)
                {
                  img = "img/5kcongrats.png";
                }
                else if ($scope.distance == 10)
                {
                  img = "img/10kcongrats.png";

                }
        console.log(msg);

        if(t == 'w')
            window.plugins.socialsharing
            .shareViaWhatsApp(msg, img, link);
        else if(t == 'f')
            window.plugins.socialsharing
            .shareViaFacebook(msg, img, link);
        else if(t == 't')
            window.plugins.socialsharing
            .shareViaTwitter(msg, img, link);
        else if(t == 'sms')
            window.plugins.socialsharing
            .shareViaSMS(msg+' '+img+' '+link);
        else
        {
            window.plugins.socialsharing
            .shareViaEmail(msg, img, link);
        }
    };
}]);
