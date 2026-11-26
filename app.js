const app = document.getElementById('app');
const dishes = Object.fromEntries(RESTAURANTS.flatMap(r => r.dishes.map(d => [d.id, { ...d, restaurant: r.id }])));
let store = { cart: {}, order: null };
try { store = JSON.parse(sessionStorage.getItem('store')) || store; } catch (e) {}
const save = () => { try { sessionStorage.setItem('store', JSON.stringify(store)); } catch (e) {} };
let category = 'Все', query = '';

const count = () => Object.values(store.cart).reduce((a, b) => a + b, 0);
const subtotal = () => Object.entries(store.cart).reduce((a, [id, n]) => a + dishes[id].price * n, 0);
const cartRestaurant = () => { const id = Object.keys(store.cart)[0]; return id ? dishes[id].restaurant : null; };
const img = (key, cls, alt) => `<span class="ph ${cls}"><img src="${photo(PHOTOS[key].file)}" alt="${alt}" onerror="this.remove()"></span>`;
const head = (back, title) => `<header class="bar"><a class="back" href="${back}" aria-label="Назад">←</a><h1>${title}</h1></header>`;
const cta = (href, label, sum) => `<footer class="cta"><a href="${href}"><span>${label}</span><span>${sum}</span></a></footer>`;
const nav = () => `<nav><a class="on" href="#/">Рестораны</a><a href="#/cart">Корзина${count() ? ' · ' + count() : ''}</a><a href="#/credits">О проекте</a></nav>`;

