// Единая точка отправки событий. Имя, адрес и комментарий не передаются.
const Analytics = (() => {
  const C = window.CONFIG, queue = [];
  const configured = !!(C.amplitudeKey || C.ga4Id);
  let state = null;
  try { state = localStorage.getItem('consent'); } catch (e) {}
  const GA = { restaurant_list_viewed: 'view_item_list', item_added: 'add_to_cart', item_removed: 'remove_from_cart',
    cart_viewed: 'view_cart', checkout_started: 'begin_checkout', order_completed: 'purchase' };
  let loaded = false;
  function script(src, onload) {
    const s = document.createElement('script'); s.src = src; s.async = true; s.onload = onload; document.head.appendChild(s);
  }
  function send(name, p) {
    if (C.amplitudeKey && window.amplitude && window.amplitude.track) window.amplitude.track(name, p);
    if (C.ga4Id && window.gtag) window.gtag('event', GA[name] || name, p);
  }
  function load() {
    if (loaded) return; loaded = true;
    if (C.ga4Id) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date()); window.gtag('config', C.ga4Id);
      script('https://www.googletagmanager.com/gtag/js?id=' + C.ga4Id);
    }
    if (C.amplitudeKey) {
      const host = C.amplitudeEU ? 'cdn.eu.amplitude.com' : 'cdn.amplitude.com';
      script('https://' + host + '/script/' + C.amplitudeKey + '.js', () => {
        if (window.sessionReplay) window.amplitude.add(window.sessionReplay.plugin({ sampleRate: 1 }));
        window.amplitude.init(C.amplitudeKey, { serverZone: C.amplitudeEU ? 'EU' : 'US', autocapture: { elementInteractions: false } });
        queue.splice(0).forEach(([n, p]) => window.amplitude.track(n, p));
      });
    }
  }
  function track(name, props = {}) {
    if (location.search.includes('debug')) console.log('event', name, JSON.stringify(props));
    if (state !== 'yes') return;
    if (C.amplitudeKey && !(window.amplitude && window.amplitude.track)) queue.push([name, props]);
    send(name, props);
  }
  function banner(onAccept) {
    if (!configured) return;
    if (state === 'yes') return load();
    if (state === 'no') return;
    const el = document.getElementById('consent');
    el.innerHTML = '<p>Это учебный проект. Разрешить аналитику и запись действий на сайте?</p><div><button data-a="no">Нет</button><button data-a="yes">Разрешить</button></div>';
    el.hidden = false;
    el.onclick = e => {
      const a = e.target.dataset.a; if (!a) return;
      state = a; try { localStorage.setItem('consent', a); } catch (x) {}
      el.hidden = true; if (a === 'yes') { load(); onAccept(); }
    };
  }
  return { track, banner };
})();
