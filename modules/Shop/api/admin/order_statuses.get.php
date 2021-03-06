<?php
/**
 * @package  Shop
 * @category modules
 * @author   Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @license  0BSD
 */
namespace cs\modules\Shop;
use
	cs\ExitException,
	cs\Page,
	cs\Request;

$Request        = Request::instance();
$Page           = Page::instance();
$Order_statuses = Order_statuses::instance();
if (isset($Request->route_ids[0])) {
	$order_status = $Order_statuses->get($Request->route_ids[0]);
	if (!$order_status) {
		throw new ExitException(404);
	} else {
		$Page->json($order_status);
	}
} elseif (isset($Request->route_path[2]) && $Request->route_path[2] == 'types') {
	$Page->json(
		$Order_statuses->get_type_to_name_array()
	);
} else {
	$Page->json(
		$Order_statuses->get(
			$Order_statuses->get_all()
		)
	);
}
