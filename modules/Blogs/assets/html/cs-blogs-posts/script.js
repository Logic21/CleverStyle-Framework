// Generated by LiveScript 1.5.0
/**
 * @package  Blogs
 * @category modules
 * @author   Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @license  0BSD
 */
(function(){
  Polymer({
    is: 'cs-blogs-posts',
    ready: function(){
      this.jsonld = JSON.parse(this.children[0].innerHTML);
      this.posts = this.jsonld['@graph'];
    }
  });
}).call(this);
