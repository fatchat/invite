/**
 * @brief Single router for the entire application
 **/

Invite.Router = Backbone.Router.extend({

	routes: {

		// people
		"persons"		: "allPeople",
		"person/:id"	: "theirProfile",
		"person/self" 	: "myProfile",

		// places
		"places"		: "allPlaces",
		"place/:id"		: "place",

		// invites
		"invite/create"	: "createInvite",
		"invites"		: "allInvites",
		"invite/:id" 	: "viewInvite",

		// catch-all
		"*actions"		: "allInvites"
	},

	allPeople : function() {

		console.log("allPeople");
	},

	theirProfile : function(personId) {

		console.log("theirProfile, id=" + personId);
	},

	allPlaces : function() {

		console.log("allPlaces");
	},

	place : function(placeId) {

		console.log("place, id=" + placeId);
	},

	createInvite : function() {

		console.log("createInvite");

		// create the view and the invite data
		var createInviteView = new Invite.Views.CreateInvite({model:{}});

		// switch to this new view
		Invite.appController.showView(createInviteView);
	},

	allInvites : function() {

		console.log("allInvites");

		// create the view and attach the data
		var invitesView = new Invite.Views.AllInvites({model:Invite.appController.allInvites});

		console.log(invitesView);
		// switch to this new view
		Invite.appController.showView(invitesView);
	},

	viewInvite : function(inviteId) {

		console.log("viewInvite, id=" + inviteId);

		// get the invite from the id
		var theInvite = Invite.appController.allInvites.findWhere({ id : Number(inviteId) });

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

			// forward to default route. TODO how to change the URL?
			this.allInvites();
		}
	}
});

var appRouter = new Invite.Router();

Backbone.history.start();

