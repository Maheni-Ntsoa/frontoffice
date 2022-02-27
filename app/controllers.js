
var app = angular.module('myApp', ['ngRoute']);


app.controller('signin', function ($window, $scope, $http) {
  //$scope.token = $window.sessionStorage.removeItem("token");

  $scope.log = function (admin) {
    $http({
      method: "POST",
      url: 'https://webservicefoetmo.herokuapp.com/api/adminregion/login',
      data: admin,
      dataType: 'application/json'
    }).then(
      function (res) {
        $window.sessionStorage.setItem("token", res.data.Token);
        if (typeof res.data.Token != 'undefined') {
          $window.sessionStorage.setItem("token", res.data.Token);
          $window.sessionStorage.setItem("idregion", res.data.idregion);
          $window.location.href = 'Acceuil.html';
        }
        else {
          alert('login incorrect   ' + res.data.message);
        }
      }
    );
  }
});





app.controller('out', function ($window, $scope) {
  $scope.logout = function () {
    $scope.token = $window.sessionStorage.removeItem("token");
    $scope.token = $window.sessionStorage.removeItem("idregion");
    $window.location.href = 'index.html';
  }
});

app.controller('andrana', function ($window, $scope, $http) {
  $scope.token = $window.sessionStorage.getItem("token");
  $scope.signal = [];
  $scope.data = {};
  console.log("token  " + $scope.token);
  var config = {
    headers: {
      'Authorization': "bearer " + $scope.token
    }
  };
  $http.get("https://webservicefoetmo.herokuapp.com/api/adminregion/signalements", config).then(function (response) {
    $scope.signal = response.data;
    //console.log( $scope.signal );
  });
  // $scope.nomregion = [];
  // $scope.nbregion = [];
  // $scope.signale = function (signe) {
  //   $scope.data = signe;
  //   return $scope.data;
  // }

  // $scope.recherche = function (newR) {
  //   console.log(newR.date2);
  // };
});

app.controller('carte', function ($window, $scope, $http) {
  $scope.token = $window.sessionStorage.getItem("token");
  $scope.idregion = $window.sessionStorage.getItem("idregion");
  console.log($scope.token);

  var config = {
    headers: {
      'Authorization': "Bearer " + $scope.token
    }
  };
  // function determineColor(rating) {
  //   if (rating === 1) {
  //     return new L.Icon({
  //       iconUrl: '../img/marker-icon-2x-yellow.png',
  //       iconSize: [25, 41],
  //       iconAnchor: [12, 41],
  //       popupAnchor: [1, -34]
  //     });
  //   } else if (rating === 2) {
  //     return new L.Icon({
  //       iconUrl: '../img/marker-icon-2x-orange.png',
  //       iconSize: [25, 41],
  //       iconAnchor: [12, 41],
  //       popupAnchor: [1, -34]
  //     });
  //   } else if (rating === 3) {
  //     return new L.Icon({
  //       iconUrl: '../img/icon.png',
  //       iconSize: [25, 41],
  //       iconAnchor: [12, 41],
  //       popupAnchor: [1, -34]
  //     });
  //   }
  // };

  $http.get("https://webservicefoetmo.herokuapp.com/api/adminregion/signalements", config).then(function (response) {
    $scope.signal = response.data;
    console.log($scope.signal);
    //console.log($scope.signal.length);
    var map = L.map('map').setView([-18.887, 47.0006], 5);
    $http.get("https://webservicefoetmo.herokuapp.com/api/adminregion/typeSignalements", config).then(function (response) {
      console.log(response.data);
      $scope.typesignale = response.data;

      return $scope.typesignale;
    });
    $http.get("https://webservicefoetmo.herokuapp.com/api/adminregion/status", config).then(function (response) {
      console.log(response.data);
      $scope.statut = response.data;

      return $scope.statut;
    });


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    var marker = [];
    for (let i = 0; i < $scope.signal.length; i++) {
      marker[i] = L.marker([$scope.signal[i].latitude, $scope.signal[i].longitude]).addTo(map);
      marker[i].bindPopup('<p>Designation:' + $scope.signal[i].designation + '</p><p>Region:' + $scope.signal[i].nomregion
        + '</p><p>Statut:' + $scope.signal[i].nomstatut + '</p><p><a href="Apropos.html?idsigne='
        + $scope.signal[i].id + '">a propos </a></p>');

    }

    $scope.search = function () {
      for (let i = 0; i < $scope.signal.length; i++) {
        map.removeLayer(marker[i]);
      }
      $scope.date1 = $scope.d1 + " " + $scope.h1 + ":00";
      $scope.date2 = $scope.d2 + " " + $scope.h2 + ":00";
      //console.log("http://localhost:8084/api/adminregion/recherche/signalements/" + $scope.idtype + "/" + $scope.idstatut + "/" + $scope.idregion + "/" + $scope.date1 + "/" + $scope.date2);
      $http.get("https://webservicefoetmo.herokuapp.com/api/adminregion/recherche/signalements/" + $scope.idtype + "/" + $scope.idstatut + "/" + $scope.idregion + "/" + $scope.date1 + "/" + $scope.date2
        , config).then(function (response) {
          $scope.rech = response.data;
          console.log($scope.rech);
          for (let i = 0; i < $scope.rech.length; i++) {
            marker[i] = L.marker([$scope.rech[i].latitude, $scope.rech[i].longitude], { icon: determineColor($scope.rech[i].idstatut) }).addTo(map);
            marker[i].bindPopup('<p>Designation:' + $scope.rech[i].designation + '</p><p>Region:' + $scope.rech[i].nomregion 
            + '</p><p>Statut:' + $scope.rech[i].nomstatut + '</p><p><a href="Apropos.html?idsigne=' 
            + $scope.rech[i].id + '">a propos </a></p>');

          }
        });
    }
  });



});
app.controller('details', function ($window, $location, $scope, $http) {
  $scope.token = $window.sessionStorage.getItem("token");
  var config = {
    headers: {
      'Authorization': "Bearer " + $scope.token
    }
  };

  var paramValue = $location.search().idsigne;
  console.log(paramValue);
  $http.get("https://webservicefoetmo.herokuapp.com/api/adminregion/signalement/" + paramValue, config).then(function (response) {
    console.log(response.data);
    $scope.signal = response.data;
  });
});

