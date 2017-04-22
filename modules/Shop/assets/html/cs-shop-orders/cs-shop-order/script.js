// Generated by LiveScript 1.5.0
/**
 * @package   Shop
 * @category  modules
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2014-2017, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
 */
(function(){
  Polymer({
    is: 'cs-shop-order',
    behaviors: [cs.Polymer.behaviors.Language('shop_')],
    properties: {
      order_id: Number,
      date: Number,
      date_formatted: String,
      shipping_cost: Number,
      for_payment: Number,
      payment_method: String,
      paid: Boolean
    },
    ready: function(){
      var this$ = this;
      this.$.items.innerHTML = this.querySelector('#items').innerHTML;
      Promise.all([require(['sprintf-js']), cs.Language.ready()]).then(function(arg$){
        var sprintf, total_price, discount, i$, ref$, len$, item, ref1$, ref2$;
        sprintf = arg$[0][0].sprintf;
        this$.show_pay_now = !this$.paid && this$.payment_method !== 'shop:cash';
        this$.order_number = sprintf('' + this$.L.order_number, this$.order_id);
        this$.order_status = this$.querySelector('#order_status').textContent;
        this$.shipping_type = this$.querySelector('#shipping_type').textContent;
        this$.shipping_cost_formatted = sprintf(cs.shop.settings.price_formatting, this$.shipping_cost);
        total_price = 0;
        discount = 0;
        for (i$ = 0, len$ = (ref$ = this$.querySelectorAll('cs-shop-order-item')).length; i$ < len$; ++i$) {
          item = ref$[i$];
          total_price += item.getAttribute('units') * item.getAttribute('unit_price');
          discount += item.getAttribute('units') * item.getAttribute('unit_price') - item.getAttribute('price');
        }
        this$.total_price_formatted = sprintf(cs.shop.settings.price_formatting, total_price);
        this$.discount_formatted = discount ? sprintf(cs.shop.settings.price_formatting, discount) : '';
        this$.for_payment_formatted = sprintf(cs.shop.settings.price_formatting, this$.for_payment);
        this$.phone = ((ref$ = this$.querySelector('#phone')) != null ? ref$.textContent : void 8) || '';
        this$.$.phone.textContent = this$.phone;
        this$.address = $.trim(((ref1$ = this$.querySelector('#address')) != null ? ref1$.textContent : void 8) || '').replace(/\n/g, '<br>');
        this$.$.address.textContent = this$.address;
        this$.comment = $.trim(((ref2$ = this$.querySelector('#comment')) != null ? ref2$.textContent : void 8) || '').replace(/\n/g, '<br>');
        this$.$.comment.textContent = this$.comment;
      });
    },
    pay: function(){
      location.href = 'Shop/pay/' + this.order_id;
    }
  });
}).call(this);
