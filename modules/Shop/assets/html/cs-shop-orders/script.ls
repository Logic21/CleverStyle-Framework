/**
 * @package   Shop
 * @category  modules
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2014-2017, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
 */
Polymer(
	is			: 'cs-shop-orders'
	behaviors	: [
		cs.Polymer.behaviors.Language('shop_')
	]
	ready : !->
		@$.orders.innerHTML	= @querySelector('#orders').innerHTML
)
