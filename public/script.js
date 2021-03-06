var config = {
    apiKey: "AIzaSyD1iQ0OP8z-uTe6snVy9Tg82nIZ_4uMshs",
    authDomain: "multijournal-1f8ab.firebaseapp.com",
    databaseURL: "https://multijournal-1f8ab.firebaseio.com",
    projectId: "multijournal-1f8ab",
    storageBucket: "multijournal-1f8ab.appspot.com",
    messagingSenderId: "1075543197778"
}

firebase.initializeApp(config);
var database = firebase.database();
var currentUid = null;
var userName = "";
var postId = "noPostMade";
var app = angular.module('retardalert', ['firebase']);


app.controller('mainCtrl', function ($scope) {
    $scope.postsList = [];
    firebase.auth().onAuthStateChanged(function (user) {

        if (user && user.uid != currentUid) {
            currentUid = user.uid;
            $scope.logintext = user.displayName;
            $scope.logintext2 = user.displayName;
            userName = user.displayName;
            if ((currentUid == "B6mtlk0aVXMsWAFimNFAnN7oP582") || (currentUid == "NyfMbBsWopTdiQBnslZqGWs60b13") || (currentUid == "htvpaVJZNVfPwmIe46M0Ab4OPqj1")) {
                console.log("Antingen har Karl, Axel eller Philip loggat in :) KUL!");
            }
            else {
                logOut();
                console.log("LOL gtfo");
                window.location.href = "index.html";
            }
        } else {
            currentUid = null;
            console.log("no user signed in");
            console.log("user id = null");

            if (window.location.href == "https://multijournal-1f8ab.firebaseapp.com/indexadmin.html") {
                console.log("Sidan stämmer")
                window.location.href = "index.html";
            }
        }

    })
})
app.controller('logOutCtrl', function ($scope) {
    $scope.logOut = function () {
        firebase.auth().signOut().then(function () {
            console.log("Sign out successful!");
            currentUid = null;
            window.location.href = "login.html";
        }, function (error) {
            console.log("Error with logout");
        });
    }
})
app.controller('inputCtrl', function ($scope) {
    var database = firebase.database();
    var currentUid = null;
    var userName = "";
    $scope.createPost = function () {
        var ref = database.ref('posts');
        var date = Date.now();

        var blogpost = {
            title: $scope.title,
            content: $scope.content,
            name: userName,
            date: date
        }
        console.log(blogpost);
        var newPostID = ref.push(blogpost);
        console.log(newPostID.key);
        postId = newPostID.key;
        $scope.content = "";
        $scope.title = "";

        window.location.href = "indexadmin.html";
    }
})
app.controller('postCtrl', function ($scope, $sce, $firebaseObject, $q, $timeout) {
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
                    name: childData.name,
                    date: childData.date
                }
                console.log(blogPost.content);
                $scope.postsList.push(blogPost);
            }
            );
            $scope.$apply();
        })
    };
})
app.controller('uploadCtrl', function ($scope) {
    var uploader = document.getElementById('uploader'),
        imageUrl,
        fileButton = document.getElementById('fileButton');

    fileButton.addEventListener('change', function (e) {

        var file = e.target.files[0];

        var storageRef = firebase.storage().ref('images/' + postId + "/" + file.name);
        var task = storageRef.put(file);

        task.on('state_changed',
            function progress(snapshot) {
                var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                uploader.value = percentage;
                if (percentage == 100) {
                    storageRef.getDownloadURL().then(function (url) {
                        imageUrl = url;
                        console.log(imageUrl);
                        $scope.imagePath = imageUrl;
                        $scope.$apply();
                    });
                } 
                
            },
            function error(err) {

            },
            function complete() {
                
            }
        )
        console.log("uploaded");
        console.log(imageUrl);
        function readURL(input) {

            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    document.getElementById('myimg').setAttribute('src', e.target.result);
                }

                reader.readAsDataURL(input.files[0]);
            }
        }


        document.getElementById('imgSel').onchange = function () { //set up a common class
            readURL(this);
        };
    }

    );
});

