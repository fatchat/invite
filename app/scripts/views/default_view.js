/// =================================================

Invite.Views = Invite.Views || {};

(function () {
    'use strict';

	Invite.Views.DefaultView = Backbone.View.extend({

        template: JST['app/scripts/templates/default_view.ejs'],

        tagName: 'div',

        id: '',

        className: '',

        events: {},

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
        },

        render: function () {
            console.log("DefaultView.render");
            this.$el.html(this.template(this.model.toJSON()));
        }
	});

})();
