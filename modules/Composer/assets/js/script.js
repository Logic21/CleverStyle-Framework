// Generated by LiveScript 1.4.0
/**
 * @package   Composer
 * @category  modules
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2015-2017, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
 */
(function(){
  var modal, open_modal, ref$;
  modal = null;
  open_modal = function(action, package_name, category, force){
    force == null && (force = false);
    if (package_name === 'Composer' && !force) {
      return;
    }
    return cs.api('get api/System/admin/modules').then(function(modules){
      var i$, len$, module;
      for (i$ = 0, len$ = modules.length; i$ < len$; ++i$) {
        module = modules[i$];
        if (module.name === 'Composer' && module.active !== 1) {
          return;
        }
      }
      force = force ? 'force' : '';
      modal = cs.ui.simple_modal("<cs-composer action=\"" + action + "\" package=\"" + package_name + "\" " + force + "/>");
      modal.addEventListener('close', function(){
        cs.Event.fire('admin/Composer/canceled');
      });
      return new Promise(function(resolve){
        cs.Event.once('admin/Composer/updated', function(){
          if (!force) {
            modal.close();
          }
          resolve();
        });
      });
    });
  };
  cs.Event.on('admin/System/modules/install/before', function(data){
    return open_modal('install', data.name, 'modules');
  }).on('admin/System/modules/uninstall/before', function(data){
    return open_modal('uninstall', data.name, 'modules');
  }).on('admin/System/modules/update/after', function(data){
    return open_modal('update', data.name, 'modules');
  });
  if ((ref$ = document.querySelector('.cs-composer-admin-force-update')) != null) {
    ref$.addEventListener('click', function(){
      open_modal('install', 'Composer', 'modules', true);
    });
  }
}).call(this);
