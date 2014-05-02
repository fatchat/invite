/*global Invite, $*/

// =======================================================================================================================
// connect to facebook and log in
window.fbAsyncInit = function() {

    // set up parse
    Parse.initialize(auth_keys.PARSE_APP_ID, auth_keys.PARSE_JAVSCRIPT_KEY);

    if(Parse.User.current() === null) {

        window.Invite.loginUser();

        if (Parse.User.current() === null) {

            console.log("User denied Facebook login!");
        }

        // facebook user id is at Parse.User.current()._serverData.authData.facebook.id
    }

  // Additional initialization code here
};

// =======================================================================================================================
$(document).ready(function () {
    'use strict';
    Invite.init();
});
