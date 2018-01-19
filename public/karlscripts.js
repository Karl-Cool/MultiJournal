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
var mainapp = angular.module('mainapp', []);
var storage = firebase.app().storage("gs://multijournal-1f8ab.appspot.com/");
var storageRef = storage.ref();

mainapp.controller('mainCtrl', function ($scope) {
    $scope.postsList = [];
    var imagesRef = storageRef.child('Blogphotos');
    var fileName = 'firstday.jpg';
    var spaceRef = imagesRef.child(fileName);
    var imgurl = spaceRef.getDownloadURL().then(function(url){
        console.log(url);
        document.querySelector('img').src = url;
    })
});

mainapp.controller('inputCtrl', function ($scope) {
    $scope.createPost = function () {
        var ref = database.ref('posts');
        var blogpost = {
            title: $scope.title,
            content: $scope.content,
            name: $scope.name
        }
        console.log(blogpost);
        ref.push(blogpost);

        $scope.name = "";
        $scope.content = "";
        $scope.title = "";
    }

});

mainapp.controller('postCtrl', function ($scope, $sce) {
    $scope.loadPosts = function () {
        var ref = database.ref('posts');
        ref.on("value", function (snapshot) {
            snapshot.forEach(function (childSnapShot) {
                var childData = childSnapShot.val();

                var fixedContent = childData.content;
                $sce.trustAsHtml(fixedContent);

                var blogPost = {
                    title: childData.title,
                    content: fixedContent,
                    name: childData.name
                }
                $scope.postsList.push(blogPost);
            });

        })
    }

});

mainapp.controller('fixCtrl', function ($scope, resultsFactory) {

    $scope.results = [{ txt: 'Loading...' }];
    resultsFactory.all().then(
        function (res) {
            $scope.results = res;
        },
        function (err) {
            console.error(err);
        }
    );
})

mainapp.factory('resultsFactory', function ($http, $timeout, $q) {
    var results = {};

    function _all() {
        var d = $q.defer();
        $timeout(function () {
            d.resolve(mainapp.postsList);
        }, 1000);

        return d.promise;
    }

    results.all = _all;
    return results;
});


