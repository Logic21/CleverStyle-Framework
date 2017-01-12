// Generated by LiveScript 1.4.0
/**
 * @package   CleverStyle Framework
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2015-2017, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
 */
(function(){
  Polymer({
    is: 'cs-system-change-password',
    behaviors: [cs.Polymer.behaviors.Language('system_profile_')],
    attached: function(){
      this.$.current_password.focus();
    },
    _change_password: function(e){
      e.preventDefault();
      cs.change_password(this.$.current_password.value, this.$.new_password.value);
    },
    _show_password: function(e){
      var lock, password;
      lock = e.currentTarget;
      password = lock.previousElementSibling;
      if (password.type === 'password') {
        password.type = 'text';
        return lock.icon = 'unlock';
      } else {
        password.type = 'password';
        return lock.icon = 'lock';
      }
    }
  });
}).call(this);
