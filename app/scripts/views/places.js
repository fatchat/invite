/*global Invite, Backbone, JST*/

Invite.Views = Invite.Views || {};

(function () {
    'use strict';

    Invite.Views.Places = Backbone.View.extend({

        template: JST['app/scripts/templates/places.ejs'],

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
