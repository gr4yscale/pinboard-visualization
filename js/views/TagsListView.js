define([
  'jquery',
  'underscore',
  'backbone',
  'views/TagsListItemView',
], function($, _, Backbone, TagsListItemView){

  return Backbone.View.extend({
    el: '#tag-selection-overlay',

    initialize: function() {
      this.listenTo(this.collection, 'update', this.render);
    },

    render: function() {
      var $list = this.$('div.tag-selection-list').empty();
      var renderedItems = [];

      this.collection.each(function(model) {
        var item = new TagsListItemView({model: model});
        renderedItems.push(item.render().$el);
      }, this);

      $list.append(renderedItems);

      return this;
    }
  });
});
