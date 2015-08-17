###*
 * @package   Shop
 * @category  modules
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2014-2015, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
###
do (cart = cs.shop.cart, L = cs.Language) ->
	Polymer(
		'is'		: 'cs-shop-add-to-cart'
		behaviors	: [cs.Polymer.behaviors.Language]
		properties	:
			in_cart		: 0
		ready		: ->
			$this		= $(@)
			@set('item_id', $this.data('id'))
			@set('in_cart', cart.get(@item_id))
			UIkit.tooltip(
				@$.in_cart
				animation	: true
				delay		: 200
			)
		add			: ->
			@set('in_cart', cart.add(@item_id))
	);
