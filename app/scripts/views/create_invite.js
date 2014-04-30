/*global Invite, Backbone, JST*/

Invite.Views = Invite.Views || {};

(function () {
    'use strict';

    Invite.Views.CreateInvite = Backbone.View.extend({

        template: JST['app/scripts/templates/create_invite.ejs'],

        tagName: 'div',

        id: '',

        className: '',

        events: {},

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
        }

    });

})();
