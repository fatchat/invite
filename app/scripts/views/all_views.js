/// =================================================
/// add a close() function to all views
Backbone.View.prototype.close = function () {
  this.$el.empty();
  this.unbind();
};



