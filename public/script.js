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
var currentUid = null;
var userName = "";

mainapp.controller('mainCtrl', function ($scope) {
    $scope.postsList = [];

    firebase.auth().onAuthStateChanged(function (user) {
        $scope.logOut = function () {
            firebase.auth().signOut().then(function () {
                console.log("Sign out successful!");
                currentUid = null;
                window.location.href = "login.html";
            }, function (error) {
                console.log("Error with logout");
            });
        }
        if (user && user.uid != currentUid) {
            currentUid = user.uid;
            $scope.logintext = user.displayName;
            $scope.logintext2 = user.displayName;
            userName = user.displayName;
            if (currentUid != "B6mtlk0aVXMsWAFimNFAnN7oP582" || currentUid != "NyfMbBsWopTdiQBnslZqGWs60b13" || currentUid != "htvpaVJZNVfPwmIe46M0Ab4OPqj1") {
                logOut();
                console.log("user id = null");
                window.location.href = "index.html";
            }
        } else {
            currentUid = null;
            console.log("no user signed in");
            console.log("user id = null");

            if (window.location.href == "https://multijournal-1f8ab.firebaseapp.com/writePost.html") {
                console.log("Sidan stämmer")
                window.location.href = "index.html";
            }
        }

    });

    var imagesRef = storageRef.child('Blogphotos');
    var fileName = 'firstday.jpg';
    var spaceRef = imagesRef.child(fileName);
    var imgurl = spaceRef.getDownloadURL().then(function (url) {
        console.log(url);
        //document.querySelector('img').src = url;
    })
});

mainapp.controller('logOutCtrl', function ($scope) {
    $scope.logOut = function () {
        firebase.auth().signOut().then(function () {
            console.log("Sign out successful!");
            currentUid = null;
            window.location.href = "login.html";
        }, function (error) {
            console.log("Error with logout");
        });
    }
});

mainapp.controller('inputCtrl', function ($scope) {
    $scope.createPost = function () {
        var ref = database.ref('posts');
        var blogpost = {
            title: $scope.title,
            content: $scope.content,
            name: userName
        }
        console.log(blogpost);
        ref.push(blogpost);

        $scope.content = "";
        $scope.title = "";

        window.location.href = "index.html";
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
        }, 2000);
        return d.promise;
    }

    results.all = _all;
    return results;
});

mainapp.controller('blogFeedCtrl', ['$scope', function ($scope) {
    $scope.clicked = function () {
        window.location.href = './index.html';
    }
}]);

