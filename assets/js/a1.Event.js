// Generated by LiveScript 1.4.0
/**
 * @package   CleverStyle Framework
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2015-2017, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
 */
(function(){
  /**
   * Events system similar to one found on backend, including available methods and arguments order, but instead of returning boolean it returns Promise instance
   * Similarly, callbacks may return either boolean result or no result (just like on backend) or Promise instance or any other object that has compatible `then`
   * method (jQuery Deferred as example)
   */
  var callbacks, x$, slice$ = [].slice;
  callbacks = {};
  cs.Event = {
    on: function(event, callback){
      if (event && callback) {
        if (!callbacks[event]) {
          callbacks[event] = [];
        }
        callbacks[event].push(callback);
      }
      return this;
    },
    off: function(event, callback){
      if (!callbacks[event]) {} else if (!callback) {
        delete callbacks[event];
      } else {
        callbacks[event] = callbacks[event].filter(function(c){
          return c !== callback;
        });
      }
      return this;
    },
    once: function(event, callback){
      var callback_, this$ = this;
      if (event && callback) {
        callback_ = function(){
          this$.off(event, callback_);
          return callback.apply(callback, arguments);
        };
        this.on(event, callback_);
      }
      return this;
    },
    fire: function(event){
      var params, resolver;
      params = slice$.call(arguments, 1);
      if (event && callbacks[event] && callbacks[event].length) {
        resolver = new Callbacks_resolver(callbacks[event], params);
        return resolver.execute();
      } else {
        return Promise.resolve();
      }
    }
  };
  Object.freeze(cs.Event);
  /**
   * Utility callback resolver
   */
  function Callbacks_resolver(callbacks, params){
    this.callbacks = callbacks;
    this.params = params;
    this.execute = this.execute.bind(this);
  }
  x$ = Callbacks_resolver.prototype;
  x$.index = 0;
  x$.execute = function(){
    var callback, result;
    callback = this.callbacks[this.index];
    ++this.index;
    if (!callback) {
      return Promise.resolve();
    } else {
      result = callback.apply(callback, this.params);
      if (result === false) {
        return Promise.reject();
      } else {
        return Promise.resolve(result).then(this.execute);
      }
    }
  };
}).call(this);
