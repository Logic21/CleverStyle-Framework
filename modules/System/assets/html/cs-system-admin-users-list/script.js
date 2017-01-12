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
  var STATUS_ACTIVE, STATUS_INACTIVE, GUEST_ID, ROOT_ID;
  STATUS_ACTIVE = 1;
  STATUS_INACTIVE = 0;
  GUEST_ID = 1;
  ROOT_ID = 2;
  Polymer({
    is: 'cs-system-admin-users-list',
    behaviors: [cs.Polymer.behaviors.Language('system_admin_users_')],
    properties: {
      search_column: '',
      search_mode: 'LIKE',
      search_text: {
        observer: 'search_textChanged',
        type: String,
        value: ''
      },
      search_page: {
        observer: 'search',
        type: Number,
        value: 1
      },
      search_pages: {
        computed: '_search_pages(users_count, search_limit)',
        type: Number
      },
      search_limit: 20,
      search_columns: [],
      search_modes: [],
      all_columns: [],
      columns: ['id', 'login', 'username', 'email'],
      users: [],
      users_count: 0,
      show_pagination: {
        computed: '_show_pagination(users_count, search_limit)',
        type: Boolean
      },
      searching: false,
      searching_loader: false,
      _initialized: true
    },
    observers: ['search_again(search_column, search_mode, search_limit, _initialized)'],
    ready: function(){
      var this$ = this;
      cs.api('search_options api/System/admin/users').then(function(search_options){
        var search_columns, i$, ref$, len$, column;
        search_columns = [];
        for (i$ = 0, len$ = (ref$ = search_options.columns).length; i$ < len$; ++i$) {
          column = ref$[i$];
          search_columns.push({
            name: column,
            selected: this$.columns.indexOf(column) !== -1
          });
        }
        this$.search_columns = search_columns;
        this$.all_columns = search_options.columns;
        this$.search_modes = search_options.modes;
      });
    },
    search: function(){
      var searching_timeout, this$ = this;
      if (this.searching || this._initialized === undefined) {
        return;
      }
      this.searching = true;
      searching_timeout = setTimeout(function(){
        this$.searching_loader = true;
      }, 200);
      Promise.all([
        cs.api('search api/System/admin/users', {
          column: this.search_column,
          mode: this.search_mode,
          text: this.search_text,
          page: this.search_page,
          limit: this.search_limit
        }), cs.Language.ready()
      ]).then(function(arg$){
        var data;
        data = arg$[0];
        clearTimeout(searching_timeout);
        this$.searching = false;
        this$.searching_loader = false;
        this$.users_count = data.count;
        if (!data.count) {
          this$.set('users', []);
          return;
        }
        data.users.forEach(function(user){
          var res$, i$, ref$, len$, column;
          user['class'] = (function(){
            switch (parseInt(user.status)) {
            case STATUS_ACTIVE:
              return 'cs-block-success cs-text-success';
            case STATUS_INACTIVE:
              return 'cs-block-warning cs-text-warning';
            default:
              return '';
            }
          }());
          user.is_guest = user.id == GUEST_ID;
          user.is_root = user.id == ROOT_ID;
          res$ = [];
          for (i$ = 0, len$ = (ref$ = this$.columns).length; i$ < len$; ++i$) {
            column = ref$[i$];
            res$.push(fn$());
          }
          user.columns = res$;
          (function(){
            var type;
            type = user.is_root || user.is_admin
              ? 'admin'
              : user.is_user ? 'user' : 'guest';
            user.type = this$.L[type];
            return user.type_info = this$.L[type + '_info'];
          })();
          function fn$(value){
            value == null && (value = user[column]);
            if (value instanceof Array) {
              return value.join(', ');
            } else {
              return value;
            }
          }
        });
        this$.set('users', data.users);
      })['catch'](function(){
        clearTimeout(searching_timeout);
        this$.searching = false;
        this$.searching_loader = false;
        this$.set('users', []);
        this$.users_count = 0;
      });
    },
    toggle_search_column: function(e){
      var index, column;
      index = e.model.index;
      column = this.search_columns[index];
      this.set(['search_columns', index, 'selected'], !column.selected);
      this.set('columns', (function(){
        var i$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = this.search_columns).length; i$ < len$; ++i$) {
          column = ref$[i$];
          if (column.selected) {
            results$.push(column.name);
          }
        }
        return results$;
      }.call(this)));
      this.search_again();
    },
    search_again: function(){
      if (this.search_page > 1) {
        this.search_page = 1;
      } else {
        this.search();
      }
    },
    search_textChanged: function(){
      if (this._initialized === undefined) {
        return;
      }
      clearTimeout(this.search_text_timeout);
      this.search_text_timeout = setTimeout(this.search_again.bind(this), 300);
    },
    _show_pagination: function(users_count, search_limit){
      return parseInt(users_count) > parseInt(search_limit);
    },
    _search_pages: function(users_count, search_limit){
      return Math.ceil(users_count / search_limit);
    },
    add_user: function(){
      cs.ui.simple_modal("<h3>" + this.L.adding_a_user + "</h3>\n<cs-system-admin-users-add-user-form/>").addEventListener('close', bind$(this, 'search'));
    },
    edit_user: function(e){
      var data, index, user, title;
      data = e.currentTarget.parentElement;
      while (!data.matches('[data-user-index]')) {
        data = data.parentElement;
      }
      index = data.dataset.userIndex;
      user = this.users[index];
      title = this.L.editing_of_user_information(user.username || user.login);
      cs.ui.simple_modal("<h2>" + title + "</h2>\n<cs-system-admin-users-edit-user-form user_id=\"" + user.id + "\"/>").addEventListener('close', bind$(this, 'search'));
    },
    edit_groups: function(e){
      var data, index, user, title;
      data = e.currentTarget.parentElement;
      while (!data.matches('[data-user-index]')) {
        data = data.parentElement;
      }
      index = data.dataset.userIndex;
      user = this.users[index];
      title = this.L.user_groups(user.username || user.login);
      cs.ui.simple_modal("<h2>" + title + "</h2>\n<cs-system-admin-users-groups-form user=\"" + user.id + "\" for=\"user\"/>");
    },
    edit_permissions: function(e){
      var data, index, user, title;
      data = e.currentTarget.parentElement;
      while (!data.matches('[data-user-index]')) {
        data = data.parentElement;
      }
      index = data.dataset.userIndex;
      user = this.users[index];
      title = this.L.permissions_for_user(user.username || user.login);
      cs.ui.simple_modal("<h2>" + title + "</h2>\n<cs-system-admin-permissions-for user=\"" + user.id + "\" for=\"user\"/>");
    }
  });
  function bind$(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
  }
}).call(this);
