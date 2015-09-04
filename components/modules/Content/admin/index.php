<?php
/**
 * @package   Content
 * @category  modules
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2014-2015, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
 */

namespace cs\modules\Content;

use
	h,
	cs\Config,
	cs\Index,
	cs\Language\Prefix;

$Index       = Index::instance();
$L           = new Prefix('content_');
$Content     = Content::instance();
$all_items   = $Content->get($Content->get_all());
$module_data = Config::instance()->module('Content');

if (isset($_POST['simple_insert'])) {
	$module_data->simple_insert = $_POST['simple_insert'];
	$Index->save(true);
}

$Index->content(
	h::{'table.cs-table[center][list]'}(
		h::{'tr td'}(
			[
				$L->key,
				$L->title,
				$L->type,
				$L->action
			]
		).
		h::{'tr| td'}(
			array_map(
				function ($item) use ($L) {
					return [
						$item['key'],
						$item['title'],
						$item['type'],
						h::{'button.cs-content-edit[is=cs-button]'}(
							$L->edit,
							[
								'data-key' => $item['key']
							]
						).
						h::{'button.cs-content-delete[is=cs-button]'}(
							$L->delete,
							[
								'data-key' => $item['key']
							]
						)
					];
				},
				$all_items
			) ?: false
		)
	).
	h::{'p button.cs-content-add[is=cs-button]'}($L->add).
	h::{'table.cs-table[right-left] tr td'}(
		h::info('content_simple_insert'),
		h::radio(
			[
				'name'    => 'simple_insert',
				'value'   => [0, 1],
				'in'      => [$L->no, $L->yes],
				'checked' => $module_data->simple_insert
			]
		)
	)
);
