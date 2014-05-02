/**
 * @brief Single router for the entire application
 **/

Invite.Router = Backbone.Router.extend({

	routes: {

		// people
		"people"		: "allPeople",
		"person/self" 	: "myProfile",
		"person/:id"	: "theirProfile",

		// places
		"places"		: "allPlaces",
		"place/:id"		: "place",

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

		Invite.appController.updateContacts(function(friends) {

			// create collection for the People view
			var allPeopleList = new Invite.Collections.People();

			// add to collection
			_.each(friends, function(friend) {
				allPeopleList.add(new Invite.Models.Person({realname: friend.name, fbId: friend.id}));
			});

			// create the People view
			var allPeopleView = new Invite.Views.People({model:allPeopleList});

			// switch to view
			Invite.appController.showView(allPeopleView);
		});
	},

	// verify that Parse.User.current() !== null
	theirProfile : function(fbId) {

		console.log("theirProfile, id=" + fbId);

		Invite.appController.getPersonInfo(fbId, function(theirInfo) {

			// create the view for the contact's profile
			var theirProfileView = new Invite.Views.TheirProfile({model:new Invite.Models.Profile(theirInfo)});

			// render
			Invite.appController.showView(theirProfileView);
		});
	},

	myProfile : function() {

		console.log("myProfile");

		Invite.appController.updateProfile(function(myInfo) {

			// create the view for this user's profile
			var myProfileView = new Invite.Views.MyProfile({model:new Invite.Models.Profile(myInfo)});

			// render
			Invite.appController.showView(myProfileView);
		});
	},

	// verify that Parse.User.current() !== null
	allPlaces : function() {

		console.log("allPlaces");

		// get the list of Places
		Invite.appController.getPlaces(function(allPlacesList) {

			// console.log(allPlacesList);
			// create the view with this list associated
			var allPlacesView = new Invite.Views.Places({model:allPlacesList});

			// render
			Invite.appController.showView(allPlacesView);
		});
	},

	// verify that Parse.User.current() !== null
	place : function(placeId) {

		console.log("place, id=" + placeId);

		Invite.appController.getPlaceInfo(placeId, function(placeInfo) {

			if(placeInfo !== null) {

				// create the view and attach the data
				var singlePlaceView = new Invite.Views.SinglePlace({model:new Invite.Models.Place(placeInfo)});

				// switch to this new view
				Invite.appController.showView(singlePlaceView);
			}
			else {

				console.log("No such place with id " + placeId);

				this.defaultRoute();
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

			console.log("Could not find invite having id " + inviteId + ", returning to home screen");

			// forward to default route
			this.defaultRoute();
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

