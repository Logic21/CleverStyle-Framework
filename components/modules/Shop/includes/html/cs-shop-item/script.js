// Generated by CoffeeScript 1.4.0

/**
 * @package       Shop
 * @order_status  modules
 * @author        Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright     Copyright (c) 2014, Nazar Mokrynskyi
 * @license       MIT License, see license.txt
*/


(function() {

  Polymer({
    ready: function() {
      this.header_title = this.querySelector('h1').innerHTML;
      return $(this.$.images).append(this.querySelectorAll('#images > img'));
    }
  });

}).call(this);
