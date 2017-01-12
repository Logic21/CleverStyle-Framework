<?php
/**
 * @package   Photo gallery
 * @category  modules
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2013-2017, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
 */
namespace cs\modules\Photo_gallery;
use
	h,
	cs\Language\Prefix,
	cs\Page;

$L             = new Prefix('photo_gallery_');
$Photo_gallery = Photo_gallery::instance();
$module        = path($L->Photo_gallery);
Page::instance()
	->title($L->browse_galleries)
	->content(
		h::{'table.cs-table[list]'}(
			h::{'tr th'}(
				$L->galleries,
				$L->action
			).
			h::{'tr| td'}(
				array_map(
					function ($gallery) use ($Photo_gallery, $L, $module) {
						$gallery = $Photo_gallery->get_gallery($gallery);
						return [
							h::a(
								$gallery['title'],
								[
									'href' => "$module/$gallery[path]"
								]
							),
							h::{'a[is=cs-link-button][icon=pencil]'}(
								[
									'href'    => "admin/Photo_gallery/galleries/edit/$gallery[id]",
									'tooltip' => $L->edit
								]
							).
							h::{'a[is=cs-link-button][icon=trash]'}(
								[
									'href'    => "admin/Photo_gallery/galleries/delete/$gallery[id]",
									'tooltip' => $L->delete
								]
							)
						];
					},
					array_values($Photo_gallery->get_galleries_list())
				)
			)
		).
		h::{'p.cs-text-left a[is=cs-link-button]'}(
			$L->add_gallery,
			[
				'href' => 'admin/Photo_gallery/galleries/add'
			]
		)
	);
