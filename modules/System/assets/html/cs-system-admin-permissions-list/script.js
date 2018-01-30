// Generated by LiveScript 1.5.0
/**
 * @package    CleverStyle Framework
 * @subpackage System module
 * @category   modules
 * @author     Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @license    0BSD
 */
(function(){
  Polymer({
    is: 'cs-system-admin-permissions-list',
    behaviors: [cs.Polymer.behaviors.computed_bindings, cs.Polymer.behaviors.Language('system_admin_permissions_')],
    properties: {
      permissions: [],
      permissions_loaded: false
    },
    ready: function(){
      this.reload();
    },
    reload: function(){
      var this$ = this;
      cs.api(['get api/System/admin/blocks', 'get api/System/admin/permissions']).then(function(arg$){
        var blocks, permissions, block_index_to_title, permissions_list, group, labels, label, id;
        blocks = arg$[0], permissions = arg$[1];
        block_index_to_title = {};
        blocks.forEach(function(block){
          return block_index_to_title[block.index] = block.title;
        });
        permissions_list = [];
        for (group in permissions) {
          labels = permissions[group];
          for (label in labels) {
            id = labels[label];
            permissions_list.push({
              id: id,
              group: group,
              label: label,
              description: group === 'Block' ? block_index_to_title[label] : ''
            });
          }
        }
        this$.set('permissions', permissions_list);
        this$.permissions_loaded = true;
      });
    },
    add_permission: function(){
      cs.ui.simple_modal("<h3>" + this.L.adding_permission + "</h3>\n<p class=\"cs-block-error cs-text-error\">" + this.L.changing_settings_warning + "</p>\n<cs-system-admin-permissions-form/>").addEventListener('close', bind$(this, 'reload'));
    },
    edit_permission: function(e){
      var permission;
      permission = e.model.permission;
      cs.ui.simple_modal("<h3>" + this.L.editing_permission(permission.group + '/' + permission.label) + "</h3>\n<p class=\"cs-block-error cs-text-error\">" + this.L.changing_settings_warning + "</p>\n<cs-system-admin-permissions-form permission_id=\"" + permission.id + "\"/>").addEventListener('close', bind$(this, 'reload'));
    },
    delete_permission: function(e){
      var permission, this$ = this;
      permission = e.model.permission;
      cs.ui.confirm("<h3>" + this.L.sure_delete_permission(permission.group + '/' + permission.label) + "</h3>\n<p class=\"cs-block-error cs-text-error\">" + this.L.changing_settings_warning + "</p>").then(function(){
        return cs.api('delete api/System/admin/permissions/' + permission.id);
      }).then(function(){
        cs.ui.notify(this$.L.changes_saved, 'success', 5);
        this$.splice('permissions', e.model.index, 1);
      });
    }
  });
  function bind$(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
  }
}).call(this);
