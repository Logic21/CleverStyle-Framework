// Generated by LiveScript 1.5.0
/**
 * @package  Blogs
 * @category modules
 * @author   Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @license  0BSD
 */
(function(){
  Polymer({
    is: 'cs-blogs-posts-post',
    behaviors: [cs.Polymer.behaviors.computed_bindings, cs.Polymer.behaviors.Language('blogs_')],
    properties: {
      post: {},
      settings: Object
    },
    ready: function(){
      var this$ = this;
      cs.Event.fire('System/content_enhancement', {
        element: this.$.content
      });
      cs.api('get_settings api/Blogs').then(function(settings){
        this$.settings = settings;
      });
    },
    sections_path: function(index){
      return this.post.sections_paths[index];
    }
  });
}).call(this);
