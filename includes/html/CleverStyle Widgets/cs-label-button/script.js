// Generated by CoffeeScript 1.9.3

/**
 * @package   CleverStyle Widgets
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2015, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
 */

(function() {
  Polymer({
    'is': 'cs-label-button',
    'extends': 'label',
    behaviors: [Polymer.cs.behaviors.label, Polymer.cs.behaviors["this"], Polymer.cs.behaviors.tooltip],
    properties: {
      first: {
        reflectToAttribute: true,
        type: Boolean
      },
      last: {
        reflectToAttribute: true,
        type: Boolean
      }
    },
    ready: function() {
      var ref, ref1;
      if (((ref = this.previousElementSibling) != null ? ref.is : void 0) !== this.is) {
        this.first = true;
      }
      if (((ref1 = this.nextElementSibling) != null ? ref1.getAttribute('is') : void 0) !== this.is) {
        return this.last = true;
      }
    }
  });

}).call(this);
