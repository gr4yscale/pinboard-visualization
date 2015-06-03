var TagModel = Backbone.Model.extend({
  defaults: {
    id: null,
    name: 'aTagName',
    tagCount: null
  }
});

var TagsCollection = Backbone.Collection.extend({
  model: TagModel
});

var TagsListItemView = Backbone.View.extend({
  tagName: 'div',
  className: 'tagView',
  template: _.template($('#tag-list-item-tmpl').html()),

  render: function() {
    var html = this.template(this.model.toJSON());
    this.$el.html(html);
    return this;
  }
});

var TagsListView = Backbone.View.extend({
  el: '#tag-selection-overlay',

  initialize: function() {
    this.listenTo(this.collection, 'update', this.render);
  },

  render: function() {
    var $list = this.$('div.tag-selection-list').empty();

    this.collection.each(function(model) {
    var item = new TagsListItemView({model: model});
    $list.append(item.render().$el);
    }, this);

    return this;
  }
});

var tagsList = new TagsCollection();
var tagsView = new TagsListView({collection: tagsList});

tagsList.add([
  {name: "zsd fhjh"},
  {name: "ggg a"},
  {name: "eeee fff"},
  {name: "asdfs sadf"},
  {name: "gsdg sadf "},
  {name: "sadlfkj dsadf"},
  {name: "glasdf ssd"},
]);