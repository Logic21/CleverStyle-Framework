/**
 * @package CleverStyle Framework
 * @author  Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @license 0BSD
 */
###
 # Load configuration from special script elements
###
for config in document.head.querySelectorAll('.cs-config')
	target		= config.getAttribute('target').split('.')
	data		= JSON.parse(config.innerHTML)
	destination	= window
	for target_part, i in target
		if target_part != 'window'
			if !destination[target_part]
				destination[target_part]	= {}
			if i < target.length - 1
				destination	= destination[target_part]
			else
				if data instanceof Object && !(data instanceof Array)
					destination	= destination[target_part]
					for index, value of data
						destination[index]	= value
				else
					destination[target_part] = data
# Correct page URL to include language prefix if necessary (it is necessary if document.baseURI contains language prefix and document.URL doesn't)
if document.URL.indexOf(document.baseURI.substr(0, document.baseURI.length - 1)) != 0
	url_lang = document.baseURI.split('/')[3]
	new_url = location.href.split('/')
	new_url.splice(
		3
		if !new_url[3] then 1 else 0
		url_lang
	)
	new_url = new_url.join('/')
	history.replaceState({}, document.title, new_url)
