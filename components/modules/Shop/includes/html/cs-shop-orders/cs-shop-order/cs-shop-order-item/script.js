// Generated by CoffeeScript 1.9.3

/**
 * @package   Shop
 * @category  modules
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2014-2015, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
 */

(function() {
  Polymer({
    'is': 'cs-shop-order-item',
    properties: {
      item_id: Number,
      price: Number,
      unit_price: Number,
      units: Number
    },
    ready: function() {
      var discount, href;
      (function(_this) {
        return (function(img) {
          _this.$.img.src = img.src;
          return _this.$.img.title = img.title;
        });
      })(this)(this.querySelector('#img'));
      href = this.querySelector('#link').href;
      if (href) {
        this.$['img-link'].href = href;
        this.$.link.href = href;
      }
      this.item_title = this.querySelector('#link').innerHTML;
      this.unit_price_formatted = sprintf(cs.shop.settings.price_formatting, this.unit_price);
      this.price_formatted = sprintf(cs.shop.settings.price_formatting, this.price);
      discount = this.units * this.unit_price - this.price;
      if (discount) {
        discount = sprintf(cs.shop.settings.price_formatting, discount);
        return this.$.discount.textContent = "(" + cs.Language.shop_discount + ": " + discount + ")";
      }
    }
  });

}).call(this);
