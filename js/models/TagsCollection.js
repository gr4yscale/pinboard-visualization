define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone) {

  var TagModel = Backbone.Model.extend({
    defaults: {
      id:null,
      name:'aTagName',
      tagCount:null,
      checked:'checked'
    }
  });

  return Backbone.Collection.extend({
    model: TagModel
  });
});
