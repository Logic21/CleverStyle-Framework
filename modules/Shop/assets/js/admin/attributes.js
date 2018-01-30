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
      var set_attribute_types, make_modal;
      set_attribute_types = [1, 2, 6, 9];
      make_modal = function(types, L, title, action){
        var res$, index, type;
        res$ = [];
        for (index in types) {
          type = types[index];
          res$.push("<option value=\"" + index + "\">" + type + "</option>");
        }
        types = res$;
        types = types.join('');
        return cs.ui.simple_modal("<cs-form><form>\n	<h3 class=\"cs-text-center\">" + title + "</h3>\n	<label>" + L.attribute_type + "</label>\n	<cs-select><select name=\"type\" required>" + types + "</select></cs-select>\n	<label>" + L.possible_values + "</label>\n	<cs-textarea autosize><textarea name=\"value\"></textarea></cs-textarea>\n	<label>" + L.title + "</label>\n	<cs-input-text><input name=\"title\" required></cs-input-text>\n	<label>" + L.title_internal + "</label>\n	<cs-input-text><input name=\"title_internal\" required></cs-input-text>\n	<br>\n	<cs-button primary><button type=\"submit\">" + action + "</button></cs-button>\n</form></cs-form>");
      };
      $('html').on('mousedown', '.cs-shop-attribute-add', function(){
        Promise.all([cs.api('get api/Shop/admin/attributes/types'), cs.Language('shop_').ready()]).then(function(arg$){
          var types, L, $modal;
          types = arg$[0], L = arg$[1];
          $modal = $(make_modal(types, L, L.attribute_addition, L.add));
          $modal.on('submit', 'form', function(){
            var type, value, data;
            type = $modal.find('[name=type]').val();
            value = set_attribute_types.indexOf(parseInt(type)) !== -1 ? $modal.find('[name=value]').val().split('\n') : '';
            data = {
              type: type,
              title: $modal.find('[name=title]').val(),
              title_internal: $modal.find('[name=title_internal]').val(),
              value: value
            };
            cs.api('post api/Shop/admin/attributes', data).then(function(){
              return cs.ui.alert(L.added_successfully);
            }).then(bind$(location, 'reload'));
            return false;
          }).on('change', '[name=type]', function(){
            var value_container, type;
            value_container = $(this).parent().next();
            type = $(this).val();
            if (set_attribute_types.indexOf(parseInt(type)) !== -1) {
              value_container.show();
            } else {
              value_container.hide();
            }
          });
        });
      }).on('mousedown', '.cs-shop-attribute-edit', function(){
        var id;
        id = $(this).data('id');
        Promise.all([cs.api(['get api/Shop/admin/attributes/types', "get api/Shop/admin/attributes/" + id]), cs.Language('shop_').ready()]).then(function(arg$){
          var ref$, types, attribute, L, $modal;
          ref$ = arg$[0], types = ref$[0], attribute = ref$[1], L = arg$[1];
          $modal = $(make_modal(types, L, L.attribute_edition, L.edit));
          $modal.on('submit', 'form', function(){
            var type, value, data;
            type = $modal.find('[name=type]').val();
            value = set_attribute_types.indexOf(parseInt(type)) !== -1 ? $modal.find('[name=value]').val().split('\n') : '';
            data = {
              type: type,
              title: $modal.find('[name=title]').val(),
              title_internal: $modal.find('[name=title_internal]').val(),
              value: value
            };
            cs.api("put api/Shop/admin/attributes/" + id, data).then(function(){
              return cs.ui.alert(L.edited_successfully);
            }).then(bind$(location, 'reload'));
            return false;
          }).on('change', '[name=type]', function(){
            var value_container, type;
            value_container = $(this).parent().next();
            type = $(this).val();
            if (set_attribute_types.indexOf(parseInt(type)) !== -1) {
              value_container.show();
            } else {
              value_container.hide();
            }
          });
          $modal.find('[name=type]').val(attribute.type).change();
          $modal.find('[name=value]').val(attribute.value ? attribute.value.join('\n') : '');
          $modal.find('[name=title]').val(attribute.title);
          $modal.find('[name=title_internal]').val(attribute.title_internal);
        });
      }).on('mousedown', '.cs-shop-attribute-delete', function(){
        var id;
        id = $(this).data('id');
        cs.Language('shop_').ready().then(function(L){
          cs.ui.confirm(L.sure_want_to_delete).then(function(){
            return cs.api("delete api/Shop/admin/attributes/" + id);
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
