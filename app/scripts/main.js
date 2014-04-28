/*global Invite, $*/

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

    }
};

window.fbAsyncInit = function() {

    // set up parse
    Parse.initialize(auth_keys.PARSE_APP_ID, auth_keys.PARSE_JAVSCRIPT_KEY);

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
            window.Invite.currentUser = user;
        },
        error: function(user, error) {
            console.log("User cancelled the Facebook login or did not fully authorize.");
        }
    });

  // Additional initialization code here
};

$(document).ready(function () {
    'use strict';
    Invite.init();
});