function cards() {
  const q = query.trim().toLowerCase();
  const list = RESTAURANTS.filter(r => (category === 'Все' || r.category === category) &&
    (!q || [r.name, r.kitchen, ...r.dishes.map(d => d.name)].join(' ').toLowerCase().includes(q)));
  return list.map(r => `<a class="card rest" href="#/r/${r.id}">${img(r.photo, 'wide', r.name)}<div><b>${r.name}</b><small>${r.kitchen}</small><div class="line sep"><span>Доставка ${r.time}</span><strong>от ${Math.min(...r.dishes.map(d => d.price))} €</strong></div></div></a>`).join('')
    || '<p class="empty">Ничего не нашлось. Измените запрос или категорию.</p>';
}
function feed() {
  app.innerHTML = `<header class="top"><div class="line"><h1>Доставка еды</h1><span>Via Roma, 1</span></div><input id="q" type="search" aria-label="Поиск" placeholder="Блюдо или ресторан"></header>
  <div class="chips">${['Все', 'Италия', 'Япония', 'Боулы'].map(c => `<button data-cat="${c}" class="${c === category ? 'on' : ''}">${c}</button>`).join('')}</div>
  <main id="list">${cards()}</main>${nav()}`;
  const q = document.getElementById('q'); q.value = query;
  q.oninput = () => { query = q.value; document.getElementById('list').innerHTML = cards(); };
  q.onchange = () => { if (query) Analytics.track('search_used', { results: document.querySelectorAll('.rest').length }); };
}
const stepper = (id) => `<div class="step"><button data-remove="${id}" aria-label="Убрать: ${dishes[id].name}">−</button><span>${store.cart[id]}</span><button data-add="${id}" aria-label="Добавить: ${dishes[id].name}">+</button></div>`;
function menu(r) {
  app.innerHTML = head('#/', r.name) + img(r.photo, 'hero', r.name) +
    `<main><small>${r.kitchen} · ${r.time}</small>${r.dishes.map(d => `<div class="card dish">${img(d.photo, 'thumb', d.name)}<div class="info"><b>${d.name}</b><small>${d.desc}</small><strong>${d.price} €</strong></div>${store.cart[d.id] ? stepper(d.id) : `<button class="plus" data-add="${d.id}" aria-label="Добавить: ${d.name}">+</button>`}</div>`).join('')}</main>` +
    (count() ? cta('#/cart', 'Корзина · ' + count(), subtotal() + ' €') : '');
}
const totals = () => `<div class="card totals"><div class="line"><span>Блюда</span><span>${subtotal()} €</span></div><div class="line"><span>Доставка</span><span>${DELIVERY} €</span></div><div class="line total"><span>Итого</span><span>${subtotal() + DELIVERY} €</span></div></div>`;
function cart() {
  if (!count()) { app.innerHTML = head('#/', 'Корзина') + '<main><p class="empty">Корзина пуста.</p></main>' + cta('#/', 'К ресторанам', ''); return; }
  app.innerHTML = head('#/r/' + cartRestaurant(), 'Корзина') + `<main><div class="card">${Object.keys(store.cart).map(id => `<div class="row">${img(dishes[id].photo, 'mini', '')}<div class="info"><b>${dishes[id].name}</b><span>${dishes[id].price} €</span></div>${stepper(id)}</div>`).join('')}</div>${totals()}</main>` + cta('#/checkout', 'Оформить заказ', subtotal() + DELIVERY + ' €');
}
function checkout() {
  if (!count()) return location.replace('#/cart');
  const sum = subtotal() + DELIVERY;
  app.innerHTML = head('#/cart', 'Оформление') + `<form id="order" class="amp-mask"><main>
  <div class="card fields"><label>Адрес<input name="address" required autocomplete="off" placeholder="Можно вымышленный"></label><label>Имя<input name="name" required autocomplete="off" placeholder="Как к вам обращаться"></label><label>Комментарий курьеру<input name="note" autocomplete="off" placeholder="Этаж, домофон"></label></div>
  <div class="card fields"><h2>Оплата</h2><label class="radio"><input type="radio" name="pay" value="card" checked>Карта (демо)</label><label class="radio"><input type="radio" name="pay" value="cash">Наличными курьеру</label><small>Учебный проект: деньги не списываются, настоящие данные не нужны.</small></div></main>
  <footer class="cta"><button type="submit"><span>Заказать</span><span>${sum} €</span></button></footer></form>`;
  const f = document.getElementById('order');
  f.onsubmit = e => {
    e.preventDefault();
    const r = RESTAURANTS.find(x => x.id === cartRestaurant());
    store.order = { restaurant: r.name, time: r.time, sum };
    Analytics.track('order_completed', { transaction_id: String(Date.now()), restaurant_id: r.id, items_count: count(), value: sum, currency: 'EUR', delivery_fee: DELIVERY, payment_method: new FormData(f).get('pay') });
    store.cart = {}; save(); location.hash = '#/done';
  };
}
function done() {
  const o = store.order; if (!o) return location.replace('#/');
  app.innerHTML = `<header class="done"><h1>Заказ принят</h1><p>${o.restaurant} · доставка ${o.time}</p></header><main><ol class="card status"><li class="on">Принят</li><li>Готовится</li><li>В пути</li><li>Доставлен</li></ol><div class="card line"><span>Сумма</span><strong>${o.sum} €</strong></div><small>Это демонстрация: еда не приедет.</small></main>` + cta('#/', 'К ресторанам', '');
}
function credits() {
  app.innerHTML = head('#/', 'О проекте') + `<main><p>Учебный проект по продуктовой аналитике. Рестораны, цены и заказы вымышленные.</p><h2>Фото (Wikimedia Commons)</h2>${Object.values(PHOTOS).map(p => `<p class="card"><a href="https://commons.wikimedia.org/wiki/File:${encodeURIComponent(p.file)}">${p.file}</a><br><small>${p.author} · ${p.license} · при показе обрезано по размеру блока</small></p>`).join('')}</main>`;
}
function view() {
  const [, page, id] = location.hash.split('/');
  const r = RESTAURANTS.find(x => x.id === id);
  if (page === 'r' && r) menu(r); else if (page === 'cart') cart(); else if (page === 'checkout') checkout();
  else if (page === 'done') done(); else if (page === 'credits') credits(); else feed();
}
function trackView() {
  const [, page, id] = location.hash.split('/');
  const base = { items_count: count(), value: subtotal(), currency: 'EUR' };
  if (!page) Analytics.track('restaurant_list_viewed');
  else if (page === 'r') Analytics.track('restaurant_opened', { restaurant_id: id });
  else if (page === 'cart') Analytics.track('cart_viewed', { ...base, delivery_fee: DELIVERY });
  else if (page === 'checkout' && count()) Analytics.track('checkout_started', base);
}
app.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  const { add, remove, cat } = b.dataset;
  if (cat) { category = cat; Analytics.track('category_selected', { category: cat }); return feed(); }
  const id = add || remove; if (!id) return;
  const d = dishes[id];
  if (add) {
    if (cartRestaurant() && cartRestaurant() !== d.restaurant) {
      if (!window.confirm('В корзине блюда другого ресторана. Очистить корзину?')) return;
      store.cart = {};
    }
    store.cart[id] = (store.cart[id] || 0) + 1;
  } else if (--store.cart[id] <= 0) delete store.cart[id];
  Analytics.track(add ? 'item_added' : 'item_removed', { item_id: id, restaurant_id: d.restaurant, price: d.price, currency: 'EUR' });
  const y = document.querySelector('main')?.scrollTop || 0;
  save(); view();
  const m = document.querySelector('main'); if (m) m.scrollTop = y;
});
window.addEventListener('hashchange', () => { view(); trackView(); });
view();
const start = () => { Analytics.track('app_opened'); trackView(); };
Analytics.banner(start); // для уже давших согласие загружает аналитику
start();           // без согласия ничего не отправляется
