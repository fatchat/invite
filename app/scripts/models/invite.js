/*global Invite, Backbone*/

Invite.Models = Invite.Models || {};

(function () {
    'use strict';

    Invite.Models.Invite = Backbone.Model.extend({

        url: '',

        initialize: function() {
        },

        defaults: {

            what: 'A New Plan!'
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            return response;
        },

        schema: {

            what : 'Text',

            when : 'DateTime',

            end : 'DateTime',

            where : { type: 'NestedModel', model: Invite.Models.Place },

            who : { type: 'NestedModel', model: Invite.Models.Person }
        }
    });

})();
