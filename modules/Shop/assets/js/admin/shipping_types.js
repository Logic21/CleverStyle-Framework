// Generated by LiveScript 1.5.0
/**
 * @package   Shop
 * @shipping-type  modules
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @license   0BSD
 */
(function(){
  require(['jquery'], function($){
    $(function(){
      var make_modal;
      make_modal = function(L, title, action){
        return $(cs.ui.simple_modal("<cs-form><form>\n	<h3 class=\"cs-text-center\">" + title + "</h3>\n	<label>" + L.title + "</label>\n	<cs-input-text><input name=\"title\" required></cs-input-text>\n	<label>" + L.price + "</label>\n	<cs-input-text><input name=\"price\" type=\"number\" min=\"0\" value=\"0\" required></cs-input-text>\n	<label>" + L.phone_needed + "</label>\n	<div>\n		<cs-label-button><label><input type=\"radio\" name=\"phone_needed\" value=\"1\" checked> " + L.yes + "</label></cs-label-button>\n		<cs-label-button><label><input type=\"radio\" name=\"phone_needed\" value=\"0\"> " + L.no + "</label></cs-label-button>\n	</div>\n	<label>" + L.address_needed + "</label>\n	<div>\n		<cs-label-button><label><input type=\"radio\" name=\"address_needed\" value=\"1\" checked> " + L.yes + "</label></cs-label-button>\n		<cs-label-button><label><input type=\"radio\" name=\"address_needed\" value=\"0\"> " + L.no + "</label></cs-label-button>\n	</div>\n	<label>" + L.description + "</label>\n	<cs-textarea autosize><textarea name=\"description\"></textarea></cs-textarea>\n	<br>\n	<cs-button primary><button type=\"submit\">" + action + "</button></cs-button>\n</form></cs-form>"));
      };
      $('html').on('mousedown', '.cs-shop-shipping-type-add', function(){
        cs.Language('shop_').ready().then(function(L){
          var $modal;
          $modal = make_modal(L, L.shipping_type_addition, L.add);
          $modal.find('form').submit(function(){
            cs.api('post api/Shop/admin/shipping_types', this).then(function(){
              return cs.ui.alert(L.added_successfully);
            }).then(bind$(location, 'reload'));
            return false;
          });
        });
      }).on('mousedown', '.cs-shop-shipping-type-edit', function(){
        var id;
        id = $(this).data('id');
        Promise.all([cs.api("get api/Shop/admin/shipping_types/" + id), cs.Language('shop_').ready()]).then(function(arg$){
          var shipping_type, L, $modal;
          shipping_type = arg$[0], L = arg$[1];
          $modal = make_modal(L, L.shipping_type_edition, L.edit);
          $modal.find('form').submit(function(){
            cs.api("put api/Shop/admin/shipping_types/" + id, this).then(function(){
              return cs.ui.alert(L.edited_successfully);
            }).then(bind$(location, 'reload'));
            return false;
          });
          $modal.find('[name=title]').val(shipping_type.title);
          $modal.find('[name=price]').val(shipping_type.price);
          $modal.find("[name=phone_needed][value=" + shipping_type.phone_needed + "]").prop('checked', true);
          $modal.find("[name=address_needed][value=" + shipping_type.address_needed + "]").prop('checked', true);
          $modal.find('[name=description]').val(shipping_type.description);
        });
      }).on('mousedown', '.cs-shop-shipping-type-delete', function(){
        var id;
        id = $(this).data('id');
        cs.Language('shop_').ready().then(function(L){
          cs.ui.confirm(L.sure_want_to_delete).then(function(){
            return cs.api("delete api/Shop/admin/shipping_types/" + id);
          }).then(function(){
            return cs.ui.alert(L.deleted_successfully);
          }).then(bind$(location, 'reload'));
        });
      });
    });
  });
  function bind$(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
  }
}).call(this);
