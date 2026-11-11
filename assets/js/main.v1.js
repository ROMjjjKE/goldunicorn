
(function(){
  'use strict';
  /* ---------- меню ---------- */
  var burger=document.getElementById('burger'), drawer=document.getElementById('drawer'), closeBtn=document.getElementById('drawerClose');
  function openD(){ if(!drawer) return; drawer.hidden=false; document.body.classList.add('is-locked'); if(burger) burger.setAttribute('aria-expanded','true'); closeBtn && closeBtn.focus(); }
  function closeD(){ if(!drawer) return; drawer.hidden=true; document.body.classList.remove('is-locked'); if(burger){burger.setAttribute('aria-expanded','false'); burger.focus();} }
  if(burger) burger.addEventListener('click', openD);
  if(closeBtn) closeBtn.addEventListener('click', closeD);
  if(drawer){
    drawer.addEventListener('click', function(e){ if(e.target===drawer) closeD(); });
    drawer.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeD); });
  }
  document.addEventListener('keydown', function(e){
    if(e.key==='Escape' && drawer && !drawer.hidden) closeD();
    if(e.key==='Tab' && drawer && !drawer.hidden){
      var f=drawer.querySelectorAll('a,button'), first=f[0], last=f[f.length-1];
      if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
    }
  });
  window.addEventListener('resize', function(){ if(window.innerWidth>1024 && drawer && !drawer.hidden) closeD(); });
  /* ---------- шапка при скролле ---------- */
  var top=document.querySelector('.top');
  window.addEventListener('scroll', function(){ if(top) top.style.boxShadow = window.scrollY>10 ? '0 1px 0 rgba(36,28,24,.14), 0 8px 24px rgba(36,28,24,.06)' : 'none'; }, {passive:true});

  /* ---------- конфигуратор ---------- */
  var EL={
    seats:{name:'Сиденья',work:'Полный комплект или отдельное сиденье',term:'5–7 дней',
      note:'Снимаем, разбираем, меняем поролон при необходимости, кроим и шьём новые обивки по лекалам заводского сиденья.'},
    wheel:{name:'Руль',work:'Обод и спицы, шов вручную',term:'1–2 дня',
      note:'Обтяжка с утолщением обода, шов вручную, метки под подогрев и кнопки сохраняются.'},
    ceiling:{name:'Потолок',work:'Полотно, стойки, козырьки',term:'1–2 дня',
      note:'Клеим на подготовленное основание, без пузырей и провисаний; стойки и козырьки в тот же материал.'},
    dash:{name:'Панель и пластик',work:'Обтяжка или покраска',term:'2–4 дня',
      note:'Пластик можно покрасить или обтянуть. Красим с полной разборкой и подготовкой поверхности.'},
    armrest:{name:'Подлокотник',work:'С крышкой или без',term:'1 день',
      note:'Крышка обтягивается отдельно, чтобы открывалась без задиров по шву.'},
    knob:{name:'КПП и ручник',work:'Рычаг, чехол, пыльник',term:'1 день',
      note:'Чехол КПП шьётся по месту, пыльник не мешает ходам рычага.'}
  };
  var MATS=['Натуральная кожа','Экокожа','Алькантара','Ткань'];
  var COLS=[['Чёрный','#1E1B1A'],['Графит','#4A4C4E'],['Бежевый','#C6B29A'],['Карамель','#A9713D'],['Бордо','#6E1F2A'],['Тёмно-синий','#22314B']];

  function lum(hex){
    var c=hex.replace('#','').match(/../g).map(function(h){return parseInt(h,16)/255;}).map(function(v){return v<=0.03928? v/12.92 : Math.pow((v+0.055)/1.055,2.4);});
    return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2];
  }
  function shapes(id,c){
    var st = lum(c)>0.35 ? 'rgba(30,20,16,.55)' : 'rgba(255,255,255,.55)';
    var dash='stroke="'+st+'" stroke-width="2" stroke-dasharray="7 6" fill="none"';
    if(id==='seats') return '<g><rect x="52" y="26" width="216" height="150" rx="28" fill="'+c+'"/><rect x="118" y="44" width="84" height="112" rx="16" '+dash+'/><rect x="30" y="196" width="260" height="92" rx="26" fill="'+c+'"/><path d="M52 238h216" '+dash+'/><path d="M78 26v150M242 26v150" stroke="rgba(255,255,255,.18)" stroke-width="3" fill="none"/></g>';
    if(id==='wheel') return '<g><circle cx="160" cy="150" r="104" fill="none" stroke="'+c+'" stroke-width="40"/><circle cx="160" cy="150" r="104" fill="none" stroke="'+st+'" stroke-width="1.6" stroke-dasharray="7 7"/><path d="M160 150V58M160 150l-76 44M160 150l76 44" stroke="'+c+'" stroke-width="26" stroke-linecap="round"/><circle cx="160" cy="150" r="34" fill="'+c+'"/><circle cx="160" cy="150" r="22" fill="none" stroke="'+st+'" stroke-width="1.6" stroke-dasharray="5 5"/></g>';
    if(id==='ceiling') return '<g><path d="M22 232Q160 78 298 232Z" fill="'+c+'"/><path d="M58 232Q160 108 262 232" '+dash+'/><path d="M146 116v116M96 132v100M226 132v100" stroke="rgba(255,255,255,.16)" stroke-width="2" fill="none"/></g>';
    if(id==='dash') return '<g><path d="M34 216v-84q0-26 26-30l200-26q26-4 26 22v118Z" fill="'+c+'"/><path d="M52 176h56a18 18 0 0 1 0 0" '+dash+'/><path d="M52 150h216" '+dash+'/><rect x="176" y="176" width="86" height="26" rx="6" fill="rgba(255,255,255,.14)"/></g>';
    if(id==='armrest') return '<g><rect x="62" y="110" width="196" height="86" rx="24" fill="'+c+'"/><path d="M78 132h164" '+dash+'/><path d="M78 174h164" '+dash+'/><rect x="86" y="196" width="148" height="26" rx="8" fill="rgba(255,255,255,.16)"/></g>';
    return '<g><rect x="128" y="42" width="64" height="96" rx="28" fill="'+c+'"/><path d="M138 62h44" '+dash+'/><path d="M108 150q52-22 104 0l26 118H82Z" fill="'+c+'" opacity=".92"/><path d="M112 176q48-16 96 0" '+dash+'/></g>';
  }
  var st={el:'seats',mat:'Натуральная кожа',col:2};
  function render(){
    var svg=document.getElementById('cfgSvg'); if(!svg) return;
    var c=COLS[st.col][1];
    svg.innerHTML='<rect width="320" height="320" fill="#1C1512" opacity="0"/>'+shapes(st.el,c);
    var e=EL[st.el];
    var o={name:document.getElementById('cfgName'),work:document.getElementById('cfgWork'),term:document.getElementById('cfgTerm'),note:document.getElementById('cfgNote')};
    if(o.name) o.name.textContent=e.name+' · '+COLS[st.col][0].toLowerCase();
    if(o.work) o.work.textContent=e.work;
    if(o.term) o.term.textContent=e.term;
    if(o.note) o.note.textContent=e.note+(st.mat==='Ткань'?' Ткань берём для ретро-салонов: она не тянется так, как кожа, и рисунок подбираем отдельно.':'');
    var w=document.getElementById('cfgMat'); if(w) w.textContent=st.mat;
  }
  document.querySelectorAll('[data-el]').forEach(function(b){
    b.addEventListener('click', function(){ st.el=b.getAttribute('data-el'); document.querySelectorAll('[data-el]').forEach(function(x){x.setAttribute('aria-pressed','false');}); b.setAttribute('aria-pressed','true'); render(); });
  });
  document.querySelectorAll('[data-mat]').forEach(function(b){
    b.addEventListener('click', function(){ st.mat=b.getAttribute('data-mat'); document.querySelectorAll('[data-mat]').forEach(function(x){x.setAttribute('aria-pressed','false');}); b.setAttribute('aria-pressed','true'); render(); });
  });
  document.querySelectorAll('[data-col]').forEach(function(b){
    b.addEventListener('click', function(){ st.col=+b.getAttribute('data-col'); document.querySelectorAll('[data-col]').forEach(function(x){x.setAttribute('aria-pressed','false');}); b.setAttribute('aria-pressed','true'); render(); });
  });
  render();

  /* ---------- вердикт ---------- */
  var V={
    poter:{tag:'Можно покрасить',ok:true,head:'Потёртость и выгоревший цвет',text:'Кожа целая, поэтому перетяжка не нужна: красим с подготовкой и закреплением. Это дешевле полной перетяжки и сохраняет заводские лекала.',
      list:['Обезжиривание и матирование поверхности','Тонировка в нужный цвет, при желании другой','Закрепляющий состав, сушка 24 часа','Срок: 2–3 дня на салон, сиденья можно снять']},
    tres:{tag:'Покраска с реставрацией',ok:true,head:'Трещины, но материал целый',text:'Трещины шпатлюются эластичной массой под цвет, потом красится весь элемент. Держится хорошо, если трещина не на сгибе с постоянной нагрузкой.',
      list:['Оценка глубины трещин под нагрузкой','Эластичная шпатлёвка и матирование','Покраска элемента целиком, а не пятном','Срок: 2–4 дня']},
    razryv:{tag:'Локальный ремонт',ok:false,head:'Разрыв, дыра, разошёлся шов',text:'Краской это не лечится. Ставим вставку из кожи в цвет или перешиваем участок, при больших повреждениях меняется обивка элемента.',
      list:['Подбор кожи по фактуре и цвету','Вставка или перешив шва','Проверка натяжения после ремонта','Срок: 1–3 дня']},
    porolon:{tag:'Нужна перетяжка',ok:false,head:'Поролон просел, сиденье провалилось',text:'Пока не восстановлен поролон, любая обивка снова провиснет. Сначала меняем наполнитель и каркас, потом обтягиваем.',
      list:['Разборка сиденья, осмотр каркаса','Замена поролона и усилителей','Новая обивка по лекалам','Срок: 5–7 дней']},
    cveta:{tag:'Покраска или перетяжка',ok:true,head:'Хочу другой цвет салона',text:'Если кожа целая, полная перекраска салона дешевле перетяжки и занимает меньше времени. Если материал уставший, честнее перетянуть.',
      list:['Осмотр состояния всех элементов','Перекраска: 3–5 дней, салон целиком','Перетяжка: 7–10 дней, новый материал','Решение принимаем после осмотра']},
    plastik:{tag:'Покраска пластика',ok:true,head:'Поцарапан и выцвел пластик',text:'Пластик красится после полной разборки: иначе краска ляжет на пыль и начнёт облазить по кромкам.',
      list:['Разборка панели и накладок','Грунт для пластика, покраска','Сборка без следов и зазоров','Срок: 2–4 дня']}
  };
  document.querySelectorAll('[data-v]').forEach(function(b){
    b.addEventListener('click', function(){
      var d=V[b.getAttribute('data-v')], box=document.getElementById('verdict');
      if(!box) return;
      box.innerHTML='<span class="verdict__tag'+(d.ok?' verdict__tag--ok':'')+'">'+d.tag+'</span><h3>'+d.head+'</h3><p>'+d.text+'</p><ul>'+d.list.map(function(i){return '<li>'+i+'</li>';}).join('')+'</ul>';
      document.querySelectorAll('[data-v]').forEach(function(x){x.setAttribute('aria-pressed','false');});
      b.setAttribute('aria-pressed','true');
    });
  });

  /* ---------- марки ---------- */
  document.querySelectorAll('[data-g]').forEach(function(b){
    b.addEventListener('click', function(){
      var g=b.getAttribute('data-g');
      document.querySelectorAll('[data-g]').forEach(function(x){x.setAttribute('aria-pressed','false');});
      b.setAttribute('aria-pressed','true');
      document.querySelectorAll('.chip').forEach(function(c){
        c.hidden = !(g==='all' || c.getAttribute('data-grp')===g);
      });
    });
  });

  /* ---------- форма ---------- */
  var f=document.getElementById('lead');
  if(f) f.addEventListener('submit', function(e){
    e.preventDefault();
    var d=new FormData(f), msg=document.getElementById('formMsg');
    var name=(d.get('name')||'').toString().trim(), phone=(d.get('phone')||'').toString().trim();
    if(!name || !phone){ if(msg) msg.textContent='Заполните имя и телефон, чтобы мы могли ответить.'; return; }
    var text='Заявка: '+d.get('item')+'\nИмя: '+name+'\nТелефон: '+phone;
    if((d.get('car')||'').toString().trim()) text+='\nАвто: '+d.get('car');
    if((d.get('msg')||'').toString().trim()) text+='\nКомментарий: '+d.get('msg');
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(function(){ if(msg) msg.textContent='Заявка сформирована и скопирована. Отправьте её нам сообщением — ответим и уточним детали.'; },
        function(){ if(msg) msg.textContent='Заявка сформирована: '+text; });
    } else if(msg){ msg.textContent='Заявка сформирована: '+text; }
  });
})();
