// Generated by LiveScript 1.4.0
/**
 * @package    CleverStyle Framework
 * @subpackage System module
 * @category   modules
 * @author     Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright  Copyright (c) 2015-2016, Nazar Mokrynskyi
 * @license    MIT License, see license.txt
 */
(function(){
  Polymer({
    'is': 'cs-system-admin-users-edit-user-form',
    behaviors: [cs.Polymer.behaviors.Language('system_admin_users_')],
    properties: {
      user_id: -1,
      user_data: {
        type: Object,
        value: {}
      },
      languages: Array,
      timezones: Array,
      block_until: {
        observer: '_block_until',
        type: String
      },
      can_upload: 'file_upload' in cs
    },
    ready: function(){
      var this$ = this;
      cs.api(['get api/System/languages', 'get api/System/timezones', 'get api/System/admin/users/' + this.user_id]).then(function(arg$){
        var languages, timezones, data, languages_list, i$, len$, language, timezones_list, description, timezone, block_until;
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
        block_until = function(){
          var date, z;
          block_until = data.block_until;
          date = new Date;
          if (parseInt(block_until)) {
            date.setTime(parseInt(block_until) * 1000);
          }
          z = function(number){
            return ('0' + number).substr(-2);
          };
          return date.getFullYear() + '-' + z(date.getMonth() + 1) + '-' + z(date.getDate()) + 'T' + z(date.getHours()) + ':' + z(date.getMinutes());
        }();
        this$.block_until = block_until;
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
      lock = e.currentTarget;
      password = lock.previousElementSibling;
      if (password.type === 'password') {
        password.type = 'text';
        lock.icon = 'unlock';
      } else {
        password.type = 'password';
        lock.icon = 'lock';
      }
    },
    _block_until: function(){
      var block_until, date;
      block_until = this.block_until;
      date = new Date;
      date.setFullYear(block_until.substr(0, 4));
      date.setMonth(block_until.substr(5, 2) - 1);
      date.setDate(block_until.substr(8, 2));
      date.setHours(block_until.substr(11, 2));
      date.setMinutes(block_until.substr(14, 2));
      date.setSeconds(0);
      date.setMilliseconds(0);
      this.set('user_data.block_until', date.getTime() / 1000);
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