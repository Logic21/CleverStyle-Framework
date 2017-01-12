// Generated by LiveScript 1.4.0
/**
 * @package   Blogs
 * @category  modules
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2015-2017, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
 */
(function(){
  Polymer({
    is: 'cs-blogs-post',
    'extends': 'article',
    behaviors: [cs.Polymer.behaviors.Language('blogs_')],
    properties: {
      can_edit: false,
      can_delete: false,
      show_comments: false,
      preview: false,
      url_prefix: ''
    },
    ready: function(){
      var this$ = this;
      cs.Language.ready().then(function(L){
        if (location.pathname.indexOf('/' + L.clang) === 0) {
          this$.url_prefix = '/' + L.clang;
        }
      });
      this.jsonld = JSON.parse(this.children[0].innerHTML);
      cs.api(['get_settings	api/Blogs', 'get			api/System/profile']).then(function(arg$){
        var profile;
        this$.settings = arg$[0], profile = arg$[1];
        this$.can_edit = !this$.preview && (this$.settings.admin_edit || this$.jsonld.user === profile.id);
        this$.can_delete = !this$.preview && this$.settings.admin_edit;
        this$.show_comments = !this$.preview && this$.settings.comments_enabled;
      });
    },
    sections_path: function(index){
      return this.jsonld.sections_paths[index];
    },
    tags_path: function(index){
      return this.jsonld.tags_paths[index];
    },
    _delete: function(){
      var this$ = this;
      cs.ui.confirm(this.L.sure_to_delete_post(this.jsonld.title)).then(function(){
        return cs.api('delete api/Blogs/posts/' + this$.jsonld.id);
      }).then(function(){
        this$._remove_close_tab_handler();
        location.href = 'Blogs';
      });
    }
  });
}).call(this);
