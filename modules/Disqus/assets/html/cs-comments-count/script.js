// Generated by LiveScript 1.5.0
/**
 * @package  Disqus
 * @category modules
 * @author   Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @license  0BSD
 */
(function(){
  Polymer({
    is: 'cs-comments-count',
    properties: {
      module: String,
      item: Number,
      count: Number
    },
    ready: function(){
      var item, this$ = this;
      item = this.module + '/' + this.item;
      cs.api('get_settings api/Disqus').then(function(arg$){
        var shortname, x$, script;
        shortname = arg$.shortname;
        x$ = script = document.createElement('script');
        x$.async = true;
        x$.src = "//" + shortname + ".disqus.com/count-data.js?1=" + item;
        x$.onload = function(){
          this$.count = DISQUSWIDGETS[item] || 0;
        };
        x$.setAttribute('data-timestamp', +new Date());
        document.head.appendChild(script);
      });
    }
  });
}).call(this);
