window.Invite = {
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
    init: function () {
        'use strict';
        
        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/all.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    },
    loginUser: function(next) {

        var doer = function() {

            if(!Parse.applicationId) {

                // should probably set a limit on how many times to do this, just in case Parse doesn't initialize
                setTimeout(doer, 100);
            }
            else {

                Parse.FacebookUtils.init({
                    appId      : auth_keys.FACEBOOK_APP_ID, // Facebook App ID
                    channelUrl : '//localhost:9000/channel.html', // Channel File
                    status     : true, // check login status
                    cookie     : true, // enable cookies to allow Parse to access the session
                    xfbml      : true  // parse XFBML
                });
             
                Parse.FacebookUtils.logIn(null, {
                    success: function(user) {
                        if (!user.existed()) {
                            console.log("User signed up and logged in through Facebook!");
                        } else {
                            console.log("User logged in through Facebook!");
                        }
                        // this user object is accessible as Parse.User.current()
                        // console.log(user);
                        if(next) {
                            next();
                        }
                    },
                    error: function(user, error) {
                        console.log("User cancelled the Facebook login or did not fully authorize.");
                    }
                });
            }
        };

        doer();
    }
};