define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){
      
  var OverlayView = Backbone.View.extend({

    el: '#overlay',
    initialize : function() {
      _.bindAll(this, 'render');
      
      this.render();
    },

    render : function() {
   
      var html = '<span style=color:#fff>derp</span>';
      this.$el.html(html); 

      return this;
    }
  });

  return OverlayView;
});
