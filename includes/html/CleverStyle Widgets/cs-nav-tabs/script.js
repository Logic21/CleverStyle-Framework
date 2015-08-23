// Generated by CoffeeScript 1.9.3

/**
 * @package   CleverStyle Widgets
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2015, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
 */

(function() {
  Polymer({
    'is': 'cs-nav-tabs',
    'extends': 'nav',
    properties: {
      active: {
        observer: 'active_changed',
        type: Number
      }
    },
    ready: function() {
      this.addEventListener('tap', this.click.bind(this));
      this.addEventListener('click', this.click.bind(this));
      return (function(_this) {
        return function() {
          var element, i, len, ref;
          ref = _this.children;
          for (i = 0, len = ref.length; i < len; i++) {
            element = ref[i];
            if (element.active) {
              return;
            }
          }
          _this.active = 0;
        };
      })(this)();
    },
    click: function(e) {
      var element, i, index, len, ref;
      ref = this.children;
      for (index = i = 0, len = ref.length; i < len; index = ++i) {
        element = ref[index];
        if (element.tagName === 'TEMPLATE') {
          continue;
        }
        if (element === e.target) {
          this.active = index;
          element.setAttribute('active', '');
        } else {
          element.removeAttribute('active');
        }
      }
    },
    active_changed: function() {
      var element, i, index, len, ref, ref1;
      ref = this.children;
      for (index = i = 0, len = ref.length; i < len; index = ++i) {
        element = ref[index];
        if (element.tagName === 'TEMPLATE') {
          continue;
        }
        element.active = index === this.active;
        if (index === this.active) {
          element.setAttribute('active', '');
        } else {
          element.removeAttribute('active');
        }
      }
      if (((ref1 = this.nextElementSibling) != null ? ref1.is : void 0) === 'cs-section-switcher') {
        this.nextElementSibling.active = this.active;
      }
    }
  });

}).call(this);
