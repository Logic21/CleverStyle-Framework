<?php
/**
 * @package  Photo gallery
 * @category modules
 * @author   Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @license  0BSD
 */
namespace cs\modules\Photo_gallery;
use
	h,
	cs\Language\Prefix,
	cs\Page,
	cs\Request,
	cs\User;

$L             = new Prefix('photo_gallery_');
$User          = User::instance();
$Photo_gallery = Photo_gallery::instance();
$images        = $Photo_gallery->get(explode(',', Request::instance()->route[1])) ?: [];
Page::instance()
	->title($L->images_editing)
	->content(
		h::form(
			h::{'section.cs-photo-gallery-edit-images article'}(
				array_map(
					function ($image) use ($L, $User) {
						if (!$User->admin() && $image['user'] != $User->id) {
							return false;
						}
						return
							h::{'a[target=_new]'}(
								h::img(
									[
										'src' => $image['preview']
									]
								),
								[
									'href' => $image['original']
								]
							).
							h::div(
								h::label($L->image_title).
								h::{'cs-input-text input'}(
									[
										'name'  => "edit_images[$image[id]][title]",
										'value' => $image['title']
									]
								).
								h::label($L->image_description).
								h::{'cs-textarea[autosize] textarea'}(
									$image['description'],
									[
										'name' => "edit_images[$image[id]][description]"
									]
								).
								h::br(2).
								h::radio(
									[
										'name'  => "edit_images[$image[id]][delete]",
										'value' => [0, 1],
										'in'    => [$L->edit, $L->delete_image]
									]
								)
							);
					},
					$images
				)
			).
			h::{'p cs-button'}(
				h::{'button[type=submit]'}($L->save),
				[
					'tooltip' => $L->save_info
				]
			),
			[
				'action' => path($L->Photo_gallery).($images ? '/'.$Photo_gallery->get_gallery($images[0]['gallery'])['path'] : '')
			]
		)
	);
