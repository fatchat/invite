/*global Invite, Backbone*/

Invite.Collections = Invite.Collections || {};

(function () {
    'use strict';

    Invite.Collections.Places = Backbone.Collection.extend({

        model: Invite.Models.Places

    });

})();
