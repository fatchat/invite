/*global Invite, $*/

// one central controller for the application
function AppController() {
    
    this.showView = function(view) {

        console.log("showView"); console.log(view);
        if (this.currentView){
            this.currentView.close();
        }
        this.currentView = view;
        this.currentView.render();
        $("#targetElement").html(this.currentView.el);
    };
}

Invite.appController = new AppController();

// create dummy data
(function(appController) {

    var invDate = new Date(2014, 04, 19, 15, 0, 0, 0);
    var venue = {
        venueName:'Pizza Hut', 
        venueId: 1
    };

    appController.allInvites = new Invite.Collections.AllInvites();
    appController.allInvites.add(new Invite.Models.Invite({ id: 1, what: 'fun', who: 'rohit', when: invDate, where: venue }));
    appController.allInvites.add(new Invite.Models.Invite({ id: 2, what: 'fun', who: 'abrar', when: invDate, where: venue }));
    appController.allInvites.add(new Invite.Models.Invite({ id: 3, what: 'fun', who: 'arun', when: invDate, where: venue }));

})(Invite.appController);

// connect to facebook and log in
window.fbAsyncInit = function() {

    // set up parse
    Parse.initialize(auth_keys.PARSE_APP_ID, auth_keys.PARSE_JAVSCRIPT_KEY);

    if(Parse.User.current() === null) {

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
    }

  // Additional initialization code here
};

$(document).ready(function () {
    'use strict';
    Invite.init();
});
