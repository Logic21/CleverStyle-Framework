// Generated by LiveScript 1.5.0
/**
 * @package CleverStyle Widgets
 * @author  Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @license 0BSD
 */
(function(){
  csw.behaviors.tight = {
    properties: {
      tight: Boolean
    },
    ready: function(){
      if (this.tight && (this != null ? this.nextSibling.nodeType : void 8) === Node.TEXT_NODE) {
        this.nextSibling.parentNode.removeChild(this.nextSibling);
      }
    }
  };
}).call(this);
