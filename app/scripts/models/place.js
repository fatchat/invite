/*global Invite, Backbone*/

Invite.Models = Invite.Models || {};

(function () {
    'use strict';

    Invite.Models.Place = Backbone.Model.extend({

        url: '',

        initialize: function() {
        },

        defaults: {
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            return response;
        }
    });

})();
