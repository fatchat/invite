/*global Invite, Backbone*/

Invite.Routers = Invite.Routers || {};

(function () {
    'use strict';

    Invite.Routers.Places = Backbone.Router.extend({

    	routes: {
    		"places"	: "places"
    	}
    });


    var router = new Invite.Routers.Places;

    router.on('route:places', function() {

    	console.log("routed to places");
    });

	Backbone.history.start();
})();
