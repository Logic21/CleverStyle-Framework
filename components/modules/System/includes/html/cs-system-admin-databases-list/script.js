// Generated by LiveScript 1.4.0
/**
 * @package    CleverStyle CMS
 * @subpackage System module
 * @category   modules
 * @author     Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright  Copyright (c) 2015, Nazar Mokrynskyi
 * @license    MIT License, see license.txt
 */
(function(){
  var L;
  L = cs.Language;
  Polymer({
    'is': 'cs-system-admin-databases-list',
    behaviors: [cs.Polymer.behaviors.Language],
    ready: function(){
      this.reload();
    },
    reload: function(){
      var this$ = this;
      $.getJSON('api/System/admin/databases', function(databases){
        this$.set('databases', databases);
      });
    },
    _add: function(e){
      var database, this$ = this;
      database = e.model && e.model.database;
      $(cs.ui.simple_modal("<h3>" + L.addition_of_db + "</h3>\n<cs-system-admin-databases-form add database-index=\"" + (database && database.index) + "\"/>")).on('close', function(){
        this$.reload();
      });
    },
    _edit: function(e){
      var database_model, database, mirror, name, this$ = this;
      database_model = this.$.databases_list.modelForElement(e.target);
      database = e.model.database || database_model.database;
      mirror = e.model.mirror;
      name = this._database_name(database, mirror);
      $(cs.ui.simple_modal("<h3>" + L.editing_the_database(name) + "</h3>\n<cs-system-admin-databases-form database-index=\"" + database.index + "\" mirror-index=\"" + (mirror && mirror.index) + "\"/>")).on('close', function(){
        this$.reload();
      });
    },
    _database_name: function(database, mirror){
      var master_db_name, this$ = this;
      if (mirror) {
        master_db_name = function(){
          var i$, ref$, len$, db;
          for (i$ = 0, len$ = (ref$ = this$.databases).length; i$ < len$; ++i$) {
            db = ref$[i$];
            if (db.index == database.index) {
              return db.name + " " + db.host + "/" + db.type;
            }
          }
        }();
        return L.mirror + ' ' + (database.index
          ? L.db + ' ' + master_db_name
          : L.core_db) + (", " + mirror.name + " " + mirror.host + "/" + mirror.type);
      } else {
        return L.db + " " + database.name + " " + database.host + "/" + database.type;
      }
    },
    _delete: function(e){
      var database_model, database, mirror, name, this$ = this;
      database_model = this.$.databases_list.modelForElement(e.target);
      database = e.model.database || database_model.database;
      mirror = e.model.mirror;
      name = this._database_name(database, mirror);
      cs.ui.confirm(L.sure_to_delete + " " + name + "?", function(){
        $.ajax({
          url: 'api/System/admin/databases/' + database.index + (mirror ? '/' + mirror.index : ''),
          type: 'delete',
          success: function(){
            cs.ui.notify(L.changes_saved, 'success', 5);
            this$.reload();
          }
        });
      });
    }
  });
}).call(this);
