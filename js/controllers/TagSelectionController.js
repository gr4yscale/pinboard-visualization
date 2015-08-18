define([
  'jquery',
  'underscore',
  'backbone',
  'models/TagsCollection',
  'views/TagsListView'
], function($, _, Backbone, TagsCollection, TagsListView){
  
  var possibleTags = new TagsCollection();
  var selectedTags = new TagsCollection();

  var tagsView = new TagsListView({collection: possibleTags});

  var setPossibleTags = function(tagsData) {
    possibleTags.set(tagsData);
  };

  return {
    possibleTags : possibleTags,
    selectedTags : selectedTags,
    setPossibleTags : setPossibleTags
  };
});
