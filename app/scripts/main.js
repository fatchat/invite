/*global Invite, $*/

// =======================================================================================================================
// one central controller for the application
function AppController() {
    
    // switch views
    this.showView = function(view) {

        // console.log("showView"); console.log(view);
        if (this.currentView){
            this.currentView.close();
        }
        this.currentView = view;
        this.currentView.render();
        $("#targetElement").html(this.currentView.el);
    };

    // get location on this browser / device
    this.getLocation = function(callback) {

        navigator.geolocation.getCurrentPosition(callback);
    };

    // query the Graph API
    this.facebookQuery = function(queryString, callback) {

        var doer = function () {

            if ((!!window.FB) && (!!Parse.applicationId) && (!!Parse.User.current())) {
                // console.log(window.FB);
                window.FB.api(queryString, { 'access_token': Parse.User.current()._serverData.authData.facebook.access_token }, 
                       function(response) { callback(response); });
            }
            else {
                setTimeout(doer, 100);
            }
        };

        doer();
    };

    // update Parse.User object for current user
    this.updateProfile = function(next) {

        this.facebookQuery('/me', function(response) {

            console.log("returning from /me");

            // overwrite existing values, if any
            Parse.User.current().set("realname", response.name);
            Parse.User.current().set("gender", response.gender);
            Parse.User.current().set("fbId", response.id);  // do we need this? what can we assume about the _serverData object above

            // if this is the first time the user is signing up, initialize the privacy settings
            if (Parse.User.current().get("privacy_non_fb_see_only_name") === undefined) {
                Parse.User.current().set("privacy_non_fb_see_only_name", false);
            }

            // send to Parse
            console.log("saving current user to parse"); 
            // console.log(Parse.User.current());
            Parse.User.current().save();

            next();
        });
    };


    // update contact list with Facebook friends. don't modify the WTP contacts, only add/remove the facebook contacts according to the current list
    this.updateContacts = function(next) {

        var friends = [];

        this.facebookQuery('/me/friends', function(response) {

            // token expired
            if(response.hasOwnProperty('error') && response.error.code === 190) {
                Parse.User.logOut();
                Invite.loginUser();
            }
            else {

                // response.data and response.paging.next
                console.log(response);

                friends = friends.concat(response.data);

                // if response.paging.next then do it again TODO
                next(friends);
            }
        });
    };

    // get detailed information for a place
    this.getPersonInfo = function(fbId, callback) {

        var queryString = '/' + fbId + '?fields=name,cover';

        this.facebookQuery(queryString, function(response) { 

                console.log(response);
                var info = {realname:response.name};
                if(response.hasOwnProperty('cover') && response.cover.hasOwnProperty('source')) {
                    info.photo = response.cover.source;
                }

                callback(info);
            }
        );
    };


    // get list of user's invites
    this.getInvites = function() {

        var invDate = new Date(2014, 04, 19, 15, 0, 0, 0);
        var venue = {
            venueName:'Pizza Hut', 
            venueId: 1
        };

        var allInvites = new Invite.Collections.AllInvites();
        allInvites.add(new Invite.Models.Invite({ id: 1, what: 'fun', who: 'rohit', when: invDate, where: venue }));
        allInvites.add(new Invite.Models.Invite({ id: 2, what: 'fun', who: 'abrar', when: invDate, where: venue }));
        allInvites.add(new Invite.Models.Invite({ id: 3, what: 'fun', who: 'arun', when: invDate, where: venue }));

        return allInvites;
    };

    // get list of places from facebook
    this.getPlaces = function(callback) {

        var appcontroller = this;

        this.getLocation(function(response) {

            var _lat = response.coords.latitude,
                _long = response.coords.longitude;

            var queryString = '/search' +
                                '?type=place' +
                                '&center=' + _lat + ',' + _long +
                                '&limit=20' +
                                '&distance=1000'
                                ;
            // console.log(queryString);

            appcontroller.facebookQuery(queryString, function(response) { 

                    console.log(response);

                    var allPlaces = new Invite.Collections.Places();

                    _.each(response.data, function(place) {

                        allPlaces.add(new Invite.Models.Place({
                            name: place.name, 
                            venueType: place.category,
                            fbId: place.id
                        }));
                    });

                    // console.log(allPlaces.models);

                    callback(allPlaces);
                }
            );

        });

    };

    // get detailed information for a place
    this.getPlaceInfo = function(placeId, callback) {

        var queryString = '/' + placeId;

        this.facebookQuery(queryString, function(response) { 

                console.log(response);

                callback({name:response.name, venueType: response.category, page: response.link});
            }
        );
    };
}

// create single instance
Invite.appController = new AppController();

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
