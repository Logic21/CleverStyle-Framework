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
    is: 'cs-system-admin-themes',
    behaviors: [cs.Polymer.behaviors.computed_bindings, cs.Polymer.behaviors.Language('system_admin_appearance_'), cs.Polymer.behaviors.admin.System.components, cs.Polymer.behaviors.admin.System.upload],
    properties: {
      current_theme: String
    },
    ready: function(){
      this.reload();
    },
    reload: function(){
      var this$ = this;
      cs.api(['get api/System/admin/themes', 'get api/System/admin/themes/current']).then(function(arg$){
        var themes, current_theme;
        themes = arg$[0], current_theme = arg$[1];
        this$.current_theme = current_theme;
        themes.forEach(function(theme){
          var current;
          current = theme.name === this$.current_theme;
          theme['class'] = !current ? 'cs-block-warning cs-text-warning' : 'cs-block-success cs-text-success';
          theme.icon = !current ? 'minus' : 'check';
          theme.can_delete = !current && theme.name !== 'CleverStyle';
          (function(){
            var i$, ref$, len$, prop, ref1$, tag;
            for (i$ = 0, len$ = (ref$ = ['license', 'readme']).length; i$ < len$; ++i$) {
              prop = ref$[i$];
              if ((ref1$ = theme[prop]) != null && ref1$.type) {
                tag = theme[prop].type === 'txt' ? 'pre' : 'div';
                theme[prop].content = "<" + tag + ">" + theme[prop].content + "</" + tag + ">";
              }
            }
          })();
        });
        this$.set('themes', themes);
      });
    }
    /**
     * Provides next events:
     *  admin/System/themes/current/before
     *  {name : theme_name}
     *
     *  admin/System/themes/current/after
     *  {name : theme_name}
     */,
    _set_current: function(e){
      var this$ = this;
      this.current_theme = e.model.theme.name;
      cs.Event.fire('admin/System/themes/current/before', {
        name: this.current_theme
      }).then(function(){
        cs.api('put api/System/admin/themes/current', {
          theme: this$.current_theme
        }).then(function(){
          cs.ui.notify(this$.L.changes_saved, 'success', 5);
          this$.reload();
          cs.Event.fire('admin/System/themes/current/after', {
            name: this$.current_theme
          });
        });
      });
    },
    _remove_completely: function(e){
      this._remove_completely_component(e.model.theme.name, 'themes');
    }
    /**
     * Provides next events:
     *  admin/System/themes/update/before
     *  {name : theme_name}
     *
     *  admin/System/themes/update/after
     *  {name : theme_name}
     */,
    _upload: function(){
      var this$ = this;
      this._upload_package(this.$.file).then(function(meta){
        var i$, ref$, len$, theme;
        if (meta.category !== 'themes' || !meta['package'] || !meta.version) {
          cs.ui.notify(this$.L.this_is_not_theme_installer_file, 'error', 5);
          return;
        }
        for (i$ = 0, len$ = (ref$ = this$.themes).length; i$ < len$; ++i$) {
          theme = ref$[i$];
          if (theme.name === meta['package']) {
            if (meta.version === theme.meta.version) {
              cs.ui.notify(this$.L.update_theme_impossible_same_version(meta['package'], meta.version), 'warning', 5);
              return;
            }
            this$._update_component(theme.meta, meta);
            return;
          }
        }
        this$._extract(meta);
      });
    },
    _extract: function(meta){
      var this$ = this;
      cs.api('extract api/System/admin/themes').then(function(){
        this$.reload();
        cs.ui.notify(this$.L.changes_saved, 'success', 5);
      });
    }
  });
}).call(this);
