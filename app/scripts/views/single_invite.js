/*global Invite, Backbone, JST*/

Invite.Views = Invite.Views || {};

(function () {
    'use strict';

    Invite.Views.SingleInvite = Backbone.View.extend({

        template: JST['app/scripts/templates/single_invite.ejs'],

        tagName: 'div',

        id: '',

        className: '',

        events: {},

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
        },

        render: function () {
            console.log("single invite render"); console.log(this.model);
            this.$el.html(this.template(this.model.toJSON()));
        }

    });

})();
