// Generated by LiveScript 1.5.0
/**
 * @package CleverStyle Framework
 * @author  Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @license 0BSD
 */
(function(){
  Polymer({
    is: 'cs-system-user-settings',
    behaviors: [cs.Polymer.behaviors.computed_bindings, cs.Polymer.behaviors.Language('system_profile_')],
    properties: {
      languages: Array,
      timezones: Array,
      user_data: Object,
      can_upload: 'file_upload' in cs
    },
    ready: function(){
      var this$ = this;
      cs.api(['get api/System/languages', 'get api/System/timezones', 'get api/System/profile']).then(function(arg$){
        var languages, timezones, user_data, languages_list, i$, len$, language, timezones_list, description, timezone;
        languages = arg$[0], timezones = arg$[1], user_data = arg$[2];
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
        this$.set('languages', languages_list);
        this$.set('timezones', timezones_list);
        this$.set('user_data', user_data);
      });
      if (typeof cs.file_upload == 'function') {
        cs.file_upload(this.$['upload-avatar'], function(files){
          if (files.length) {
            this$.set('user_data.avatar', files[0]);
          }
        });
      }
    },
    _save: function(e){
      var this$ = this;
      e.preventDefault();
      cs.api('patch api/System/profile', this.user_data).then(function(){
        cs.ui.notify(this$.L.changes_saved, 'success', 5);
      });
    }
  });
}).call(this);
