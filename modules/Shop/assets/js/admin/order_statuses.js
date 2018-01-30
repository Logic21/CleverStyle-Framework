// Generated by LiveScript 1.5.0
/**
 * @package  Shop
 * @category modules
 * @author   Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @license  0BSD
 */
(function(){
  require(['jquery'], function($){
    $(function(){
      var make_modal;
      make_modal = function(types, L, title, action){
        var res$, index, type, modal;
        res$ = [];
        for (index in types) {
          type = types[index];
          res$.push("<option value=\"" + index + "\">" + type + "</option>");
        }
        types = res$;
        types = types.join('');
        modal = $(cs.ui.simple_modal("<cs-form><form>\n	<h3 class=\"cs-text-center\">" + title + "</h3>\n	<label>" + L.title + "</label>\n	<cs-input-text><input name=\"title\" required></cs-input-text>\n	<label>" + L.color + "</label>\n	<cs-input-text><input name=\"color\"></cs-input-text><br>\n	<cs-input-text><input type=\"color\"></cs-input-text>\n	<label>" + L.order_status_type + "</label>\n	<cs-select><select name=\"type\" required>" + types + "</select></cs-select>\n	<label>" + L.send_update_status_email + "</label>\n	<div>\n		<cs-label-button><label><input type=\"radio\" name=\"send_update_status_email\" value=\"1\" checked> " + L.yes + "</label></cs-label-button>\n		<cs-label-button><label><input type=\"radio\" name=\"send_update_status_email\" value=\"0\"> " + L.no + "</label></cs-label-button>\n	</div>\n	<label>" + L.comment_used_in_email + "</label>\n	<cs-textarea autosize><textarea name=\"comment\"></textarea></cs-textarea>\n	<br>\n	<cs-button primary><button type=\"submit\">" + action + "</button></cs-button>\n</form></cs-form>"));
        modal.find('[type=color]').change(function(){
          modal.find('[name=color]').val($(this).val());
        });
        modal.find('[name=color]').change(function(){
          modal.find('[type=color]').val($(this).val());
        });
        return modal;
      };
      $('html').on('mousedown', '.cs-shop-order-status-add', function(){
        Promise.all([cs.api('get api/Shop/admin/order_statuses/types'), cs.Language('shop_').ready()]).then(function(arg$){
          var types, L, modal;
          types = arg$[0], L = arg$[1];
          modal = make_modal(types, L, L.order_status_addition, L.add);
          modal.find('form').submit(function(){
            cs.api('post api/Shop/admin/order_statuses', this).then(function(){
              return cs.ui.alert(L.added_successfully);
            }).then(bind$(location, 'reload'));
            return false;
          });
        });
      }).on('mousedown', '.cs-shop-order-status-edit', function(){
        var id;
        id = $(this).data('id');
        Promise.all([cs.api(['get api/Shop/admin/order_statuses/types', "get api/Shop/admin/order_statuses/" + id]), cs.Language('shop_').ready()]).then(function(arg$){
          var ref$, types, type, L, modal;
          ref$ = arg$[0], types = ref$[0], type = ref$[1], L = arg$[1];
          modal = make_modal(types, L, L.order_status_edition, L.edit);
          modal.find('form').submit(function(){
            cs.api("put api/Shop/admin/order_statuses/" + id, this).then(function(){
              return cs.ui.alert(L.edited_successfully);
            }).then(bind$(location, 'reload'));
            return false;
          });
          modal.find('[name=title]').val(type.title);
          modal.find('[name=color]').val(type.color);
          modal.find('[type=color]').val(type.color);
          modal.find('[name=type]').val(type.type);
          modal.find("[name=send_update_status_email][value=" + type.send_update_status_email + "]").prop('checked', true);
          modal.find('[name=comment]').val(type.comment);
        });
      }).on('mousedown', '.cs-shop-order-status-delete', function(){
        var id;
        id = $(this).data('id');
        cs.Language('shop_').ready().then(function(L){
          cs.ui.confirm(L.sure_want_to_delete).then(function(){
            return cs.api("delete api/Shop/admin/order_statuses/" + id);
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
