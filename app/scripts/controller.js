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

                window.FB.api(queryString, { 'access_token': Parse.User.current()._serverData.authData.facebook.access_token }, function(response) {

                    // token expired! this logic needs to be a)understood, and b)put everywhere
                    if(response.hasOwnProperty('error') && response.error.code === 190) {
                        Parse.User.logOut();
                        Invite.loginUser(doer);
                    }
                    else {
                        callback(response); 
                    }
                });
            }
            else {
                // wait 0.1s
                setTimeout(doer, 100);
            }
        };

        doer();
    };

    // update contact list with Facebook friends. don't modify the WTP contacts, only add/remove the facebook contacts according to the current list
    this.updateContacts = function(next) {

        var friends = [];

        this.facebookQuery('/me/friends', function(response) {

            // response.data and response.paging.next
            console.log(response);

            friends = friends.concat(response.data);

            // if response.paging.next then do it again TODO
            next(friends);
        });
    };

    // update Parse.User object for current user
    this.updateProfile = function(next) {

        // if this is the first time the user is signing up, initialize the privacy settings
        if (Parse.User.current().get("privacy_non_fb_see_only_name") === undefined) {
            Parse.User.current().set("privacy_non_fb_see_only_name", false);
        }

        this.facebookQuery('/me?fields=name,cover,gender', function(response) {

            console.log("returning from /me");

            // information to populate the model
            var info = {
                fbId : response.id,
                realname : response.name,
                gender : response.gender,
                privacy_non_fb_see_only_name : Parse.User.current().get("privacy_non_fb_see_only_name"),
                photoURL : response.cover && response.cover.source
            };

            // overwrite existing values, if any, and send to Parse
            _.each(info, function(val, key) {
                Parse.User.current().set(key, val);
            });
            Parse.User.current().save();

            // 
            next(info);
        });
    };

    // get detailed information for a contact: name, photo, common events attended
    this.getPersonInfo = function(fbId, next) {

        var queryString = '/' + fbId + '?fields=name,cover';

        this.facebookQuery(queryString, function(response) { 

                console.log(response);
                var info = {
                    fbId : fbId,
                    realname : response.name,
                    photoURL : response.cover && response.cover.source
                };

                // find their Invite user obj, if it exists check the privacy_non_fb_see_only_name flag
                // if it is True, remove the photoURL from info
                // if it is False, get the list of common plans shared with this person

                next(info);
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
    this.getPlaces = function(next) {

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

                    next(allPlaces);
                }
            );

        });

    };

    // get detailed information for a place
    this.getPlaceInfo = function(placeId, next) {

        var queryString = '/' + placeId + '?fields=name,category,link,cover,description,is_permanently_closed,location,phone';

        this.facebookQuery(queryString, function(response) { 

                console.log(response);
                next(response);
            }
        );
    };
}

// create single instance
Invite.appController = new AppController();

