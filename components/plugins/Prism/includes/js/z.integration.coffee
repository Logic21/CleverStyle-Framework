###*
 * @package		Prism
 * @author		Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright	Copyright (c) 2015, Nazar Mokrynskyi
 * @license		MIT License, see license.txt
###
document.removeEventListener('DOMContentLoaded', Prism.highlightAll)
Prism.highlightAll = (async, callback) ->
	elements = document.querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code')
	for element in elements
		if element.matches('[contenteditable=true] *') || element.matches('.INLINE_EDITOR *')
			continue
		element.classList.add('line-numbers')
		element.parentNode.classList.add('prism-allow-modification')
		Prism.highlightElement(element, async == true, callback);
document.addEventListener('DOMContentLoaded', Prism.highlightAll)
