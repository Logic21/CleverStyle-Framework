// Generated by LiveScript 1.5.0
/**
 * @package CleverStyle Framework
 * @author  Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @license 0BSD
 */
(function(){
  var vsprintf, translations, get_formatted, fill_translations, x$, slice$ = [].slice;
  translations = cs.Language;
  get_formatted = function(){
    return '' + (arguments.length ? vsprintf(this, slice$.call(arguments)) : this);
  };
  fill_translations = function(translations){
    var key, value;
    for (key in translations) {
      value = translations[key];
      if (value.indexOf('%') === -1) {
        Language[key] = value;
      } else {
        Language[key] = get_formatted.bind(value);
        Language[key].toString = Language[key];
      }
    }
  };
  function Language(prefix){
    var x$;
    x$ = Object.create(Language);
    x$.ready = function(){
      var this$ = this;
      return Language.ready().then(function(){
        var prefix_length, key;
        prefix_length = prefix.length;
        for (key in Language) {
          if (key.indexOf(prefix) === 0) {
            this$[key.substr(prefix_length)] = Language[key];
          }
        }
        return this$;
      });
    };
    return x$;
  }
  x$ = cs.Language = Language;
  x$.get = function(key){
    return this[key].toString();
  };
  x$.format = function(key){
    var args, res$, i$, to$;
    res$ = [];
    for (i$ = 1, to$ = arguments.length; i$ < to$; ++i$) {
      res$.push(arguments[i$]);
    }
    args = res$;
    return this[key].apply(this, args);
  };
  x$.ready = function(){
    var ready;
    ready = new Promise(function(resolve){
      Promise.all([
        translations
          ? [translations]
          : require(["storage/public_cache/" + cs.current_language.hash]), require(['sprintf-js'])
      ]).then(function(arg$){
        var translations, sprintfjs;
        translations = arg$[0][0], sprintfjs = arg$[1][0];
        fill_translations(translations);
        vsprintf = sprintfjs.vsprintf;
        resolve(Language);
      });
    });
    this.ready = function(){
      return ready;
    };
    ready.then(function(){
      translations = void 8;
    });
    return ready;
  };
}).call(this);
