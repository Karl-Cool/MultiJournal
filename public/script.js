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

mainapp.controller('mainCtrl', function ($scope) {
    $scope.postsList = [];
    $scope.checkAuth = function () {
        if(currentUid == null){
            console.log("user id = null");
            window.location.href = "index.html";
        }
    },
    firebase.auth().onAuthStateChanged(function (user) {
        // onAuthStateChanged listener triggers every time the user ID token changes.  
        // This could happen when a new user signs in or signs out.  
        // It could also happen when the current user ID token expires and is refreshed.  
        if (user && user.uid != currentUid) {
            // Update the UI when a new user signs in.  
            // Otherwise ignore if this is a token refresh.  
            // Update the current user UID.  
            currentUid = user.uid;
            $scope.logintext = user.displayName;
            $scope.logintext2 = user.displayName;
        } else {
            // Sign out operation. Reset the current user UID.  
            currentUid = null;
            console.log("no user signed in");
            console.log("user id = null");

            if(window.location.href == "writePost.html") {
                
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
            window.location.href = "index.html";
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
        }, 2000);
        return d.promise;
    }

    results.all = _all;
    return results;
});

