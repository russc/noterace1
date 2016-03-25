    'use strict';
/* Controllers */
angular.module('myApp.controllers', ['firebase.utils', 'simpleLogin']).controller('HomeCtrl', ['$scope', 'fbutil', 'user', 'FBURL',
    function($scope, fbutil, user, FBURL) {
        $scope.syncedValue = fbutil.syncObject('syncedValue');
        $scope.user = user;
        $scope.FBURL = FBURL;
    }
]).controller('ChatCtrl', ['$scope', 'messageList',
    function($scope, messageList) {
        $scope.messages = messageList;
        $scope.addMessage = function(newMessage) {
            if(newMessage) {
                $scope.messages.$add({
                    text: newMessage
                });
            }
        };
    }
]).controller('RaceCtrl', ['$scope', 'FBURL', '$firebase',
    function($scope, FBURL, $firebase) {
      var bigNotes = "X:1\nL: 1/8\nK: Bb\n|D2|";

      ABCJS.renderAbc('notation', bigNotes,  {}, { scale: 2.0 }); return false;
//         $scope.resetScore = function() {
//             var ref = new Firebase("https://musicgames.firebaseio.com/races/" + $scope.raceName);
//             fredRef.once('value', function(dataSnapshot) {
//                 // store dataSnapshot for use in below examples.
//                 dataSnapshot.forEach(function(childSnapshot) {
//                     // key will be "fred" the first time and "wilma" the second time
//                     alert(childSnapshot.key().score);
//                 });
//             });
//         };
        $scope.startNewRace = function() {
            var ref = new Firebase("https://musicgames.firebaseio.com/races/" + $scope.raceName);
            ref.child(0).set(0);
            console.log($scope.raceName);
            $scope.raceStart = true;
            $scope.raceResults = $firebase(ref).$asArray();
            // this uses AngularFire to create
        };
        var answers = [{
            id: 1,
            name: 'a-flat'
        }, {
            id: 2,
            name: 'a-natural'
        }, {
            id: 4,
            name: 'b-flat'
        }, {
            id: 8,
            name: 'c-natural'
        }, {
            id: 9,
            name: 'c-sharp'
        }, {
            id: 10,
            name: 'd-flat'
        }, {
            id: 11,
            name: 'd-natural'
        }, {
            id: 13,
            name: 'e-flat'
        }, {
            id: 14,
            name: 'e-natural'
        }, {
            id: 17,
            name: 'f-natural'
        }, {
            id: 18,
            name: 'f-sharp'
        }, {
            id: 20,
            name: 'g-natural'
        }, {
            id: 21,
            name: 'g-sharp'
        }, {
            id: 22,
            name: 'd-flat'
        }, {
            id: 23,
            name: 'c-natural'
        }, {
            id: 24,
            name: 'f-sharp'
        }, {
            id: 25,
            name: 'a-natural'
        }, {
            id: 26,
            name: 'a-flat'
        }, {
            id: 27,
            name: 'f-sharp'
        }, {
            id: 28,
            name: 'c-sharp'
        }, {
            id: 29,
            name: 'd-natural'
        }, {
            id: 30,
            name: 'f-sharp'
        }, {
            id: 31,
            name: 'e-natural'
        }, {
            id: 32,
            name: 'a-flat'
        }];
        $scope.randomize = function() {
            var random = answers[Math.floor(Math.random() * answers.length)];
            $scope.currentImage = random.id
            $scope.currentAnswer = random.name;
        }
        $scope.randomize();
        $scope.response = '';
        $scope.score = 0;
        //         $scope.raceCode = '';
        //         $scope.firstName ='';
        //         $scope.lastName = '';
        $scope.joinedRace = false;
        $scope.joinRace = function() {
            //             var playerRef = new Firebase("https://musicgames.firebaseio.com/races/" + $scope.raceCode + "/" + $scope.firstName + "%20" + $scope.lastName);
            $scope.fullName = $scope.firstName + " " + $scope.lastName;
            $scope.joinedRace = true;
            var ref = new Firebase("https://musicgames.firebaseio.com/races/" + $scope.raceCode);
            $scope.raceResults = $firebase(ref).$asArray();
            //             $scope.raceResults = $firebase(playerRef).$asArray();
            //             playerRef.on('value', function(data) {
            //                 $scope.playerScore = data.val();
            //                 console.log(data.val());
            //                 $scope.$apply();
            //             });
        };
        console.log(answers.length);
        $scope.answer = function(ans) {
            console.log(ans);
            var ref = new Firebase("https://musicgames.firebaseio.com/races");
            if(ans == $scope.currentAnswer) {
                console.log("correct answer is " + $scope.currentAnswer);
                console.log("Answer is correct.");
                $scope.response = 'Yes!';
                $scope.score++;
                ref.child($scope.raceCode).child($scope.firstName + " " + $scope.lastName).set({
                    name: $scope.firstName + " " + $scope.lastName,
                    score: $scope.score
                });
                $scope.randomize();
            } else {
                console.log("correct answer is " + $scope.currentAnswer);
                console.log("Answer is incorrect.");
                $scope.response = 'No.';
                $scope.score--;
                ref.child($scope.raceCode).child($scope.firstName + " " + $scope.lastName).set({
                    name: $scope.firstName + " " + $scope.lastName,
                    score: $scope.score
                });
                $scope.randomize();
            }
        };
    }
]).controller('LoginCtrl', ['$scope', 'simpleLogin', '$location',
    function($scope, simpleLogin, $location) {
        $scope.email = null;
        $scope.pass = null;
        $scope.confirm = null;
        $scope.createMode = false;
        $scope.login = function(email, pass) {
            $scope.err = null;
            simpleLogin.login(email, pass).then(function( /* user */ ) {
                $location.path('/account');
            }, function(err) {
                $scope.err = errMessage(err);
            });
        };
        $scope.createAccount = function() {
            $scope.err = null;
            if(assertValidAccountProps()) {
                simpleLogin.createAccount($scope.email, $scope.pass).then(function( /* user */ ) {
                    $location.path('/account');
                }, function(err) {
                    $scope.err = errMessage(err);
                });
            }
        };

        function assertValidAccountProps() {
            if(!$scope.email) {
                $scope.err = 'Please enter an email address';
            } else if(!$scope.pass || !$scope.confirm) {
                $scope.err = 'Please enter a password';
            } else if($scope.createMode && $scope.pass !== $scope.confirm) {
                $scope.err = 'Passwords do not match';
            }
            return !$scope.err;
        }

        function errMessage(err) {
            return angular.isObject(err) && err.code ? err.code : err + '';
        }
    }
]).controller('AccountCtrl', ['$scope', 'simpleLogin', 'fbutil', 'user', '$location',
    function($scope, simpleLogin, fbutil, user, $location) {
        // create a 3-way binding with the user profile object in Firebase
        var profile = fbutil.syncObject(['users', user.uid]);
        profile.$bindTo($scope, 'profile');
        // expose logout function to scope
        $scope.logout = function() {
            profile.$destroy();
            simpleLogin.logout();
            $location.path('/login');
        };
        $scope.changePassword = function(pass, confirm, newPass) {
            resetMessages();
            if(!pass || !confirm || !newPass) {
                $scope.err = 'Please fill in all password fields';
            } else if(newPass !== confirm) {
                $scope.err = 'New pass and confirm do not match';
            } else {
                simpleLogin.changePassword(profile.email, pass, newPass).then(function() {
                    $scope.msg = 'Password changed';
                }, function(err) {
                    $scope.err = err;
                })
            }
        };
        $scope.clear = resetMessages;
        $scope.changeEmail = function(pass, newEmail) {
            resetMessages();
            profile.$destroy();
            simpleLogin.changeEmail(pass, newEmail).then(function(user) {
                profile = fbutil.syncObject(['users', user.uid]);
                profile.$bindTo($scope, 'profile');
                $scope.emailmsg = 'Email changed';
            }, function(err) {
                $scope.emailerr = err;
            });
        };

        function resetMessages() {
            $scope.err = null;
            $scope.msg = null;
            $scope.emailerr = null;
            $scope.emailmsg = null;
        }
    }
]);
