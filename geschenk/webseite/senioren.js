// Seniorenfassung: Schriftgroessen-Menue, Vorlesen. Laeuft nach schrift.js.
(function(){
  'use strict';

  // Schriftgroesse: aktiven Knopf markieren, Menue schliessen bei Klick daneben oder Escape
  function markiere(){
    var g = document.documentElement.getAttribute('data-schrift') || 'normal';
    document.querySelectorAll('[data-schrift-wahl]').forEach(function(b){
      var an = b.getAttribute('data-schrift-wahl') === g;
      b.classList.toggle('aktiv', an);
      b.setAttribute('aria-pressed', an ? 'true' : 'false');
    });
  }
  markiere();
  document.addEventListener('click', function(e){
    if (e.target.closest('[data-schrift-wahl]')) setTimeout(markiere, 0);
    document.querySelectorAll('details.schriftmenue[open]').forEach(function(d){
      if (!d.contains(e.target)) d.removeAttribute('open');
    });
  });
  document.addEventListener('keydown', function(e){
    if (e.key !== 'Escape') return;
    document.querySelectorAll('details.schriftmenue[open]').forEach(function(d){
      d.removeAttribute('open');
      d.querySelector('summary').focus();
    });
  });

  // Vorlesen: Absatz fuer Absatz, der gelesene Absatz wird markiert
  var synth = window.speechSynthesis;
  if (!synth || !window.SpeechSynthesisUtterance) return;
  var ruhig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-vorlesen]').forEach(function(knopf){
    var label = knopf.querySelector('.label');
    var start = label.textContent;
    var laeuft = false, aktiv = null;
    knopf.hidden = false;

    function stopp(){
      laeuft = false;
      synth.cancel();
      if (aktiv) aktiv.classList.remove('wird-gelesen');
      aktiv = null;
      label.textContent = start;
      knopf.setAttribute('aria-pressed', 'false');
    }

    knopf.addEventListener('click', function(){
      if (laeuft) { stopp(); return; }
      var teile = Array.prototype.filter.call(
        document.querySelectorAll(knopf.getAttribute('data-vorlesen')),
        function(el){ return el.textContent.trim().length > 1 && el.offsetParent !== null; });
      var stimme = null;
      synth.getVoices().forEach(function(v){ if (!stimme && /^de/i.test(v.lang)) stimme = v; });
      synth.cancel();
      laeuft = true;
      label.textContent = 'Vorlesen anhalten';
      knopf.setAttribute('aria-pressed', 'true');
      var i = 0;
      (function weiter(){
        if (!laeuft) return;
        if (aktiv) aktiv.classList.remove('wird-gelesen');
        if (i >= teile.length) { stopp(); return; }
        aktiv = teile[i++];
        aktiv.classList.add('wird-gelesen');
        aktiv.scrollIntoView({block:'nearest', behavior: ruhig ? 'auto' : 'smooth'});
        var u = new SpeechSynthesisUtterance(aktiv.textContent.replace(/\s+/g, ' ').trim());
        u.lang = 'de-DE';
        if (stimme) u.voice = stimme;
        u.rate = 0.92;
        u.onend = weiter;
        u.onerror = function(){ if (laeuft) weiter(); };
        synth.speak(u);
      })();
    });
    window.addEventListener('pagehide', stopp);
  });
})();
