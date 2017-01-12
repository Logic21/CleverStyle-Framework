// Generated by LiveScript 1.4.0
/**
 * @package    CleverStyle Framework
 * @subpackage System module
 * @category   modules
 * @author     Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright  Copyright (c) 2015-2017, Nazar Mokrynskyi
 * @license    MIT License, see license.txt
 */
(function(){
  Polymer({
    is: 'cs-system-admin-groups-form',
    behaviors: [cs.Polymer.behaviors.Language('system_admin_groups_')],
    properties: {
      group_id: Number,
      group_title: '',
      group_description: ''
    },
    ready: function(){
      var this$ = this;
      if (this.group_id) {
        cs.api('get api/System/admin/groups/' + this.group_id).then(function(arg$){
          this$.group_title = arg$.title, this$.group_description = arg$.description;
        });
      }
    },
    save: function(){
      var method, suffix, this$ = this;
      method = this.group_id ? 'put' : 'post';
      suffix = this.group_id ? '/' + this.group_id : '';
      cs.api(method + " api/System/admin/groups" + suffix, {
        title: this.group_title,
        description: this.group_description
      }).then(function(){
        cs.ui.notify(this$.L.changes_saved, 'success', 5);
      });
    }
  });
}).call(this);
