/**
 * @package   CleverStyle CMS
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2015, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
 */
L	= cs.Language
Polymer(
	'is'		: 'cs-system-sign-in-form'
	behaviors	: [cs.Polymer.behaviors.Language]
	attached : !->
		@$.login.focus()
	_sign_in : (e) !->
		e.preventDefault()
		cs.sign_in(@$.login.value, @$.password.value)
	_restore_password : !->
		cs.ui.simple_modal("<cs-system-restore-password-form/>")
)
