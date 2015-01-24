// Generated by CoffeeScript 1.4.0

/**
 * @package   WebSockets
 * @category  modules
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2015, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
*/


(function() {

  window.cs.WebSockets = (function() {
    var handlers, socket;
    socket = null;
    handlers = {};
    (function() {
      var connect, delay, keep_connection, onmessage, onopen;
      delay = 0;
      onopen = function() {
        delay = 1000;
        cs.WebSockets.send('Client/authentication', {
          session: cs.getcookie('session'),
          user_agent: navigator.userAgent
        });
      };
      onmessage = function(message) {
        var action, action_handlers, details, type, _ref, _ref1, _ref2;
        _ref = JSON.parse(message.data), action = _ref[0], details = _ref[1];
        _ref1 = action.split(':'), action = _ref1[0], type = _ref1[1];
        action_handlers = handlers[action];
        if (!action_handlers || !action_handlers.length) {
          return;
        }
        if ((_ref2 = typeof details) === 'boolean' || _ref2 === 'number' || _ref2 === 'string') {
          details = [details];
        }
        action_handlers.forEach(function(h) {
          if (type === 'error') {
            return h[1] && h[1].apply(h[1], details);
          } else {
            return h[0] && h[0].apply(h[0], details);
          }
        });
      };
      connect = function() {
        socket = new WebSocket((location.protocol === 'https:' ? 'wss' : 'ws') + ("://" + location.hostname + "/WebSockets"));
        socket.onopen = onopen;
        socket.onmessage = onmessage;
      };
      keep_connection = function() {
        return setTimeout((function() {
          var _ref;
          if (!socket || ((_ref = socket.readyState) === WebSocket.CLOSING || _ref === WebSocket.CLOSED)) {
            delay = (delay || 1000) * 2;
            connect();
          }
          return keep_connection();
        }), delay);
      };
      return keep_connection();
    })();
    return {
      'on': function(action, callback, error) {
        if (!handlers[action]) {
          handlers[action] = [];
        }
        handlers[action].push([callback, error]);
        return cs.WebSockets;
      },
      'off': function(action, callback, error) {
        var h, index, _i, _len, _ref;
        if (!handlers[action]) {
          return;
        }
        _ref = handlers[action];
        for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
          h = _ref[index];
          if (h[0] === callback) {
            h[0] = void 0;
          }
          if (h[1] === error) {
            h[1] = void 0;
          }
          if (h[0] === void 0 && h[1] === void 0) {
            delete handlers[action][index];
          }
        }
        return cs.WebSockets;
      },
      once: function(action, callback, error) {
        var callback_, error_;
        callback_ = function() {
          callback.apply(callback, arguments);
          return cs.WebSockets.off(action, callback_, error_);
        };
        error_ = function() {
          error.apply(error, arguments);
          return cs.WebSockets.off(action, callback_, error_);
        };
        cs.WebSockets.on(action, callback_, error_);
        return cs.WebSockets;
      },
      send: function(action, details) {
        socket.send(JSON.stringify([action, details]));
        return cs.WebSockets;
      }
    };
  })();

}).call(this);
