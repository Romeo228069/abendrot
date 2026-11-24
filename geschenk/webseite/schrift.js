// Schriftgroessen-Umschaltung, gemerkt im Geraet
(function(){
  'use strict';
  var grad = null;
  try { grad = localStorage.getItem('fa-schrift'); } catch(e){}
  if (grad) document.documentElement.setAttribute('data-schrift', grad);
  document.addEventListener('click', function(e){
    var b = e.target.closest('[data-schrift-wahl]');
    if (!b) return;
    var wert = b.getAttribute('data-schrift-wahl');
    document.documentElement.setAttribute('data-schrift', wert);
    try { localStorage.setItem('fa-schrift', wert); } catch(e){}
    document.querySelectorAll('[data-schrift-wahl]').forEach(function(x){
      x.classList.toggle('aktiv', x === b);
    });
  });
  var aktuell = document.querySelector('[data-schrift-wahl="' + (grad || 'normal') + '"]');
  if (aktuell) aktuell.classList.add('aktiv');
})();
