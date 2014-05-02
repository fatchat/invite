// =======================================================================================================================
// one central controller for the application
function AppController() {
    
    var FACEBOOK_QUERY_ATTEMPT_LIMIT = 5;

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
    this.getLocation = function(error_cb, success_cb) {

        navigator.geolocation.getCurrentPosition(success_cb, error_cb);
    };

    // query the Graph API
    this.facebookQuery = function(queryString, callback) {

        var doer = function (nattempts) {

            console.log(nattempts + ' ' + queryString);
            if (nattempts > FACEBOOK_QUERY_ATTEMPT_LIMIT) {
                // give up
                console.log("looped " + FACEBOOK_QUERY_ATTEMPT_LIMIT + " times, giving up");
                // this needs to be logged and reported 
                callback({error_msg:"Reached Facebook query attempt limit, giving up"});
            }

            if ((!!window.FB) && (!!Parse.applicationId) && (!!Parse.User.current()) && Parse.User.current().authenticated()) {

                window.FB.api(queryString, { 'access_token': Parse.User.current()._serverData.authData.facebook.access_token }, function(response) {

                    // error handling:
                    //  code=190 => session expired
                    //  code=2 => unknown, try later
                    if(response.hasOwnProperty('error')) {

                        console.log(response.error);

                        if(response.error.code === 190) { 
                            // log out
                            Parse.User.logOut();

                            // wait before logging back in
                            setTimeout(function() {
                                Invite.loginUser(doer, 1 + nattempts);
                            }, 3000);
                        }
                        else {
                            // just try again 
                            setTimeout(function() {
                                doer(1 + nattempts);
                            }, 3000);
                        }
                    }
                    else {
                        callback(null, response); 
                    }
                });
            }
            else {
                // wait 0.1s
                setTimeout(function() {
                    doer(1 + nattempts);
                }, 100);
            }
        };

        doer(0);
    };

    // update contact list with Facebook friends. don't modify the WTP contacts, only add/remove the facebook contacts according to the current list
    this.updateContacts = function(next) {

        var friends = [];

        this.facebookQuery('/me/friends', function(error, response) {

            if(error) {

                next(error);
            }
            else {

                // response.data and response.paging.next
                console.log(response);

                if(response.data) {

                    friends = friends.concat(response.data);
                    // if response.paging.next then do it again TODO
                    next(null, friends);                
                }
                else {
                    next({error:"unrecognized response to /me/friends"});
                }
            }
        });
    };

    // update Parse.User object for current user
    this.updateProfile = function(next) {

        // if this is the first time the user is signing up, initialize the privacy settings
        if (Parse.User.current().get("privacy_non_fb_see_only_name") === undefined) {
            Parse.User.current().set("privacy_non_fb_see_only_name", false);
        }

        this.facebookQuery('/me?fields=name,cover,gender', function(error, response) {

            if (error) {
                next(error);
            }
            else {

                // information to populate the model. extract fields from response keeping the same names; adding more is allowed
                var info = {
                    id : response.id,
                    name : response.name,
                    gender : response.gender,
                    privacy_non_fb_see_only_name : Parse.User.current().get("privacy_non_fb_see_only_name"),
                    cover : response.cover
                };

                // overwrite existing values, if any, and send to Parse
                _.each(info, function(val, key) {
                    if(info.hasOwnProperty(key)) {
                        Parse.User.current().set(key, val);
                    }
                });
                Parse.User.current().save();

                // 
                next(null, info);
            }
        });
    };

    // get detailed information for a contact: name, photo, common events attended
    this.getPersonInfo = function(fbId, next) {

        var queryString = '/' + fbId + '?fields=name,cover';

        this.facebookQuery(queryString, function(error, response) { 

            if (error) {
                next(error);
            }
            else { 
                console.log(response);
                var info = {
                    id : fbId,
                    name : response.name,
                    cover : response.cover
                };

                // find their Invite user obj, if it exists check the privacy_non_fb_see_only_name flag
                // if it is True, remove the photoURL from info
                // if it is False, get the list of common plans shared with this person

                next(null, info);
            }
        });
    };

    // get list of places from facebook
    this.getPlacesNearMe = function(next) {

        var appcontroller = this;

        this.getLocation(

            // error callback
            function(error) {

                // https://developer.mozilla.org/en-US/docs/Web/API/PositionError
                next({error_msg:error.message});
            }, 

            // success callback
            function(response) {

                var queryString = '/search' +
                                    '?type=place' +
                                    '&center=' + response.coords.latitude + 
                                           ',' + response.coords.longitude +
                                    '&limit=20' +
                                    '&distance=1000'
                                    ;
                // console.log(queryString);

                appcontroller.facebookQuery(queryString, function(error, response) { 

                    if(error) {
                        next(error);
                    }
                    else { 
                        console.log(response);
                        var allPlaces = new Invite.Collections.Places();

                        _.each(response.data, function(place) {
                            allPlaces.add(new Invite.Models.Place(place));
                        });

                        next(null, allPlaces);
                    }
                });
            }
        );
    };

    // get detailed information for a place
    this.getPlaceInfo = function(placeId, next) {

        var queryString = '/' + placeId + '?fields=name,category,link,cover,description,is_permanently_closed,location,phone';

        this.facebookQuery(queryString, function(error, response) { 

            if(error) {
                next(error);
            }
            else { 
                console.log(response);
                next(null, response);
            }
        });
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

}

// create single instance
Invite.appController = new AppController();

