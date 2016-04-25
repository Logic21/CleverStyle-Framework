// Generated by LiveScript 1.4.0
/**
 * @package   CleverStyle CMS
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2011-2016, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
 */
(function(){
  var L, x$, slice$ = [].slice;
  L = cs.Language('system_profile_');
  /**
   * Supports algorithms sha1, sha224, sha256, sha384, sha512
   *
   * @param {object} jssha jsSHA object
   * @param {string} algo Chosen algorithm
   * @param {string} data String to be hashed
   * @return {string}
   */
  cs.hash = function(jssha, algo, data){
    var shaObj;
    algo = (function(){
      switch (algo) {
      case 'sha1':
        return 'SHA-1';
      case 'sha224':
        return 'SHA-224';
      case 'sha256':
        return 'SHA-256';
      case 'sha384':
        return 'SHA-384';
      case 'sha512':
        return 'SHA-512';
      default:
        return algo;
      }
    }());
    shaObj = new jssha(algo, 'TEXT');
    shaObj.update(data);
    return shaObj.getHash('HEX');
  };
  /**
   * Sign in into system
   *
   * @param {string} login
   * @param {string} password
   */
  cs.sign_in = function(login, password){
    login = String(login).toLowerCase();
    password = String(password);
    require(['jssha'], function(jssha){
      $.ajax({
        url: 'api/System/profile',
        data: {
          login: cs.hash(jssha, 'sha224', login),
          password: cs.hash(jssha, 'sha512', cs.hash(jssha, 'sha512', password) + cs.public_key)
        },
        type: 'sign_in',
        success: function(){
          location.reload();
        }
      });
    });
  };
  /**
   * Sign out
   */
  cs.sign_out = function(){
    $.ajax({
      url: 'api/System/profile',
      type: 'sign_out',
      success: function(){
        location.reload();
      }
    });
  };
  /**
   * Registration in the system
   *
   * @param {string} email
   */
  cs.registration = function(email){
    if (!email) {
      cs.ui.alert(L.registration_please_type_your_email);
      return;
    }
    email = String(email).toLowerCase();
    $.ajax({
      url: 'api/System/profile',
      data: {
        email: email
      },
      type: 'registration',
      success_201: function(){
        cs.ui.simple_modal('<div>' + L.registration_success + '</div>');
      },
      success_202: function(){
        cs.ui.simple_modal('<div>' + L.registration_confirmation + '</div>');
      }
    });
  };
  /**
   * Password restoring
   *
   * @param {string} email
   */
  cs.restore_password = function(email){
    if (!email) {
      cs.ui.alert(L.restore_password_please_type_your_email);
      return;
    }
    email = String(email).toLowerCase();
    require(['jssha'], function(jssha){
      $.ajax({
        url: 'api/System/profile',
        data: {
          email: cs.hash(jssha, 'sha224', email)
        },
        type: 'restore_password',
        success: function(result){
          if (result === 'OK') {
            cs.ui.simple_modal('<div>' + L.restore_password_confirmation + '</div>');
          }
        }
      });
    });
  };
  /**
   * Password changing
   *
   * @param {string} current_password
   * @param {string} new_password
   * @param {Function} success
   * @param {Function} error
   */
  cs.change_password = function(current_password, new_password, success, error){
    if (!current_password) {
      cs.ui.alert(L.please_type_current_password);
      return;
    } else if (!new_password) {
      cs.ui.alert(L.please_type_new_password);
      return;
    } else if (current_password === new_password) {
      cs.ui.alert(L.current_new_password_equal);
      return;
    } else if (String(new_password).length < cs.password_min_length) {
      cs.ui.alert(L.password_too_short);
      return;
    } else if (cs.password_check(new_password) < cs.password_min_strength) {
      cs.ui.alert(L.password_too_easy);
      return;
    }
    require(['jssha'], function(jssha){
      var current_password, new_password;
      current_password = cs.hash(jssha, 'sha512', cs.hash(jssha, 'sha512', String(current_password)) + cs.public_key);
      new_password = cs.hash(jssha, 'sha512', cs.hash(jssha, 'sha512', String(new_password)) + cs.public_key);
      $.ajax({
        url: 'api/System/profile',
        data: {
          current_password: current_password,
          new_password: new_password
        },
        type: 'change_password',
        success: function(result){
          if (success) {
            success();
          } else {
            cs.ui.alert(L.password_changed_successfully);
          }
        },
        error: error || $.ajaxSettings.error
      });
    });
  };
  /**
   * Check password strength
   *
   * @param	string	password
   * @param	int		min_length
   *
   * @return	int		In range [0..7]<br><br>
   * 					<b>0</b> - short password<br>
   * 					<b>1</b> - numbers<br>
   *  				<b>2</b> - numbers + letters<br>
   * 					<b>3</b> - numbers + letters in different registers<br>
   * 		 			<b>4</b> - numbers + letters in different registers + special symbol on usual keyboard +=/^ and others<br>
   * 					<b>5</b> - numbers + letters in different registers + special symbols (more than one)<br>
   * 					<b>6</b> - as 5, but + special symbol, which can't be found on usual keyboard or non-latin letter<br>
   * 					<b>7</b> - as 5, but + special symbols, which can't be found on usual keyboard or non-latin letter (more than one symbol)<br>
   */
  cs.password_check = function(password, min_length){
    var strength, matches;
    password = new String(password);
    min_length = min_length || 4;
    password = password.replace(/\s+/g, ' ');
    strength = 0;
    if (password.length >= min_length) {
      matches = password.match(/[~!@#\$%\^&\*\(\)\-_=+\|\\/;:,\.\?\[\]\{\}]/g);
      if (matches) {
        strength = 4;
        if (matches.length > 1) {
          ++strength;
        }
      } else {
        if (/[A-Z]+/.test(password)) {
          ++strength;
        }
        if (/[a-z]+/.test(password)) {
          ++strength;
        }
        if (/[0-9]+/.test(password)) {
          ++strength;
        }
      }
      matches = password.match(/[^0-9a-z~!@#\$%\^&\*\(\)\-_=+\|\\/;:,\.\?\[\]\{\}]/ig);
      if (matches) {
        ++strength;
        if (matches.length > 1) {
          ++strength;
        }
      }
    }
    return strength;
  };
  x$ = cs.ui || (cs.ui = {});
  /**
   * Modal dialog
   *
   * @param {HTMLElement}|{jQuery}|{String} content
      *
   * @return {HTMLElement}
   */
  x$.modal = function(content){
    var modal;
    modal = document.createElement('section', 'cs-section-modal');
    if (typeof content === 'string' || content instanceof Function) {
      modal.innerHTML = content;
    } else {
      if (content instanceof jQuery) {
        content.appendTo(modal);
      } else {
        modal.appendChild(content);
      }
    }
    document.documentElement.appendChild(modal);
    return modal;
  };
  /**
   * Simple modal dialog that will be opened automatically and destroyed after closing
   *
   * @param {HTMLElement}|{jQuery}|{String} content
      *
   * @return {HTMLElement}
   */
  x$.simple_modal = function(content){
    var x$;
    x$ = cs.ui.modal(content);
    x$.autoDestroy = true;
    x$.open();
    return x$;
  };
  /**
   * Alert modal
   *
   * @param {HTMLElement}|{jQuery}|{String} content
      *
   * @return {HTMLElement}
   */
  x$.alert = function(content){
    var x$, modal, y$, ok, z$;
    if (content instanceof Function) {
      content = content.toString();
    }
    if (typeof content === 'string' && content.indexOf('<') === -1) {
      content = "<h3>" + content + "</h3>";
    }
    x$ = modal = cs.ui.modal(content);
    x$.autoDestroy = true;
    x$.manualClose = true;
    y$ = ok = document.createElement('button', 'cs-button');
    y$.innerHTML = 'OK';
    y$.primary = true;
    y$.action = 'close';
    y$.bind = modal;
    z$ = modal;
    z$.ok = ok;
    z$.appendChild(ok);
    z$.open();
    ok.focus();
    return modal;
  };
  /**
   * Confirm modal
   *
   * @param {HTMLElement}|{jQuery}|{String} content
   * @param {Function}                      ok_callback
   * @param {Function}                      cancel_callback
      *
   * @return {HTMLElement}
   */
  x$.confirm = function(content, ok_callback, cancel_callback){
    var x$, modal, y$, ok, z$, cancel, z1$;
    if (content instanceof Function) {
      content = content.toString();
    }
    if (typeof content === 'string' && content.indexOf('<') === -1) {
      content = "<h3>" + content + "</h3>";
    }
    x$ = modal = cs.ui.modal(content);
    x$.autoDestroy = true;
    x$.manualClose = true;
    y$ = ok = document.createElement('button', 'cs-button');
    y$.innerHTML = 'OK';
    y$.primary = true;
    y$.action = 'close';
    y$.bind = modal;
    y$.addEventListener('click', ok_callback);
    z$ = cancel = document.createElement('button', 'cs-button');
    z$.innerHTML = L.system_admin_cancel;
    z$.action = 'close';
    z$.bind = modal;
    z$.addEventListener('click', cancel_callback || function(){});
    z1$ = modal;
    z1$.ok = ok;
    z1$.cancel = cancel;
    z1$.appendChild(ok);
    z1$.appendChild(cancel);
    z1$.open();
    ok.focus();
    return modal;
  };
  /**
   * Notify
   *
   * @param {HTMLElement}|{jQuery}|{String} content
      *
   * @return {HTMLElement}
   */
  x$.notify = function(content){
    var options, notify, i$, len$, option;
    options = slice$.call(arguments, 1);
    notify = document.createElement('cs-notify');
    if (typeof content === 'string' || content instanceof Function) {
      notify.innerHTML = content;
    } else {
      if (content instanceof jQuery) {
        content.appendTo(notify);
      } else {
        notify.appendChild(content);
      }
    }
    for (i$ = 0, len$ = options.length; i$ < len$; ++i$) {
      option = options[i$];
      switch (typeof option) {
      case 'string':
        notify[option] = true;
        break;
      case 'number':
        notify.timeout = option;
      }
    }
    document.documentElement.appendChild(notify);
    return notify;
  };
}).call(this);
