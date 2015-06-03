app.controller("HomeController", [
  '$scope',
  '$location',
  '$route',
  'Journey',
  'Owner',
  function($scope, $location, $route, Journey, Owner) {
    var regex = /users\/(\d*)/;
    var user_id = $location.absUrl().match(regex);
    debugger
    // var user_id = regex.exec($location.absUrl());
    console.log("user id is: " + user_id);
    console.log(user_id[1])
    debugger
    var owner = Owner.check( {id: user_id[1]} );
    owner.$promise.then( function(response) {
      $scope.isOwner = response.isOwner;
    });
    debugger
    $scope.journeys = Journey.index({user_id: user_id[1]});

    $scope.showForm = false;
    debugger
    $scope.displayForm = function() {
      $scope.showForm = true;
      $scope.journey = {};
    }
    debugger
    $scope.createJourney = function() {
      Journey.create( $scope.journey ).$promise
        .then( function(response) {
          $location.url("/journeys/" + response.id );
        })
    }
    debugger
    $scope.deleteJourney = function(journey) {
      var msg = "are you sure you want to delete this Journey and all the categories and notes in it?"
      if (confirm(msg)) {
        Journey.destroy(journey).$promise.then(function() {
          $(".sidebar").find("#" +journey.id).remove();
        });
      }
    }

    $scope.display = function(item) {
      return ($scope.isOwner || item.public_bool)
    };


  }
]);
