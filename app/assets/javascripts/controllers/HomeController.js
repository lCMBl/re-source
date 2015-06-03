app.controller("HomeController", [
  '$scope',
  '$location',
  '$route',
  'Journey',
  'Owner',
  function($scope, $location, $route, Journey, Owner) {
    var regex = /users\/(.)#/;
    var user_id = regex.exec($location.absUrl());

    var owner = Owner.check( {id: user_id[1]} );
    owner.$promise.then( function(response) {
      $scope.isOwner = response.isOwner;
      console.log("Owner inside? " +$scope.isOwner);
    });
    console.log("Owner outside? " +$scope.isOwner)

    $scope.journeys = Journey.index({user_id: user_id[1]});

    $scope.showForm = false;

    $scope.displayForm = function() {
      $scope.showForm = true;
      $scope.journey = {};
    }

    $scope.createJourney = function() {
      Journey.create( $scope.journey ).$promise
        .then( function(response) {
          $location.url("/journeys/" + response.id );
        })
    }

    $scope.deleteJourney = function(journey) {
      var msg = "are you sure you want to delete this Journey and all the categories and notes in it?"
      if (confirm(msg)) {
        Journey.destroy(journey).$promise.then(function() {
          $(".sidebar").find("#" +journey.id).remove();
        });
      }
    }

    $scope.display = function(item) {
      console.log("display for: " +item.title)
      console.log("item public?: " + item.public_bool)
      console.log($scope.isOwner || item.public_bool);
      return ($scope.isOwner || item.public_bool)
    };


  }
]);
