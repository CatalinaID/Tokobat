angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
  
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('LoginCtrl', function($scope, $state) {
  $scope.login = function(username, password) {
    console.log(username);
    console.log(password);
    if (username == 'Hayyu' && password == 'password') {
      $state.go('tab.dash');
    } 
  };
  
})

.controller('SearchCtrl', function($scope) {

})

.controller('UploadCtrl', function($scope, Camera, $cordovaImagePicker, $ionicPlatform, Pesanan) {
  $scope.getPhoto = function() {
    Camera.getPicture().then(function(imageURI) {
      console.log(imageURI);
      $scope.uri = imageURI;
    }, function(err) {
      console.err(err);
    }, {
      quality: 75,
      targetWidth: 320,
      targetHeight: 320,
      saveToPhotoAlbum: false
    });
  }

  $ionicPlatform.ready(function() {
    $scope.pickPhoto = function() {
      var options = {
        maximumImagesCount: 1,
        width: 320,
        height: 320,
        quality: 75
      };

      $cordovaImagePicker.getPictures(options).then(function (results) {
        for (var i = 0; i < results.length; i++) {
          $scope.uri = results[i];
        }
      }, function(err) {
        console.err(err);
      });
    };
  })

  $scope.setUpPesanan = function(name){
    console.log(name);
    Pesanan.setNamaPesanan(name);
    Pesanan.setUriImage($scope.uri);
  }
  
})

.controller('FindApotekCtrl', function($scope, $state, $cordovaGeolocation, Pesanan) {
  $scope.namaPesanan = Pesanan.getNamaPesanan();

  var options = {timeout: 10000, enableHighAccuracy: true};
  var infowindow;
 
  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
 
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    infowindow = new google.maps.InfoWindow();

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var request = {
      query: document.getElementById('pac-input').value,
    };

    var service = new google.maps.places.PlacesService($scope.map);
    service.textSearch(request, callback);

  }, function(error){
    console.log("Could not get location");
  });

  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        createMarker(results[i]);
      }
    }
  }

  function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: $scope.map,
      position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(place.name);
      infowindow.open($scope.map, this);
    });
  }


});
