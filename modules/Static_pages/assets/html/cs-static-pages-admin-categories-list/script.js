// Generated by LiveScript 1.5.0
/**
 * @package  Static pages
 * @category modules
 * @author   Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @license  0BSD
 */
(function(){
  Polymer({
    is: 'cs-static-pages-admin-categories-list',
    behaviors: [cs.Polymer.behaviors.computed_bindings, cs.Polymer.behaviors.Language('static_pages_')],
    properties: {
      categories: Array
    },
    ready: function(){
      this._reload_categories();
    },
    _reload_categories: function(){
      var this$ = this;
      cs.api('get api/Static_pages/admin/categories').then(function(categories){
        this$.set('categories', categories);
      });
    },
    _add: function(){
      cs.ui.simple_modal("<h3>" + this.L.addition_of_page_category + "</h3>\n<cs-static-pages-admin-categories-add-edit-form/>").addEventListener('close', bind$(this, '_reload_categories'));
    },
    _edit: function(e){
      var title;
      title = this.L.editing_of_page_category(e.model.item.title);
      cs.ui.simple_modal("<h2>" + title + "</h2>\n<cs-static-pages-admin-categories-add-edit-form id=\"" + e.model.item.id + "\"/>").addEventListener('close', bind$(this, '_reload_categories'));
    },
    _delete: function(e){
      var this$ = this;
      cs.ui.confirm(this.L.sure_to_delete_page_category(e.model.item.title)).then(function(){
        return cs.api('delete api/Static_pages/admin/categories/' + e.model.item.id);
      }).then(function(){
        cs.ui.notify(this$.L.changes_saved, 'success', 5);
        this$._reload_categories();
      });
    },
    _add_page: function(){
      cs.ui.simple_modal("<h3>" + this.L.adding_of_page + "</h3>\n<cs-static-pages-admin-pages-add-edit-form/>").addEventListener('close', bind$(this, '_reload_categories'));
    }
  });
  function bind$(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
  }
}).call(this);
