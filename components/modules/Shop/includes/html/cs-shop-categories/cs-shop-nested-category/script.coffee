###*
 * @package       Shop
 * @order_status  modules
 * @author        Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright     Copyright (c) 2014, Nazar Mokrynskyi
 * @license       MIT License, see license.txt
###
Polymer(
	ready : ->
		$(@$.img).prepend(@querySelector('#img').outerHTML)
		@href	= @querySelector('#link').href
		@title	= @querySelector('#link').innerText
);
