// Generated by LiveScript 1.5.0
/**
 * @package CleverStyle Framework
 * @author  Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @license 0BSD
 */
(function(){
  var normalize_properties, polymerFn_original;
  normalize_properties = function(properties){
    var property, value, type;
    if (properties) {
      for (property in properties) {
        value = properties[property];
        type = (fn$());
        if (type) {
          properties[property] = {
            type: type,
            value: value
          };
        }
      }
    }
    function fn$(){
      switch (typeof value) {
      case 'boolean':
        return Boolean;
      case 'number':
        return Number;
      case 'string':
        return String;
      default:
        if (value instanceof Date) {
          return Date;
        } else if (value instanceof Array) {
          return Array;
        }
      }
    }
  };
  polymerFn_original = Polymer._polymerFn;
  Polymer._polymerFn = function(info){
    if (typeof info !== 'function') {
      normalize_properties(info.properties);
      if (info.behaviors) {
        info.behaviors.forEach(function(behavior){
          normalize_properties(behavior.properties);
        });
      }
    }
    return polymerFn_original.call(this, info);
  };
}).call(this);
