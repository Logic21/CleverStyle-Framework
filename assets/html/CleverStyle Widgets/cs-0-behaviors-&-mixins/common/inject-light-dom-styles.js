// Generated by LiveScript 1.5.0
/**
 * @package   CleverStyle Widgets
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @license   0BSD
 */
(function(){
  var ready, styles;
  ready = new Promise(function(resolve){
    var callback;
    if (document.readyState !== 'complete') {
      callback = function(){
        setTimeout(resolve);
        document.removeEventListener('WebComponentsReady', callback);
      };
      document.addEventListener('WebComponentsReady', callback);
    } else {
      setTimeout(resolve);
    }
  });
  styles = {};
  csw.behaviors.injectLightStyles = [{
    attached: function(){
      var head, custom_style_element, this$ = this;
      if (this._styles_dom_module_added) {
        return;
      }
      this._styles_dom_module_added = true;
      if (!styles[this._styles_dom_module]) {
        head = document.querySelector('head');
        head.insertAdjacentHTML('beforeend', "<custom-style><style include=\"" + this._styles_dom_module + "\"></style></custom-style>");
        custom_style_element = head.lastElementChild;
        ready.then(function(){
          Polymer.updateStyles();
          styles[this$._styles_dom_module] = custom_style_element.firstElementChild.textContent.split(':not(.style-scope)').join('');
          head.removeChild(custom_style_element);
          this$.insertAdjacentHTML('beforeend', "<style>" + styles[this$._styles_dom_module] + "</style>");
        });
      } else {
        this.insertAdjacentHTML('beforeend', "<style>" + styles[this._styles_dom_module] + "</style>");
      }
    }
  }];
}).call(this);
