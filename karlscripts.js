var config = {
    apiKey: "AIzaSyD1iQ0OP8z-uTe6snVy9Tg82nIZ_4uMshs",
    authDomain: "multijournal-1f8ab.firebaseapp.com",
    databaseURL: "https://multijournal-1f8ab.firebaseio.com",
    projectId: "multijournal-1f8ab",
    storageBucket: "multijournal-1f8ab.appspot.com",
    messagingSenderId: "1075543197778"
};
firebase.initializeApp(config);
var database = firebase.database();
var inputapp = angular.module('inputapp', []);
var postapp = angular.module('postapp', []);

inputapp.controller('inputCtrl', function ($scope) {

    $scope.postsList = [
        // {title:"Sample title", content:"Sample content", name:"Hasse Aro"}
    ];
    $scope.createPost = function () {
        var ref = database.ref('posts');
        var blogpost = {
            title: $scope.title,
            content: $scope.content,
            name: $scope.name
        }
        ref.push(blogpost);
    }
});

postapp.controller('postCtrl', function ($scope) {
    $scope.loadPosts = function () {
        var ref = database.ref('posts');
        ref.on("value", function (snapshot) {
            snapshot.forEach(function (childSnapShot) {
                var childData = childSnapShot.val();
                var blogPost = {
                    title: childData.title,
                    content: childData.content,
                    name: childData.name
                }
                $scope.postsList.push(blogPost);
            });

        })
    },
        angular.element(document).ready
});
