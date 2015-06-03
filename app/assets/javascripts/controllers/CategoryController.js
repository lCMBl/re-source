app.controller("CategoryController", [
  '$scope',
  '$location',
  '$route',
  '$routeParams',
  'Journey',
  'Category',
  'Note',
  'Snippet',
  'UnassignedSnippet',
  'Owner',
  '$sce',
  function($scope, $location, $route, $routeParams, Journey, Category, Note, Snippet, UnassignedSnippet, Owner, $sce ) {
    var regex = /users\/(.)#/;
    var user_id = regex.exec($location.absUrl());
    $scope.fullPath = $location.absUrl();

    var owner = Owner.check( {id: user_id[1]} );
    owner.$promise.then( function(response) {
      $scope.isOwner = response.isOwner;
    });

    $scope.journey = Journey.get({id: $routeParams.journey_id});
    $scope.category = Category.get({journey_id: $routeParams.journey_id, id: $routeParams.id});
    $scope.notes = Note.index( { journey_id: $routeParams.journey_id, category_id: $routeParams.id } );

    $scope.unassignedSnippets = UnassignedSnippet.index({user_id: user_id[1]});// handle current user on rails side.

    $scope.notes.$promise.then( function() {
      angular.forEach($scope.notes,function(note,index){
        $scope.notes[index].snippets = Snippet.index( { journey_id: $routeParams.journey_id, category_id: $routeParams.id, note_id: note.id } );
      });
    })



    $scope.showForm = false;
    $scope.visibleSnipForm = [];
    $scope.editNoteFlag = [];

    $scope.displayForm = function() {
      $scope.showForm = true;
      $scope.note = {};
    }

    $scope.createNote = function() {
      Note.create( {journey_id: $scope.journey.id, category_id: $scope.category.id}, $scope.note )
        .$promise.then( function(response) {
          //Add note title to sidebar
          // liTitle = "<li id=id" +response.id+ ">" +response.title+ "</li>";
          // $(".note-list").append(liTitle)
          // $scope.showForm = false;

          //Add note to bottom of notes div

          $route.reload();
        })
    }

    $scope.deleteNote = function(note) {
      var msg = "are you sure you want to delete this Note and all included snippets?"
      if (confirm(msg)) {
        Note.destroy( {journey_id: $scope.journey.id}, note).$promise.then( function() {
          $(".note-list").find("#id" +note.id).remove();
          $(".notes").find("#" +note.id).remove();
        } );
      }
    }

    $scope.showNoteForm = function(note) {
      $scope.editNoteFlag[note.id] = true;
      $scope.editingNote = note;
    }

    $scope.editNote = function(note) {
      Note.update( {journey_id: $scope.journey.id}, $scope.editingNote).$promise.then( function() {
          $scope.editNoteFlag[note.id] = false;
        } );
    }

    $scope.showSnipForm = function(note) {
      $scope.visibleSnipForm[note.id] = true;
      $scope.snippet = {};
    }

    $scope.saveSnip = function(note) {
      Snippet.create( {journey_id: $scope.journey.id, category_id: $scope.category.id, note_id: note.id}, $scope.snippet )
        .$promise.then( function(response) {
          //add the snips in here with DOM manipulation

          $route.reload();
        });
    }

    $scope.saveSnipEdit = function(note, snippet) {
      Snippet.update( {journey_id: $scope.journey.id, category_id: $scope.category.id, note_id: note.id, snippet_id: snippet.id}, snippet )
    }

    $scope.deleteSnippet = function(snippet) {
      Snippet.destroy( {journey_id: $scope.journey.id, category_id: $scope.category.id}, snippet).$promise.then( function() {
        $(".show-snippets-container").find("#snip" + snippet.id).remove();
      })
    }

    $scope.addToNote = function(note, snippet) {
      snippet.note_id = note.id;

      Snippet.update( {journey_id: $scope.journey.id, category_id: $scope.category.id, note_id: note.id, snippet_id: snippet.id}, snippet )
        .$promise.then( function(response){
          console.log("We give a shit. Improve on this.");
          $route.reload();
        })
    }

    $scope.display = function(item) { return ($scope.isOwner || item.public_bool) };

    $scope.validUrl = function(snippet) {
      if (snippet.cached_url) {return true}
      else {return false}
    }

    $scope.to_trusted = function(html_code) {
      return $sce.trustAsHtml(html_code);
    }
  }
]);
