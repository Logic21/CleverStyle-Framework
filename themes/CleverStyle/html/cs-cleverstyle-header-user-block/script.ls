/**
 * @package    CleverStyle Framework
 * @subpackage CleverStyle theme
 * @author     Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @license    0BSD
 */
Polymer(
	is			: 'cs-cleverstyle-header-user-block'
	behaviors	: [
		cs.Polymer.behaviors.Language('system_profile_')
	]
	properties	:
		avatar		: String
		guest		: false
		username	: String
	_sign_in : !->
		cs.ui.simple_modal("<cs-system-sign-in/>")
	_registration : !->
		cs.ui.simple_modal("<cs-system-registration/>")
	_sign_out : cs.sign_out
	_change_password : !->
		cs.ui.simple_modal("<cs-system-change-password/>")
	_general_settings : !->
		cs.ui.simple_modal("<cs-system-user-settings/>")
)
