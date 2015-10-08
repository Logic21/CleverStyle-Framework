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
    'is': 'cs-system-restore-password-form',
    behaviors: [cs.Polymer.behaviors.Language],
    attached: function(){
      this.$.login.focus();
    },
    _restore_password: function(e){
      e.preventDefault();
      cs.restore_password(this.$.login.value);
    }
  });
}).call(this);
