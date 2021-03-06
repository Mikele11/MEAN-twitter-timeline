var app = angular.module('Twitter', ['ngResource', 'ngSanitize']);

app.controller('TweetList', function($scope, $resource, $timeout) {


    function init () {

      // set a default username value
      $scope.username = "juventusfc";
      
      // empty tweet model
      $scope.tweetsResult = [];

      // initiate masonry.js
      $scope.msnry = new Masonry('#tweet-list', {
        columnWidth: 320,
        itemSelector: '.tweet-item',
        transitionDuration: 0,
        isFitWidth: true
      });

      // layout masonry.js on widgets.js loaded event
      twttr.events.bind('loaded', function () {
        $scope.msnry.reloadItems();
        $scope.msnry.layout();
      });

      $scope.getTweets();
    }


    function getTweets (paging) {

      var params = {
        action: 'user_timeline',
        user: $scope.username
      };
	console.log($scope.maxId);
	console.log($scope);
      if ($scope.maxId) {
        params.max_id = $scope.maxId;
      }

      // create Tweet data resource
      $scope.tweets = $resource('/tweets/:action/:user', params);

      // GET request using the resource
      $scope.tweets.query( { }, function (res) {

        if( angular.isUndefined(paging) ) {
          $scope.tweetsResult = [];
        }

        $scope.tweetsResult = $scope.tweetsResult.concat(res);

        // for paging - https://dev.twitter.com/docs/working-with-timelines
        $scope.maxId = res[res.length - 1].id;

        // render tweets with widgets.js
        $timeout(function () {
          twttr.widgets.load();
        }, 30);
      });
    }

    $scope.getTweets = function () {
      $scope.maxId = undefined;
      getTweets();
    }

    $scope.getMoreTweets = function () {
      getTweets(true);
    }

    init();
});
