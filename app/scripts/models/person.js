/*global Invite, Backbone*/

/**
 * @brief Person model
 * @description Represents a member of the user's People list
 *              No need to persist to the server
 **/


Invite.Models = Invite.Models || {};

(function () {
    'use strict';

    Invite.Models.Person = Backbone.Model.extend({

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
