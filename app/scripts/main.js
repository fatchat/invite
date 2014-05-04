/*global Invite, $*/

// global function
Invite.initParse = function() {
    if(!Parse.applicationId) {
        Parse.initialize(auth_keys.PARSE_APP_ID, auth_keys.PARSE_JAVSCRIPT_KEY);
    }
}

// =======================================================================================================================
// connect to facebook and log in
window.fbAsyncInit = function() {

    // set up parse
    Invite.initParse();

    if(Parse.User.current() === null) {

        window.Invite.loginUser(function() {

            if (Parse.User.current() === null) {

                console.log("User denied Facebook login!");
                
            } else {

                // if this is the first time the user is signing up, initialize the privacy settings
                if (Parse.User.current().get("privacy_non_fb_see_only_name") === undefined) {
                    Parse.User.current().set("privacy_non_fb_see_only_name", false);
                }
            }
        });

        // facebook user id is at Parse.User.current()._serverData.authData.facebook.id
    }

  // Additional initialization code here
};

// =======================================================================================================================
$(document).ready(function () {
    'use strict';
    Invite.init();
});
