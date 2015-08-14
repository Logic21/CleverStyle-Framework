// Generated by CoffeeScript 1.9.3

/**
 * @package		CleverStyle CMS
 * @author		Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright	Copyright (c) 2015, Nazar Mokrynskyi
 * @license		MIT License, see license.txt
 */


/**
 * Simplified access to translations in Polymer elements
 */

(function() {
  Polymer.Base._addFeature({
    behaviors: [
      {
        properties: {
          L: {
            readOnly: true,
            type: Object,
            value: cs.Language
          }
        },
        __: function(key) {
          if (arguments.length === 1) {
            return cs.Language.get(key);
          } else {
            return cs.Language.format.apply(cs.Language, arguments);
          }
        }
      }
    ]
  });

}).call(this);