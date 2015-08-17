###*
 * @package   Shop
 * @category  modules
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2014-2015, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
###
Polymer(
	'is'		: 'cs-shop-category-item'
	'extends'	: 'article'
	properties	:
		href		: String
		price		: String
		item_id		: Number
		in_stock	: String
	ready		: ->
		@$.img.innerHTML	= @querySelector('#img').outerHTML
		@set('href', @querySelector('#link').href)
		@set('price', sprintf(cs.shop.settings.price_formatting, @price))
);
