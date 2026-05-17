// ===== News × Game Theory Scheduler =====
// Source: NewsAPI.org /v2/everything — 中文新聞，不限主題
// CORS: 需瀏覽器 User-Agent 才會觸發（直接在瀏覽器開啟即可）
//
// ⚠ 免費方案：100 次/天
//   NEWS_INTERVAL_MIN = 15 → 96 次/天（安全）
//   若超額請調高此數字（20 或 30）

(function () {
  const NEWS_INTERVAL_MIN = 15;
  const NEWS_COUNT        = 6;
  const API_KEY           = '849aa6d2f4f54a5aa380d5b845168fdb';

  const NEWS_INTERVAL_MS = NEWS_INTERVAL_MIN * 60 * 1000;

  // 廣泛中文關鍵字，涵蓋政治、經濟、社會、科技、國際
  const API_URL =
    `https://newsapi.org/v2/everything` +
    `?q=台灣 OR 中國 OR 政治 OR 經濟 OR 社會 OR 科技 OR 國際 OR 選舉 OR 外交 OR 貿易` +
    `&language=zh` +
    `&sortBy=publishedAt` +
    `&pageSize=${NEWS_COUNT}` +
    `&apiKey=${API_KEY}`;

  // ===== 關鍵字 → 賽局概念（中文語境）=====
  const CONCEPT_MAP = [
    {
      keywords: ['價格', '通膨', '物價', '關稅', '降價', '漲價', '競爭', '市場', '薪資', '成本', '補貼'],
      concept: '囚徒困境',
      explanation: '多方競相採取對自身有利的策略，卻導致集體利益受損——個人理性與集體理性的核心矛盾。',
      link: 'concepts.html#nash', color: '#ef4444',
    },
    {
      keywords: ['合作', '聯盟', '協議', '結盟', '合資', '夥伴', '峰會', '協商', '同盟', '共識'],
      concept: '獵鹿賽局',
      explanation: '各方選擇合作還是各自為政？合作帶來最高報酬，但需要互信與協調機制。',
      link: 'games.html', color: '#10b981',
    },
    {
      keywords: ['談判', '讓步', '斡旋', '和解', '裁員', '補償', '賠償', '爭議', '抗議', '罷工'],
      concept: '最後通牒賽局',
      explanation: '提案者的條件與回應者的接受或拒絕，反映公平感、威脅可信度與討價還價的博弈邏輯。',
      link: 'games.html', color: '#6366f1',
    },
    {
      keywords: ['競標', '拍賣', 'IPO', '標案', '得標', '頻譜', '股票', '上市'],
      concept: '拍賣理論',
      explanation: '競標情境中，最優出價策略取決於拍賣形式與對其他競標者估值的預期。',
      link: 'games.html', color: '#f59e0b',
    },
    {
      keywords: ['壟斷', '市佔', '獨佔', '寡占', '反壟斷', '監管', '財團', '龍頭'],
      concept: '古諾競爭模型',
      explanation: '少數廠商主導市場時，每家廠商的最優產量取決於對手策略——古諾均衡描述此動態。',
      link: 'games.html', color: '#1a56db',
    },
    {
      keywords: ['制裁', '貿易戰', '報復', '封鎖', '禁令', '軍事', '威脅', '飛彈', '對峙', '台海', '南海'],
      concept: '膽小鬼賽局',
      explanation: '雙方互相施壓卻都不願先退讓，升級至兩敗俱傷的風險最終迫使一方讓步。',
      link: 'games.html', color: '#f97316',
    },
    {
      keywords: ['預算', '公債', '央行', '利率', '財政', '政府支出', '政策', '法規', '立法', '選舉'],
      concept: '重複賽局 / 承諾機制',
      explanation: '政府長期承諾改變了市場與民眾的預期，影響各方的策略選擇與均衡結果。',
      link: 'concepts.html#mixed', color: '#8b5cf6',
    },
    {
      keywords: ['AI', '人工智慧', '晶片', '半導體', '科技', '新創', '加密貨幣', '電動車', '太空'],
      concept: '演化賽局',
      explanation: '科技競賽中各方持續調整策略以適應對手，體現演化賽局中的動態均衡概念。',
      link: 'concepts.html', color: '#06b6d4',
    },
  ];

  const DEFAULT_CONCEPT = {
    concept: '策略互動分析',
    explanation: '此事件涉及多方決策者，可從賽局理論角度分析各方的策略選擇與均衡結果。',
    link: 'concepts.html', color: '#64748b',
  };

  const FALLBACK = [
    { title: '習近平對台態度大轉變，學者揭示兩岸關係新局', source: 'Yahoo 新聞' },
    { title: '多國對特定商品發動報復性關稅，貿易摩擦升溫', source: '財經新聞' },
    { title: '台灣半導體廠商爭搶先進製程訂單，競爭白熱化', source: '產業觀察' },
    { title: '政府宣布擴大綠能補貼，廠商評估入市策略', source: '能源新聞' },
    { title: '央行宣布升息決定，市場各方反應兩極', source: '金融時報' },
    { title: '科技巨頭聯合推動 AI 倫理標準，尋求跨國共識', source: '科技快訊' },
  ];

  // ===== 分析邏輯 =====
  function analyzeHeadline(title) {
    for (const e of CONCEPT_MAP) {
      if (e.keywords.some(kw => title.includes(kw))) return e;
    }
    return DEFAULT_CONCEPT;
  }

  function timeAgo(iso) {
    const h = (Date.now() - new Date(iso).getTime()) / 3600000;
    if (h < 1) return `${Math.round(h * 60)} 分鐘前`;
    if (h < 24) return `${Math.round(h)} 小時前`;
    return `${Math.round(h / 24)} 天前`;
  }

  function buildCard(title, sourceName, publishedAt, link, isLive) {
    const a = analyzeHeadline(title);
    const dot  = isLive ? '<span class="news-live-dot"></span>' : '';
    const time = isLive ? timeAgo(publishedAt) : '範例';
    const href = link ? `href="${link}" target="_blank" rel="noopener"` : '';
    return `
      <div class="news-card slide-up">
        <div class="news-meta">
          <span class="news-source">${dot}${sourceName}</span>
          <span class="news-time">${time}</span>
        </div>
        <h4 class="news-title"><a ${href}>${title}</a></h4>
        <div class="news-analysis" style="border-left-color:${a.color}">
          <span class="news-concept-badge" style="background:${a.color}20;color:${a.color}">♟ ${a.concept}</span>
          <p>${a.explanation}</p>
          <a href="${a.link}" class="news-learn-more">深入了解 →</a>
        </div>
      </div>`;
  }

  // ===== Status / countdown =====
  function setStatus(state) {
    const el = document.getElementById('news-status');
    if (!el) return;
    if (state === 'loading') {
      el.textContent = '⟳ 抓取中…'; el.className = 'news-status loading';
    } else if (state === 'error') {
      el.textContent = '⚠ 顯示離線範例'; el.className = 'news-status error';
    } else {
      el.textContent = `✓ 已更新 ${new Date().toLocaleTimeString('zh-TW')}`; el.className = 'news-status ok';
    }
  }

  let _cd = null;
  function startCountdown() {
    let s = NEWS_INTERVAL_MS / 1000;
    clearInterval(_cd);
    _cd = setInterval(() => {
      s--;
      const el = document.getElementById('news-countdown');
      if (el) el.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
      if (s <= 0) clearInterval(_cd);
    }, 1000);
  }

  // ===== Fetch =====
  async function fetchLiveNews() {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    let res;
    try {
      res = await fetch(API_URL, { signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.status !== 'ok') throw new Error(json.message || 'API error');
    const articles = (json.articles || []).filter(a => a.title && a.title !== '[Removed]');
    if (!articles.length) throw new Error('empty');
    return articles;
  }

  // ===== Update =====
  async function fetchAndUpdate() {
    setStatus('loading');
    const feed = document.getElementById('news-feed');
    if (!feed) return;
    try {
      const articles = await fetchLiveNews();
      feed.innerHTML = articles.map(a =>
        buildCard(a.title, a.source?.name ?? '新聞', a.publishedAt, a.url, true)
      ).join('');
      setStatus('ok');
    } catch (err) {
      console.error('[news-scheduler]', err.message);
      feed.innerHTML = FALLBACK.map(f => buildCard(f.title, f.source, null, '', false)).join('');
      setStatus('error');
    }
    startCountdown();
  }

  // ===== Init =====
  function init() {
    if (!document.getElementById('news-section')) return;
    const lbl = document.getElementById('news-interval-label');
    if (lbl) lbl.textContent = `${NEWS_INTERVAL_MIN} 分鐘`;

    const feed = document.getElementById('news-feed');
    if (feed) feed.innerHTML = FALLBACK.map(f => buildCard(f.title, f.source, null, '', false)).join('');

    fetchAndUpdate();
    setInterval(fetchAndUpdate, NEWS_INTERVAL_MS);
    window.__refreshNews = fetchAndUpdate;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
