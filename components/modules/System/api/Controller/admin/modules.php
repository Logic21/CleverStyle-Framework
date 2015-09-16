<?php
/**
 * @package    CleverStyle CMS
 * @subpackage System module
 * @category   modules
 * @author     Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright  Copyright (c) 2015, Nazar Mokrynskyi
 * @license    MIT License, see license.txt
 */
namespace cs\modules\System\api\Controller\admin;
use
	cs\Config,
	cs\Event,
	cs\ExitException,
	cs\Page;
trait modules {
	/**
	 * Getting list of all modules data in extended form
	 */
	static function admin_modules___get () {
		$Config       = Config::instance();
		$modules_list = [];
		foreach ($Config->components['modules'] as $module_name => &$module_data) {
			$module = [
				'active'                => $module_data['active'],
				'name'                  => $module_name,
				'is_default'            => $module_name == $Config->core['default_module'],
				'can_be_set_as_default' =>
					$module_data['active'] == 1 &&
					$module_name != $Config->core['default_module'] &&
					file_exists_with_extension(MODULES."/$module_name/index", ['php', 'html', 'json']),
				'db_settings'           => !$Config->core['simple_admin_mode'] && @$module_data['db'] && count($Config->db) > 1,
				'storage_settings'      => !$Config->core['simple_admin_mode'] && @$module_data['storage'] && count($Config->storage) > 1,
				'administration'        =>
					$module_data['active'] != -1 &&
					file_exists_with_extension(MODULES."/$module_name/admin/index", ['php', 'json'])
			];
			/**
			 * Check if API available
			 */
			static::check_module_feature_availability($module, 'readme', 'api');
			/**
			 * Check if readme available
			 */
			static::check_module_feature_availability($module, 'readme');
			/**
			 * Check if license available
			 */
			static::check_module_feature_availability($module, 'license');
			if (file_exists(MODULES."/$module_name/meta.json")) {
				$module['meta'] = file_get_json(MODULES."/$module_name/meta.json");
			}
			$modules_list[] = $module;
		}
		unset($module_name, $module_data, $module);
		Page::instance()->json($modules_list);
	}
	/**
	 * @param array  $module
	 * @param string $feature
	 * @param string $dir
	 */
	protected static function check_module_feature_availability (&$module, $feature, $dir = '') {
		/**
		 * Check if feature available
		 */
		$file = file_exists_with_extension(MODULES."/$module[name]/$dir/$feature", ['txt', 'html']);
		if ($file) {
			$module[$dir ?: $feature] = [
				'type'    => substr($file, -3) == 'txt' ? 'txt' : 'html',
				'content' => file_get_contents($file)
			];
		} elseif ($dir && is_dir(MODULES."/$module[name]/$dir")) {
			$module[$dir ?: $feature] = [];
		}
	}
	/**
	 * Delete module completely
	 *
	 * @throws ExitException
	 */
	static function admin_modules___delete () {
		if (!isset($_POST['module'])) {
			throw new ExitException(400);
		}
		$module_name = $_POST['module'];
		$Config      = Config::instance();
		if (!isset($Config->components['modules'][$module_name])) {
			throw new ExitException(404);
		}
		if (
			$module_name == 'System' ||
			$Config->components['modules'][$module_name]['active'] != '-1'
		) {
			throw new ExitException(400);
		}
		if (!rmdir_recursive(MODULES."/$module_name")) {
			throw new ExitException(500);
		}
		unset($Config->components['modules'][$module_name]);
		if (!$Config->save()) {
			throw new ExitException(500);
		}
	}
	/**
	 * Get current default module
	 */
	static function admin_modules_default_get () {
		Page::instance()->json(
			Config::instance()->core['default_module']
		);
	}
	/**
	 * Set current default module
	 *
	 * @throws ExitException
	 */
	static function admin_modules_default_put () {
		if (!isset($_POST['module'])) {
			throw new ExitException(400);
		}
		$module_name = $_POST['module'];
		$Config      = Config::instance();
		if (!isset($Config->components['modules'][$module_name])) {
			throw new ExitException(404);
		}
		if (
			$module_name == $Config->core['default_module'] ||
			$Config->components['modules'][$module_name]['active'] != 1 ||
			!(
				file_exists(MODULES."/$module_name/index.php") ||
				file_exists(MODULES."/$module_name/index.html") ||
				file_exists(MODULES."/$module_name/index.json")
			)
		) {
			throw new ExitException(400);
		}
		if (!Event::instance()->fire(
			'admin/System/components/modules/default',
			[
				'name' => $module_name
			]
		)
		) {
			throw new ExitException(500);
		}
		$Config->core['default_module'] = $module_name;
		if (!$Config->save()) {
			throw new ExitException(500);
		}
	}
}
