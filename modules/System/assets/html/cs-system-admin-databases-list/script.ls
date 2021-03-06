/**
 * @package    CleverStyle Framework
 * @subpackage System module
 * @category   modules
 * @author     Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @license    0BSD
 */
Polymer(
	is			: 'cs-system-admin-databases-list'
	behaviors	: [
		cs.Polymer.behaviors.computed_bindings
		cs.Polymer.behaviors.Language('system_admin_databases_')
		cs.Polymer.behaviors.admin.System.settings
	]
	properties	:
		settings_api_url	: 'api/System/admin/databases'
	ready : !->
		@reload()
	reload : !->
		cs.api('get api/System/admin/databases').then (databases) !~>
			@set('databases', databases)
	_add : (e) !->
		database	= e.model && e.model.database
		cs.ui.simple_modal("""
			<h3>#{@L.database_addition}</h3>
			<cs-system-admin-databases-form add database-index="#{database && database.index}"/>
		""").addEventListener('close', @~reload)
	_edit : (e) !->
		# Hack: ugly, but the only way to do it while https://github.com/Polymer/polymer/issues/1865 not resolved
		database_model	= @$.databases_list.modelForElement(e.target)
		database		= e.model.database || database_model.database
		mirror			= e.model.mirror
		name			= @_database_name(database, mirror)
		cs.ui.simple_modal("""
			<h3>#{@L.editing_database(name)}</h3>
			<cs-system-admin-databases-form database-index="#{database.index}" mirror-index="#{mirror && mirror.index}"/>
		""").addEventListener('close', @~reload)
	_database_name : (database, mirror) ->
		if mirror
			master_db_name = do !~>
				for db in @databases
					if db.index ~= database.index
						return "#{db.name} #{db.host}/#{db.driver}"
			@L.mirror + ' ' + (if database.index then @L.db + ' ' + master_db_name else @L.core_db) + ", #{mirror.name} #{mirror.host}/#{mirror.driver}"
		else
			"#{@L.db} #{database.name} #{database.host}/#{database.driver}"
	_delete : (e) !->
		# Hack: ugly, but the only way to do it while https://github.com/Polymer/polymer/issues/1865 not resolved
		database_model	= @$.databases_list.modelForElement(e.target)
		database		= e.model.database || database_model.database
		mirror			= e.model.mirror
		name			= @_database_name(database, mirror)
		suffix			= if mirror then '/' + mirror.index else ''
		cs.ui.confirm(@L.sure_to_delete(name))
			.then -> cs.api('delete api/System/admin/databases/' + database.index + suffix)
			.then !~>
				cs.ui.notify(@L.changes_saved, 'success', 5)
				@reload()
)
