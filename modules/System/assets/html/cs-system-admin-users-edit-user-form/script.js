// Generated by LiveScript 1.5.0
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
    is: 'cs-system-admin-users-edit-user-form',
    behaviors: [cs.Polymer.behaviors.Language('system_admin_users_')],
    properties: {
      user_id: -1,
      user_data: {
        type: Object,
        value: {}
      },
      languages: Array,
      timezones: Array,
      can_upload: 'file_upload' in cs
    },
    ready: function(){
      var this$ = this;
      cs.api(['get api/System/languages', 'get api/System/timezones', 'get api/System/admin/users/' + this.user_id]).then(function(arg$){
        var languages, timezones, data, languages_list, i$, len$, language, timezones_list, description, timezone;
        languages = arg$[0], timezones = arg$[1], data = arg$[2];
        languages_list = [];
        languages_list.push({
          clanguage: '',
          description: this$.L.system_default
        });
        for (i$ = 0, len$ = languages.length; i$ < len$; ++i$) {
          language = languages[i$];
          languages_list.push({
            clanguage: language,
            description: language
          });
        }
        timezones_list = [];
        timezones_list.push({
          timezone: '',
          description: this$.L.system_default
        });
        for (description in timezones) {
          timezone = timezones[description];
          timezones_list.push({
            timezone: timezone,
            description: description
          });
        }
        this$.languages = languages_list;
        this$.timezones = timezones_list;
        this$.user_data = data;
      });
      if (typeof cs.file_upload == 'function') {
        cs.file_upload(this.$['upload-avatar'], function(files){
          if (files.length) {
            this$.set('user_data.avatar', files[0]);
          }
        });
      }
    },
    _show_password: function(e){
      var lock, password;
      lock = e.currentTarget.querySelector('cs-icon');
      password = lock.parentElement.parentElement.previousElementSibling.firstElementChild;
      if (password.type === 'password') {
        password.type = 'text';
        lock.icon = 'unlock';
      } else {
        password.type = 'password';
        lock.icon = 'lock';
      }
    },
    save: function(){
      var this$ = this;
      cs.api('patch api/System/admin/users/' + this.user_id, {
        user: this.user_data
      }).then(function(){
        cs.ui.notify(this$.L.changes_saved, 'success', 5);
      });
    }
  });
}).call(this);