app.controller('recherche', function ($window, $location, $scope, $http) {
  $scope.token = $window.sessionStorage.getItem("token");
  $scope.idregion = $window.sessionStorage.getItem("idregion");
  var config = {
    headers: {
      'Authorization': "Bearer " + $scope.token
    }
  };
  //console.log("add "+$scope.d1);
  $http.get("https://webservicefoetmo.herokuapp.com/api/adminregion/typeSignalements", config).then(function (response) {
    console.log(response.data);
    $scope.typesignale = response.data;

    return $scope.typesignale;
  });
  $http.get("https://webservicefoetmo.herokuapp.com/api/adminregion/status", config).then(function (response) {
    console.log(response.data);
    $scope.statut = response.data;

    return $scope.statut;
  });

  $scope.search = function () {
    $scope.date1 = $scope.d1 + " " + $scope.h1 + ":00";
    $scope.date2 = $scope.d2 + " " + $scope.h2 + ":00";
    //console.log("http://localhost:8084/api/adminregion/recherche/signalements/"+$scope.idtype+"/"+$scope.idstatut+"/"+$scope.idregion+"/"+$scope.date1+"/"+$scope.date2);
    $http.get("https://webservicefoetmo.herokuapp.com/api/adminregion/recherche/signalements/" + $scope.idtype + "/" + $scope.idstatut + "/" + $scope.idregion + "/" + $scope.date1 + "/" + $scope.date2
      , config).then(function (response) {

        console.log(response.data);
        $scope.rech = response.data;
        return $scope.rech;

      });
  }
});

app.config(['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) => {
  //$window.sessionStorage.removeItem("token");
  $routeProvider
    .when('/', {
      templateUrl: 'index.html',
      controller: 'conroller'

    })
    .when('/stat', {
      templateUrl: 'stat.html',
      controller: 'stat'
    })
    .otherwise({
      redirectTo: '/helloworld.html'
    })
  $locationProvider.html5Mode(true);
}]);