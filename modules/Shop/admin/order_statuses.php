<?php
/**
 * @package  Shop
 * @category modules
 * @author   Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @license  0BSD
 */
namespace cs\modules\Shop;
use
	h,
	cs\Language\Prefix,
	cs\Page;

$L                  = new Prefix('shop_');
$Order_statuses     = Order_statuses::instance();
$all_order_statuses = $Order_statuses->get($Order_statuses->get_all());
$order_status_types = $Order_statuses->get_type_to_name_array();
usort(
	$all_order_statuses,
	function ($order_status1, $order_status2) {
		return $order_status1['title'] <=> $order_status2['title'];
	}
);
Page::instance()
	->title($L->order_statuses)
	->content(
		h::{'cs-form form'}(
			h::h2($L->order_statuses).
			h::{'table.cs-table[list]'}(
				h::{'tr th'}(
					'id',
					"$L->title ".h::icon('caret-down'),
					$L->order_status_type,
					$L->send_update_status_email,
					$L->action
				).
				h::{'tr| td'}(
					array_map(
						function ($order_status) use ($L, $order_status_types) {
							return [
								[
									$order_status['id'],
									$order_status['title'],
									$order_status_types[$order_status['type']],
									h::icon($order_status['send_update_status_email'] ? 'check' : 'minus'),
									h::{'cs-button button.cs-shop-order-status-edit'}(
										$L->edit,
										[
											'data-id' => $order_status['id']
										]
									).
									h::{'cs-button button.cs-shop-order-status-delete'}(
										$L->delete,
										[
											'data-id' => $order_status['id']
										]
									)
								],
								[
									'style' => $order_status['color'] ? "background: $order_status[color]" : ''
								]
							];
						},
						$all_order_statuses
					) ?: false
				)
			).
			h::{'p cs-button button.cs-shop-order-status-add'}($L->add)
		)
	);
