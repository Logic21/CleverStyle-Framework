// Generated by LiveScript 1.4.0
/**
 * @package   Shop
 * @category  modules
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2014-2016, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
 */
(function(){
  cs.shop.cart = function(){
    var items_storage, params, get_items, get_item, add_item, set_item, del_item, clean;
    items_storage = {
      get: function(){
        return JSON.parse(localStorage.shop_cart_items || '{}');
      },
      set: function(items){
        localStorage.shop_cart_items = JSON.stringify(items);
      }
    };
    params = function(){
      var params_, update_params;
      params_ = localStorage.shop_cart_params;
      params_ = params_
        ? JSON.parse(params_)
        : {};
      update_params = function(){
        localStorage.shop_cart_params = JSON.stringify(params_);
      };
      return {
        get shipping_type(){
          return params_.shipping_type;
        },
        set shipping_type(val){
          params_.shipping_type = val;
          update_params();
        },
        get shipping_username(){
          return params_.shipping_username;
        },
        set shipping_username(val){
          params_.shipping_username = val;
          update_params();
        },
        get phone(){
          return params_.phone;
        },
        set phone(val){
          params_.phone = val;
          update_params();
        },
        get address(){
          return params_.address;
        },
        set address(val){
          params_.address = val;
          update_params();
        },
        get comment(){
          return params_.comment;
        },
        set comment(val){
          params_.comment = val;
          update_params();
        }
      };
    }();
    get_items = function(){
      return items_storage.get();
    };
    get_item = function(id){
      return get_items()[id] || 0;
    };
    add_item = function(id){
      var items;
      items = get_items();
      if (items[id]) {
        ++items[id];
      } else {
        items[id] = 1;
      }
      items_storage.set(items);
      return items[id];
    };
    set_item = function(id, units){
      var items;
      items = get_items();
      items[id] = units;
      items_storage.set(items);
    };
    del_item = function(id){
      var items;
      items = get_items();
      delete items[id];
      items_storage.set(items);
    };
    clean = function(){
      items_storage.set({});
    };
    return {
      get_all: get_items,
      get_calculated: function(callback){
        var items;
        items = get_items();
        if (!items) {
          return;
        }
        return cs.api('get api/Shop/cart', {
          items: items,
          shipping_type: params.shipping_type
        }).then(callback);
      },
      get: get_item,
      add: add_item,
      set: set_item,
      del: del_item,
      clean: clean,
      params: params
    };
  }();
}).call(this);