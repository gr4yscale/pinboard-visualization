define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone){

  return Backbone.View.extend({
    tagName: 'div',
    className: 'tagView',
    template: _.template($('#tag-list-item-tmpl').html()),

    render: function() {
      var html = this.template(this.model.toJSON());
      this.$el.html(html);
      return this;
    }
  });
});
