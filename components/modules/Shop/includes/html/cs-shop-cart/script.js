// Generated by LiveScript 1.4.0
/**
 * @package   Shop
 * @category  modules
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2014-2016, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
 */
(function(){
  var DEFAULT_IMAGE, L, shop, cart, params, method, details;
  DEFAULT_IMAGE = '/components/modules/Shop/includes/img/no-image.svg';
  L = cs.Language('shop_');
  shop = cs.shop;
  cart = shop.cart;
  params = cart.params;
  Polymer({
    'is': 'cs-shop-cart',
    behaviors: [cs.Polymer.behaviors.Language('shop_')],
    properties: {
      items: Array,
      shipping_types: {
        type: Array,
        value: shop != null ? shop.shipping_types : void 8
      },
      shipping_type: {
        observer: 'shipping_type_changed',
        type: Number,
        value: params.shipping_type || (shop != null ? shop.shipping_types[0].id : void 8)
      },
      shipping_type_details: Object,
      shipping_cost_formatted: '',
      shipping_username: {
        observer: 'shipping_username_changed',
        type: String,
        value: params.shipping_username
      },
      phone: {
        observer: 'phone_changed',
        type: String,
        value: params.phone || ''
      },
      address: {
        observer: 'address_changed',
        type: String,
        value: params.address || ''
      },
      comment: {
        observer: 'comment_changed',
        type: String,
        value: params.comment || ''
      },
      payment_method: {
        observer: 'payment_method_changed',
        type: String
      },
      payment_methods: (function(){
        var ref$, results$ = [];
        for (method in ref$ = shop.payment_methods) {
          details = ref$[method];
          details.method = method;
          results$.push(details);
        }
        return results$;
      }()),
      registration_required: !cs.is_user && !shop.settings.allow_guests_orders
    },
    ready: function(){
      var this$ = this;
      this.payment_method = this.payment_methods[0].method;
      Promise.all((function(){
        var i$, ref$, results$ = [];
        for (i$ in ref$ = cart.get_all()) {
          results$.push((fn$.call(this, i$, ref$[i$])));
        }
        return results$;
        function fn$(item_id, units){
          return $.getJSON("api/Shop/items/" + item_id).then(function(data){
            return importAll$({
              units: units,
              image: data.images[0] || DEFAULT_IMAGE
            }, data);
          });
        }
      }.call(this))).then(function(items){
        this$.items = items;
      });
      if (!this.shipping_username && cs.is_user) {
        $.getJSON('api/System/profile', function(data){
          this$.shipping_username = data.username || data.login;
        });
      }
    },
    shipping_type_changed: function(shipping_type_selected){
      var this$ = this;
      params.shipping_type = shipping_type_selected;
      shop.shipping_types.forEach(function(shipping_type){
        if (shipping_type.id === shipping_type_selected) {
          this$.set('shipping_type_details', shipping_type);
          this$.set('shipping_cost_formatted', sprintf(shop.settings.price_formatting, shipping_type.price));
          return false;
        }
      });
    },
    payment_method_changed: function(payment_method_selected){
      this.$.payment_method_description.innerHTML = shop.payment_methods[payment_method_selected].description;
    },
    shipping_username_changed: function(){
      params.shipping_username = this.shipping_username;
    },
    phone_changed: function(){
      params.phone = this.phone;
    },
    address_changed: function(){
      params.address = this.address;
    },
    comment_changed: function(){
      params.comment = this.comment;
    },
    finish_order: function(){
      var this$ = this;
      if (!this.shipping_username) {
        cs.ui.alert(L.shipping_username_is_required);
        return;
      }
      $.ajax({
        url: 'api/Shop/orders',
        type: 'post',
        data: {
          shipping_type: this.shipping_type,
          shipping_username: this.shipping_username,
          shipping_phone: this.shipping_type_details.phone_needed ? this.phone : '',
          shipping_address: this.shipping_type_details.address_needed ? this.address : '',
          payment_method: this.payment_method,
          comment: this.comment,
          items: cart.get_all()
        },
        success: function(result){
          var id, modal;
          cart.clean();
          if (this$.payment_method === 'shop:cash') {
            $(cs.ui.simple_modal("<h1 class=\"cs-text-center\">" + L.thanks_for_order + "</h1>")).on('close', function(){
              location.href = 'Shop/orders_';
            });
          } else {
            id = result.split('/').pop();
            modal = $(cs.ui.simple_modal("<h1 class=\"cs-text-center\">" + L.thanks_for_order + "</h1>\n<p class=\"cs-text-center\">\n	<button is=\"cs-button\" primary type=\"button\" class=\"pay-now\">" + L.pay_now + "</button>\n	<button is=\"cs-button\" type=\"button\" class=\"pay-later\">" + L.pay_later + "</button>\n</p>")).on('close', function(){
              location.href = 'Shop/orders_';
            });
            modal.find('.pay-now').click(function(){
              location.href = "Shop/pay/" + id;
            });
            modal.find('.pay-later').click(function(){
              modal.hide();
              location.href = 'Shop/orders_';
            });
          }
        }
      });
    }
  });
  function importAll$(obj, src){
    for (var key in src) obj[key] = src[key];
    return obj;
  }
}).call(this);
