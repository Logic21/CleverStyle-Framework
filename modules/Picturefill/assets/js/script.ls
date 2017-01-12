/**
 * @package   Picturefill
 * @category  modules
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2015-2017, Nazar Mokrynskyi
 * @license   MIT License
 */
Polymer(
	is		: 'cs-picturefill-img'
	extends	: 'img'
	ready : !->
		picturefill(
			elements : [@]
		)
)
Polymer(
	is		: 'cs-picturefill-picture'
	extends	: 'picture'
	ready : !->
		picturefill(
			elements : [@querySelector('img')]
		)
)
