// Generated by CoffeeScript 1.4.0

/**
 * @package   Shop
 * @category  modules
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2014-2015, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
*/


(function() {

  Polymer({
    characteristics_text: cs.Language.shop_characteristics_text,
    ready: function() {
      var $this, attributes;
      this.header_title = this.querySelector('h1').innerHTML;
      $this = $(this);
      this.item_id = $this.data('id');
      this.price = sprintf(cs.shop.settings.price_formatting, $this.data('price'));
      this.in_stock = $this.data('in_stock');
      attributes = $(this.querySelector('#attributes'));
      if (attributes.length) {
        this.show_attributes = true;
        attributes.find('table').addClass('uk-table uk-table-hover').find('td:first-of-type').addClass('uk-text-bold');
      }
      return $(this.$.images).append($(this.querySelectorAll('#videos > a')).each(function() {
        $this = $(this);
        if ($this.children('img')) {
          return $this.attr('data-video', 'true');
        }
      })).append(this.querySelectorAll('#images > img')).fotorama({
        allowfullscreen: 'native',
        controlsonstart: false,
        fit: 'contain',
        keyboard: true,
        nav: 'thumbs',
        ratio: 4 / 3,
        trackpad: true,
        width: '100%'
      });
    }
  });

}).call(this);
