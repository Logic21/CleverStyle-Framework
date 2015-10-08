// Generated by LiveScript 1.4.0
/**
 * @package   CleverStyle CMS
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2015, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
 */
(function(){
  var L;
  L = cs.Language;
  Polymer({
    'is': 'cs-system-sign-in-form',
    behaviors: [cs.Polymer.behaviors.Language],
    attached: function(){
      this.$.login.focus();
    },
    _sign_in: function(e){
      e.preventDefault();
      cs.sign_in(this.$.login.value, this.$.password.value);
    },
    _restore_password: function(){
      cs.ui.simple_modal("<cs-system-restore-password-form/>");
    }
  });
}).call(this);
