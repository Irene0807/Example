// ===== Inline data (avoids CORS issues with local file:// protocol) =====
const timelineData = [
  { year: '1928', title: '馮·諾伊曼的突破', description: '約翰·馮·諾伊曼發表最小最大值定理，為二人零和賽局奠定數學基礎。' },
  { year: '1944', title: '《賽局理論與經濟行為》', description: '馮·諾伊曼與摩根斯坦出版劃時代著作，正式建立賽局理論學科。' },
  { year: '1950', title: '納許均衡', description: '約翰·納許（John Nash）在普林斯頓大學提出納許均衡概念，革新非合作賽局理論。' },
  { year: '1950', title: '囚徒困境', description: '梅里爾·弗勒德與梅爾文·德雷舍在蘭德公司設計囚徒困境實驗，艾伯特·塔克命名。' },
  { year: '1973', title: '演化賽局理論', description: '梅納德·史密斯將賽局理論引入生物學，建立演化穩定策略（ESS）概念。' },
  { year: '1994', title: '第一個賽局理論諾貝爾獎', description: '納許、海薩尼、澤爾滕共同獲得諾貝爾經濟學獎，賽局理論正式登上最高學術舞台。' },
  { year: '2012', title: '穩定配對與市場設計', description: '夏普利與羅斯因穩定配對理論與市場設計的貢獻獲諾貝爾獎。' },
  { year: '2020', title: '拍賣理論', description: '米格羅姆與威爾遜因改進拍賣理論及新拍賣格式的發明獲諾貝爾獎。' },
];

const nobelData = [
  { year: '1994', name: 'John Nash', reason: '納許均衡理論' },
  { year: '1994', name: 'John Harsanyi', reason: '不完全資訊賽局' },
  { year: '1994', name: 'Reinhard Selten', reason: '子賽局完美均衡' },
  { year: '2005', name: 'Robert Aumann', reason: '重複賽局、共識知識' },
  { year: '2005', name: 'Thomas Schelling', reason: '衝突與合作分析' },
  { year: '2007', name: 'Leonid Hurwicz', reason: '機制設計理論' },
  { year: '2012', name: 'Lloyd Shapley', reason: '穩定配對理論' },
  { year: '2012', name: 'Alvin Roth', reason: '市場設計實踐' },
  { year: '2020', name: 'Paul Milgrom', reason: '拍賣理論與設計' },
  { year: '2020', name: 'Robert Wilson', reason: '拍賣格式發明' },
];

// ===== Navbar scroll effect =====
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
});

// ===== Mobile nav toggle =====
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('mobile-open');
    if (isOpen) {
      Object.assign(navLinks.style, {
        display: 'flex', flexDirection: 'column',
        position: 'absolute', top: '64px', right: '0',
        background: 'var(--color-bg-card)', padding: '1rem',
        borderLeft: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        zIndex: '200',
      });
    } else {
      navLinks.removeAttribute('style');
    }
  });
}

// ===== Intersection Observer for scroll animations =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

function observeAll() {
  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}
observeAll();

// ===== Render Timeline (index.html only) =====
const timelineEl = document.getElementById('timeline');
if (timelineEl) {
  timelineEl.innerHTML = timelineData.map(item => `
    <div class="timeline-item animate-on-scroll">
      <div class="timeline-year">${item.year}</div>
      <h4>${item.title}</h4>
      <p>${item.description}</p>
    </div>
  `).join('');
  observeAll();
}

// ===== Render Nobel Grid (index.html only) =====
const nobelEl = document.getElementById('nobel-grid');
if (nobelEl) {
  nobelEl.innerHTML = nobelData.map(item => `
    <div class="nobel-card animate-on-scroll">
      <div class="nobel-year">${item.year}</div>
      <div class="nobel-name">${item.name}</div>
      <div class="nobel-reason">${item.reason}</div>
    </div>
  `).join('');
  observeAll();
}
