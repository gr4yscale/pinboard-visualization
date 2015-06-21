require.config({
  paths: {
    jquery: 'lib/jquery-2.1.4',
    underscore: 'lib/underscore',
    backbone: 'lib/backbone'
  }
});

require(['jquery', 'js/app.js'], function($, App) {
  $(function(){
    App.init();
  });
});
