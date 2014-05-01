/*global Invite, Backbone*/

/**
 * @brief The current user's People
 * @description This collection will consist of the user's Invite contacts, 
 *              which is the union of their Facebook friends and people 
 *              with whom they have attended events together
 *              The FB ids of their FB friends will be stored locally
 *              The Invite ids of the other contacts could be obtained from
 *              their event list, but for speed we will cache them in the 
 *              Parse.User objects. Or maybe in local storage
 **/

Invite.Collections = Invite.Collections || {};

(function () {
    'use strict';

    Invite.Collections.People = Backbone.Collection.extend({

        model: Invite.Models.Person

    });

})();
