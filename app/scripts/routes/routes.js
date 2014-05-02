/**
 * @brief Single router for the entire application
 **/

Invite.Router = Backbone.Router.extend({

	routes: {

		// people
		"people"		: "allPeople",
		"person/self" 	: "myProfile",
		"person/:fbid"	: "theirProfile",

		// places
		"places"		: "allPlaces",
		"place/:fbid"	: "place",

		// invites
		"invite/create"	: "createInvite",
		"invites"		: "allInvites",
		"invite/:id" 	: "viewInvite",

		// catch-all
		"*actions"		: "defaultRoute"
	},

	// verify that Parse.User.current() !== null
	allPeople : function() {

		console.log("allPeople");

		Invite.appController.updateContacts(function(error, friends) {

			if(error) {
				
				var errorView = new Invite.Views.Error({model:new Invite.Models.Error(error)});

				Invite.appController.showView(errorView);
			}
			else { 
				// create collection for the People view
				var allPeopleList = new Invite.Collections.People();

				// add to collection
				_.each(friends, function(friend) {
					allPeopleList.add(new Invite.Models.Person(friend));
				});

				// create the People view
				var allPeopleView = new Invite.Views.People({model:allPeopleList});

				// switch to view
				Invite.appController.showView(allPeopleView);
			}
		});
	},

	// verify that Parse.User.current() !== null
	theirProfile : function(fbId) {

		console.log("theirProfile, id=" + fbId);

		Invite.appController.getPersonInfo(fbId, function(error, theirInfo) {

			if(error) {
								
				var errorView = new Invite.Views.Error({model:new Invite.Models.Error(error)});

				Invite.appController.showView(errorView);
			}
			else { 
				// create the view for the contact's profile
				var theirProfileView = new Invite.Views.TheirProfile({model:new Invite.Models.Profile(theirInfo)});

				// render
				Invite.appController.showView(theirProfileView);
			}
		});
	},

	// show this user's profile
	myProfile : function() {

		console.log("myProfile");

		Invite.appController.updateProfile(function(error, myInfo) {

			if(error) {
				
				var errorView = new Invite.Views.Error({model:new Invite.Models.Error(error)});

				Invite.appController.showView(errorView);
			}
			else { 

				// create the view for this user's profile
				var myProfileView = new Invite.Views.MyProfile({model:new Invite.Models.Profile(myInfo)});

				// render
				Invite.appController.showView(myProfileView);
			}
		});
	},

	// verify that Parse.User.current() !== null
	allPlaces : function() {

		console.log("allPlaces");

		// get the list of Places
		Invite.appController.getPlacesNearMe(function(error, allPlacesList) {

			if(error) {
				
				var errorView = new Invite.Views.Error({model:new Invite.Models.Error(error)});

				Invite.appController.showView(errorView);
			}
			else { 
				// console.log(allPlacesList);
				// create the view with this list associated
				var allPlacesView = new Invite.Views.Places({model:allPlacesList});

				// render
				Invite.appController.showView(allPlacesView);
			}
		});
	},

	// verify that Parse.User.current() !== null
	place : function(placeId) {

		console.log("place, id=" + placeId);

		Invite.appController.getPlaceInfo(placeId, function(error, placeInfo) {

			if(error) {
				
				var errorInfo = new Invite.Models.Error(error);
				
				var errorView = new Invite.Views.Error({model:errorInfo});

				Invite.appController.showView(errorView);
			}
			else { 

				if(placeInfo !== null) {

					// create the view and attach the data
					var singlePlaceView = new Invite.Views.SinglePlace({model:new Invite.Models.Place(placeInfo)});

					// switch to this new view
					Invite.appController.showView(singlePlaceView);
				}
				else {

					var error_message = "No such place with id " + placeId;
					
					console.log(error_message);

					var errorView = new Invite.Views.Error({model:new Invite.Models.Error({error_msg:error_message})});

					Invite.appController.showView(errorView);
				}
			}
		});
	},

	// verify that Parse.User.current() !== null
	createInvite : function() {

		console.log("createInvite");

		// create the view and the invite data
		var createInviteView = new Invite.Views.CreateInvite({model:{}});

		// switch to this new view
		Invite.appController.showView(createInviteView);
	},

	// verify that Parse.User.current() !== null
	allInvites : function() {

		// console.log("allInvites");

		// get the current list of invites
		var allInvitesList = Invite.appController.getInvites();

		// create the view and attach the data
		var invitesView = new Invite.Views.AllInvites({model:allInvitesList});

		// switch to this new view
		Invite.appController.showView(invitesView);
	},

	// verify that Parse.User.current() !== null
	viewInvite : function(inviteId) {

		// console.log("viewInvite, id=" + inviteId);

		// get the current list of invites
		var allInvitesList = Invite.appController.getInvites();

		// get the invite from the id
		var theInvite = allInvitesList.findWhere({ id : Number(inviteId) });

		// if the invite exists
		if(theInvite !== undefined) {

			// create the view and attach the data
			var singleInviteView = new Invite.Views.SingleInvite({model:theInvite});

			// switch to this new view
			Invite.appController.showView(singleInviteView);
		}

		// no such invite ID
		else {

			var error_message = "Could not find invite having id " + inviteId + ", returning to home screen";

			console.log(error_message);

			var errorView = new Invite.Views.Error({model:new Invite.Models.Error({error_msg:error_message})});

			Invite.appController.showView(errorView);
		}
	},

	defaultRoute : function() {

		// forward to default route
		this.navigate('invites', {trigger:true});
	}
});

// create the single router for the application
var appRouter = new Invite.Router();

// this is required by Backbone
Backbone.history.start();

