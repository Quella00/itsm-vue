var console = console || {
    log : function(){
        return false;
    }
};

(function (d) {
  if (navigator.userAgent.indexOf('MSIE 9') === -1) return;

  d.addEventListener('selectionchange', function() {
    var el = d.activeElement;

    if (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && (el.type === 'text' || el.type === 'password') )) {
      var ev = d.createEvent('CustomEvent');
      ev.initCustomEvent('input', true, true, {});
      el.dispatchEvent(ev);
    }
  });
})(document);