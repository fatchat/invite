/*global Invite, Backbone*/

Invite.Collections = Invite.Collections || {};

(function () {
    'use strict';

    Invite.Collections.AllInvites = Backbone.Collection.extend({

        model: Invite.Models.Invite

    });

})();
