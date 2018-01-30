// Generated by LiveScript 1.5.0
/**
 * @package  Content
 * @category modules
 * @author   Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @license  0BSD
 */
(function(){
  var html_to_node;
  html_to_node = function(html){
    var div;
    div = document.createElement('div');
    div.innerHTML = html;
    return div.firstChild;
  };
  cs.ui.ready.then(function(){
    var x$;
    x$ = document.querySelector('body');
    x$.addEventListener('click', function(e){
      if (!e.target.matches('.cs-content-add')) {
        return;
      }
      cs.Language('content_').ready().then(function(L){
        var modal_body, key, title, content, type;
        modal_body = html_to_node("<cs-form><form>\n	<label>" + L.key + "</label>\n	<cs-input-text><input type=\"text\" name=\"key\"></cs-input-text>\n	<label>" + L.title + "</label>\n	<cs-input-text><input type=\"text\" name=\"title\"></cs-input-text>\n	<label>" + L.content + "</label>\n	<cs-textarea autosize><textarea class=\"text cs-margin-bottom\"></textarea></cs-textarea>\n	<cs-editor class=\"html cs-margin-bottom\" hidden>\n		<cs-textarea autosize><textarea></textarea></cs-textarea>\n	</cs-editor>\n	<label>" + L.type + "</label>\n	<cs-select>\n		<select name=\"type\">\n			<option value=\"text\">text</option>\n			<option value=\"html\">html</option>\n		</select>\n	</cs-select>\n	<div>\n		<cs-button primary><button type=\"button\">" + L.save + "</button></cs-button>\n	</div>\n</form></cs-form>");
        key = modal_body.querySelector('[name=key]');
        title = modal_body.querySelector('[name=title]');
        content = modal_body.querySelector('.text');
        type = modal_body.querySelector('[name=type]');
        type.addEventListener('selected', function(){
          var text, html;
          if (this.value === 'text') {
            text = modal_body.querySelector('.text');
            text.value = content.value;
            content.hidden = true;
            content = text;
            content.hidden = false;
          } else {
            html = modal_body.querySelector('.html');
            html.value = content.value;
            html.querySelector('textarea').value = content.value;
            content.hidden = true;
            content = html;
            content.hidden = false;
          }
        });
        cs.ui.simple_modal(modal_body);
        modal_body.querySelector('button').addEventListener('click', function(){
          var data;
          data = {
            key: key.value,
            title: title.value,
            content: content.value,
            type: type.selected
          };
          cs.api('post api/Content', data).then(bind$(location, 'reload'));
        });
      });
    });
    x$.addEventListener('click', function(e){
      if (!e.target.matches('.cs-content-edit')) {
        return;
      }
      cs.Language('content_').ready().then(function(L){
        var key;
        key = e.target.dataset.key;
        cs.api("get api/Content/" + key).then(function(data){
          var modal_body, x$, title, y$, content, type;
          modal_body = html_to_node("<cs-form><form>\n	<label>" + L.key + "</label>\n	<cs-input-text><input readonly value=\"" + data.key + "\"></cs-input-text>\n	<label>" + L.title + "</label>\n	<cs-input-text><input type=\"text\" name=\"title\"></cs-input-text>\n	<label>" + L.content + "</label>\n	<cs-textarea autosize><textarea class=\"text cs-margin-bottom\"></textarea></cs-textarea>\n	<cs-editor class=\"html cs-margin-bottom\" hidden>\n		<cs-textarea autosize><textarea></textarea></cs-textarea>\n	</cs-editor>\n	<label>" + L.type + "</label>\n	<cs-select>\n		<select name=\"type\">\n			<option value=\"text\">text</option>\n			<option value=\"html\">html</option>\n		</select>\n	</cs-select>\n	<div>\n		<cs-button primary><button type=\"button\">" + L.save + "</button></cs-button>\n	</div>\n</form></cs-form>");
          x$ = title = modal_body.querySelector('[name=title]');
          x$.value = data.title;
          y$ = content = modal_body.querySelector('.text');
          y$.value = data.content;
          type = modal_body.querySelector('[name=type]');
          type.addEventListener('selected', function(){
            var text, html;
            if (this.value === 'text') {
              text = modal_body.querySelector('.text');
              text.value = content.value;
              content.hidden = true;
              content = text;
              content.hidden = false;
            } else {
              html = modal_body.querySelector('.html');
              html.value = content.value;
              html.querySelector('textarea').value = content.value;
              content.hidden = true;
              content = html;
              content.hidden = false;
            }
          });
          type.selected = data.type;
          cs.ui.simple_modal(modal_body);
          modal_body.querySelector('button').addEventListener('click', function(){
            var data;
            data = {
              title: title.value,
              content: content.value,
              type: type.selected
            };
            cs.api("put api/Content/" + key, data).then(bind$(location, 'reload'));
          });
        });
      });
    });
    x$.addEventListener('click', function(e){
      if (!e.target.matches('.cs-content-delete')) {
        return;
      }
      cs.Language('content_').ready().then(function(L){
        var key;
        key = e.target.dataset.key;
        cs.ui.confirm(L['delete'] + "?").then(function(){
          return cs.api("delete api/Content/" + key);
        }).then(bind$(location, 'reload'));
      });
    });
    (function(){
      var is_admin, mousemove_timeout, showed_button, show_edit_button, x$;
      is_admin = undefined;
      mousemove_timeout = 0;
      showed_button = false;
      show_edit_button = function(key, x, y, container){
        cs.Language('content_').ready().then(function(L){
          var button;
          button = html_to_node("<cs-button><button class=\"cs-content-edit\" data-key=\"" + key + "\" style=\"position: absolute; left: " + x + "; top: " + y + ";\">" + L.edit + "</button></cs-button>");
          container.appendChild(button);
          container.addEventListener('mouseleave', (function(){
            function callback(e){
              showed_button = false;
              button.parentNode.removeChild(button);
              e.currentTarget.removeEventListener(e.type, callback);
            }
            return callback;
          }()), {
            passive: true
          });
        });
      };
      x$ = document.querySelector('body');
      x$.addEventListener('mousemove', function(e){
        if (!e.target.matches('[data-cs-content]')) {
          return;
        }
        if (showed_button) {
          return;
        }
        clearTimeout(mousemove_timeout);
        mousemove_timeout = setTimeout(function(){
          showed_button = true;
          if (is_admin === undefined) {
            cs.api('is_admin api/Content').then(function(result){
              is_admin = result;
              if (is_admin) {
                show_edit_button(e.target.dataset.csContent, e.pageX, e.pageY, e.target);
              }
            })['catch'](function(o){
              if (o.xhr.status === 404) {
                clearTimeout(o.timeout);
                return Promise.reject();
              }
            });
            return;
          }
          if (is_admin) {
            show_edit_button(e.target.dataset.csContent, e.pageX, e.pageY, e.target);
          }
        }, 200);
      }, {
        passive: true
      });
    })();
  })['catch'](function(){});
  function bind$(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
  }
}).call(this);
