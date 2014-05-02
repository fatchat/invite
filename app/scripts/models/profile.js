/*global Invite, Backbone*/

/**
 * @brief Profile model
 * @description Information to build a user's profile page
 *              Used for both "my profile" as well as "their profile"
 **/

Invite.Models = Invite.Models || {};

(function () {
    'use strict';

    Invite.Models.Profile = Backbone.Model.extend({

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
