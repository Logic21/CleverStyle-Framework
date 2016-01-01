/**
 * @package   CleverStyle CMS
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2014-2015, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
 */
/**
 * Fix for jQuery "ready" event, trigger it after "WebComponentsReady" event triggered by WebComponents.js
 */
ready_original	= $.fn.ready
functions		= []
ready			= false
$.fn.ready		= (fn) ->
	functions.push(fn)
	return
document.addEventListener('WebComponentsReady', !function ready_callback
	if !ready
		document.removeEventListener('WebComponentsReady', ready_callback)
		# Since we may use some CSS variables and mixins, lets update styles to make sure we didn't skip any styles
		Polymer.updateStyles()
		ready		:= true
		$.fn.ready	= ready_original
		functions.forEach !-> it()
		functions	:= []
)
