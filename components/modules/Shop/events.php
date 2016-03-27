<?php
/**
 * @package   Shop
 * @attribute modules
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2014-2016, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
 */
namespace cs\modules\Shop;
use
	cs\Config,
	cs\Event,
	cs\Language\Prefix;

Event::instance()
	->on(
		'System/Request/routing_replace',
		function ($data) {
			$rc = explode('/', $data['rc']);
			$L  = new Prefix('shop_');
			if ($rc[0] != 'Shop' && $rc[0] != path($L->shop)) {
				return;
			}
			$rc[0] = 'Shop';
			if (!isset($rc[1])) {
				$rc[1] = 'categories_';
			}
			switch ($rc[1]) {
				case path($L->categories):
					$rc[1] = 'categories_';
					break;
				case path($L->items):
					$rc[1] = 'items_';
					break;
				case path($L->orders):
					$rc[1] = 'orders_';
					break;
				case path($L->cart):
					$rc[1] = 'cart';
					break;
			}
			$data['rc'] = implode('/', $rc);
		}
	)
	->on(
		'System/App/construct',
		function () {
			$module_data = Config::instance()->module('Shop');
			switch (true) {
				case $module_data->uninstalled():
					require __DIR__.'/events/uninstalled.php';
					break;
				case $module_data->enabled():
					require __DIR__.'/events/enabled.php';
					require __DIR__.'/events/enabled/admin.php';
				case $module_data->installed():
					require __DIR__.'/events/installed.php';
			}
		}
	);
