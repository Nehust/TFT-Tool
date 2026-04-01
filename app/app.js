/* ========================================
   TFT SET 17 - SPACE GODS | APP.JS
   ======================================== */

(function () {
  'use strict';

  // ---- State ----
  let DATA = null;
  let currentCostFilter = 'all';
  let currentTraitFilter = 'all';
  let poolCostFilter = 'all';
  let poolSearchQuery = '';

  // Builder state: array of 28 cells (4 rows × 7 cols), null = empty
  const BOARD_ROWS = 4;
  const BOARD_COLS = 7;
  const MAX_CHAMPS = 10;
  let boardState = new Array(BOARD_ROWS * BOARD_COLS).fill(null);

  // Drag state
  let draggedChampName = null;

  // ---- DOM Refs ----
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const starsBg = $('#starsBg');
  const champsGrid = $('#champsGrid');
  const traitsGrid = $('#traitsGrid');
  const compsGrid = $('#compsGrid');
  const modalOverlay = $('#modalOverlay');
  const modalContent = $('#modalContent');
  const modalClose = $('#modalClose');

  // Builder refs
  const hexBoard = $('#hexBoard');
  const poolGrid = $('#poolGrid');
  const traitTracker = $('#traitTracker');
  const boardCountEl = $('#boardCount');
  const clearBoardBtn = $('#clearBoard');
  const templateSelect = $('#templateSelect');
  const loadTemplateBtn = $('#loadTemplate');
  const poolSearch = $('#poolSearch');

  // ==============================
  //  STARS BACKGROUND
  // ==============================
  function createStars() {
    const count = 180;
    const frag = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 2.5 + 0.5;
      star.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        --duration: ${Math.random() * 4 + 2}s;
        --max-opacity: ${Math.random() * 0.6 + 0.2};
        animation-delay: ${Math.random() * 5}s;
      `;
      frag.appendChild(star);
    }

    for (let i = 0; i < 3; i++) {
      const ss = document.createElement('div');
      ss.className = 'shooting-star';
      ss.style.cssText = `
        top: ${Math.random() * 40}%;
        left: ${Math.random() * 40}%;
        animation-delay: ${Math.random() * 8 + i * 5}s;
        animation-duration: ${Math.random() * 2 + 2.5}s;
      `;
      frag.appendChild(ss);
    }

    starsBg.appendChild(frag);
  }

  // ==============================
  //  DATA LOADING
  // ==============================
  async function loadData() {
    try {
      const res = await fetch('data.json');
      DATA = await res.json();
      init();
    } catch (err) {
      console.error('Failed to load data:', err);
      champsGrid.innerHTML = '<p style="color:#f87171;text-align:center;">Không thể tải dữ liệu.</p>';
    }
  }

  // ==============================
  //  INIT
  // ==============================
  function init() {
    renderChampions();
    renderTraits();
    renderComps();
    setupTabs();
    setupFilters();
    setupModal();
    initBuilder();
  }

  // ==============================
  //  RENDER CHAMPIONS
  // ==============================
  function renderChampions() {
    const champs = DATA.champions.filter(c => {
      if (currentCostFilter === 'all') return true;
      return c.cost === parseInt(currentCostFilter);
    });

    champsGrid.innerHTML = '';
    const frag = document.createDocumentFragment();

    champs.forEach((champ, i) => {
      const card = document.createElement('div');
      card.className = 'champ-card stagger-in';
      card.dataset.cost = champ.cost;
      card.style.animationDelay = `${i * 30}ms`;

      const traitsHtml = champ.traits.map(t =>
        `<span class="champ-trait-tag">${t}</span>`
      ).join('');

      card.innerHTML = `
        <div class="champ-img-wrap">
          <img class="champ-img" src="${champ.image}" alt="${champ.name}" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 80 80%22><rect fill=%22%23141c46%22 width=%2280%22 height=%2280%22/><text x=%2240%22 y=%2245%22 text-anchor=%22middle%22 fill=%22%239ba4c7%22 font-size=%2220%22>${champ.name[0]}</text></svg>'">
          <span class="champ-cost">💰 ${champ.cost}</span>
        </div>
        <div class="champ-name" title="${champ.name}">${champ.name}</div>
        <div class="champ-traits">${traitsHtml}</div>
      `;

      frag.appendChild(card);
    });

    champsGrid.appendChild(frag);
  }

  // ==============================
  //  RENDER TRAITS
  // ==============================
  function renderTraits() {
    const traits = Object.entries(DATA.traits).filter(([name, info]) => {
      if (currentTraitFilter === 'all') return true;
      return info.type === currentTraitFilter;
    });

    traitsGrid.innerHTML = '';
    const frag = document.createDocumentFragment();

    traits.forEach(([name, info], i) => {
      const card = document.createElement('div');
      card.className = 'trait-card stagger-in';
      card.dataset.type = info.type;
      card.style.animationDelay = `${i * 40}ms`;

      const breakpointsHtml = info.breakpoints.map((bp, idx) =>
        `<span class="breakpoint${idx === 0 ? ' active-bp' : ''}">${bp}</span>`
      ).join('');

      const champsHtml = info.champions.map(c =>
        `<span class="trait-champ-tag">${c}</span>`
      ).join('');

      const typeLabel = info.type.charAt(0).toUpperCase() + info.type.slice(1);
      const typeIcon = info.type === 'origin' ? '🌀' : info.type === 'class' ? '⚔️' : '👑';

      card.innerHTML = `
        <div class="trait-header">
          <span class="trait-name">${name}</span>
          <span class="trait-type-badge ${info.type}">${typeIcon} ${typeLabel}</span>
        </div>
        <p class="trait-desc">${info.description}</p>
        <div class="trait-breakpoints">${breakpointsHtml}</div>
        <div class="trait-champions">${champsHtml}</div>
      `;

      frag.appendChild(card);
    });

    traitsGrid.appendChild(frag);
  }

  // ==============================
  //  RENDER TEAM COMPS
  // ==============================
  function renderComps() {
    compsGrid.innerHTML = '';
    const frag = document.createDocumentFragment();

    DATA.teamComps.forEach((comp, i) => {
      const card = document.createElement('div');
      const isFlex = comp.isFlex === true;
      card.className = `comp-card stagger-in${isFlex ? ' flex-comp' : ''}`;
      card.style.animationDelay = `${i * 60}ms`;

      let diffClass = 'easy';
      if (comp.difficulty === 'Trung bình') diffClass = 'medium';
      else if (comp.difficulty === 'Khó') diffClass = 'hard';

      const traitCount = Object.keys(comp.activeTraits).length;

      const champsHtml = comp.champions.map(champName => {
        const champData = DATA.champions.find(c => c.name === champName);
        const isCarry = comp.carries.includes(champName);
        if (!champData) return '';
        return `
          <div class="comp-champ ${isCarry ? 'is-carry' : ''}" title="${champName}${isCarry ? ' ⭐ Carry' : ''}">
            <img src="${champData.image}" alt="${champName}" loading="lazy" onerror="this.style.background='#141c46'">
          </div>
        `;
      }).join('');

      const traitsHtml = Object.entries(comp.activeTraits).map(([trait, count]) =>
        `<span class="comp-trait-tag">${trait} <span class="comp-trait-count">${count}</span></span>`
      ).join('');

      const flexBadge = isFlex ? `<span class="comp-flex-badge">🌈 FLEX ${traitCount} traits</span>` : '';

      card.innerHTML = `
        <div class="comp-header">
          <div class="comp-name">${comp.name}</div>
          <div class="comp-badges">
            ${flexBadge}
            <span class="comp-diff ${diffClass}">${comp.difficulty}</span>
            <span class="comp-playstyle">${comp.playstyle}</span>
          </div>
        </div>
        <p class="comp-desc">${comp.description}</p>
        <div class="comp-champs">${champsHtml}</div>
        <div class="comp-traits">${traitsHtml}</div>
        <div class="comp-click-hint">🔍 Click để xem chi tiết</div>
      `;

      card.addEventListener('click', () => openCompModal(comp));
      frag.appendChild(card);
    });

    compsGrid.appendChild(frag);
  }

  // ==============================
  //  MODAL
  // ==============================
  function openCompModal(comp) {
    let diffClass = 'easy';
    if (comp.difficulty === 'Trung bình') diffClass = 'medium';
    else if (comp.difficulty === 'Khó') diffClass = 'hard';

    const champsHtml = comp.champions.map(champName => {
      const champData = DATA.champions.find(c => c.name === champName);
      const isCarry = comp.carries.includes(champName);
      if (!champData) return '';
      return `
        <div class="modal-champ ${isCarry ? 'is-carry' : ''}">
          <img class="modal-champ-img" src="${champData.image}" alt="${champName}" loading="lazy">
          <div class="modal-champ-name">${champName}</div>
          <div class="modal-champ-cost" style="color: var(--cost-${champData.cost})">💰 ${champData.cost}</div>
          ${isCarry ? '<div class="modal-carry-label">⭐ CARRY</div>' : ''}
        </div>
      `;
    }).join('');

    const traitsHtml = Object.entries(comp.activeTraits).map(([trait, count]) =>
      `<span class="modal-trait-tag">${trait} <span class="modal-trait-count">×${count}</span></span>`
    ).join('');

    const itemsHtml = Object.entries(comp.items).map(([champ, items]) => `
      <div class="modal-item-row">
        <span class="modal-item-champ">${champ}</span>
        <div class="modal-item-list">
          ${items.map(item => `<span class="modal-item">${item}</span>`).join('')}
        </div>
      </div>
    `).join('');

    modalContent.innerHTML = `
      <div class="modal-comp-name">${comp.name}</div>
      <div class="modal-comp-meta">
        <span class="comp-diff ${diffClass}">${comp.difficulty}</span>
        <span class="comp-playstyle">${comp.playstyle}</span>
      </div>
      <p class="modal-desc">${comp.description}</p>

      <div class="modal-section-title">🏆 Đội hình (${comp.champions.length} tướng)</div>
      <div class="modal-champs-grid">${champsHtml}</div>

      <div class="modal-section-title">🔗 Tộc Hệ Kích Hoạt</div>
      <div class="modal-traits-grid">${traitsHtml}</div>

      <div class="modal-section-title">⚔️ Trang Bị Gợi Ý</div>
      <div class="modal-items-section">${itemsHtml}</div>

      <div class="modal-section-title">📍 Vị Trí Đứng</div>
      <div class="modal-positioning">${comp.positioning}</div>
    `;

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function setupModal() {
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  // ==============================
  //  TABS
  // ==============================
  function setupTabs() {
    const navBtns = $$('.nav-btn');
    const tabContents = $$('.tab-content');

    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;

        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        tabContents.forEach(tab => {
          tab.classList.remove('active');
          if (tab.id === `tab${capitalize(target)}`) {
            tab.classList.add('active');
          }
        });
      });
    });
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // ==============================
  //  FILTERS
  // ==============================
  function setupFilters() {
    // Cost filter (Champions tab)
    const costBtns = $$('#filterBar .filter-btn');
    costBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        costBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCostFilter = btn.dataset.cost;
        renderChampions();
      });
    });

    // Trait type filter
    const traitBtns = $$('.trait-filter-btn');
    traitBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        traitBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTraitFilter = btn.dataset.type;
        renderTraits();
      });
    });
  }

  // ========================================
  //  BUILDER
  // ========================================

  function initBuilder() {
    buildHexBoard();
    renderPool();
    populateTemplates();
    setupBuilderEvents();
    updateTraitTracker();
  }

  // --- Hex Board ---
  function buildHexBoard() {
    hexBoard.innerHTML = '';
    const frag = document.createDocumentFragment();

    for (let row = 0; row < BOARD_ROWS; row++) {
      const rowDiv = document.createElement('div');
      rowDiv.className = `hex-row${row % 2 === 1 ? ' offset' : ''}`;

      for (let col = 0; col < BOARD_COLS; col++) {
        const idx = row * BOARD_COLS + col;
        const cell = document.createElement('div');
        cell.className = 'hex-cell';
        cell.dataset.index = idx;
        cell.dataset.row = row;
        cell.dataset.col = col;

        cell.innerHTML = `
          <div class="hex-cell-border"></div>
          <div class="hex-cell-bg"></div>
          <div class="hex-cell-content">
            <span class="hex-cell-empty">+</span>
          </div>
          <button class="remove-champ" title="Xóa">✕</button>
        `;

        // Drag events
        cell.addEventListener('dragover', onCellDragOver);
        cell.addEventListener('dragleave', onCellDragLeave);
        cell.addEventListener('drop', onCellDrop);
        cell.addEventListener('click', onCellClick);

        // Remove button
        cell.querySelector('.remove-champ').addEventListener('click', (e) => {
          e.stopPropagation();
          removeChampFromBoard(idx);
        });

        rowDiv.appendChild(cell);
      }

      frag.appendChild(rowDiv);
    }

    hexBoard.appendChild(frag);
  }

  function renderBoardCell(idx) {
    const cells = hexBoard.querySelectorAll('.hex-cell');
    const cell = cells[idx];
    if (!cell) return;

    const champName = boardState[idx];
    const content = cell.querySelector('.hex-cell-content');

    if (champName) {
      const champData = DATA.champions.find(c => c.name === champName);
      cell.classList.add('occupied');
      cell.style.setProperty('--card-accent', `var(--cost-${champData ? champData.cost : 1})`);
      cell.style.setProperty('--card-glow', `var(--cost-${champData ? champData.cost : 1}-glow)`);
      content.innerHTML = `
        <img class="hex-champ-img" src="${champData ? champData.image : ''}" alt="${champName}" 
          onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 60 60%22><rect fill=%22%23141c46%22 width=%2260%22 height=%2260%22/><text x=%2230%22 y=%2235%22 text-anchor=%22middle%22 fill=%22%239ba4c7%22 font-size=%2216%22>${champName[0]}</text></svg>'">
        <span class="hex-champ-name">${champName}</span>
      `;
    } else {
      cell.classList.remove('occupied');
      cell.style.removeProperty('--card-accent');
      cell.style.removeProperty('--card-glow');
      content.innerHTML = `<span class="hex-cell-empty">+</span>`;
    }
  }

  // --- Cell events ---
  function onCellDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-over');
  }

  function onCellDragLeave(e) {
    this.classList.remove('drag-over');
  }

  function onCellDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');

    const champName = e.dataTransfer.getData('text/plain');
    if (!champName) return;

    const idx = parseInt(this.dataset.index);
    placeChampOnBoard(champName, idx);
  }

  function onCellClick(e) {
    // If clicking an empty cell and there's no drag, do nothing special
    // Occupied cells have remove button
  }

  // --- Board operations ---
  function placeChampOnBoard(champName, idx) {
    // Check max
    const currentCount = boardState.filter(c => c !== null).length;
    if (currentCount >= MAX_CHAMPS && !boardState[idx]) return;

    // If champ already on board (different cell), move it
    const existingIdx = boardState.indexOf(champName);
    if (existingIdx !== -1) {
      boardState[existingIdx] = null;
      renderBoardCell(existingIdx);
    }

    // If cell occupied by different champ, swap back to pool
    if (boardState[idx] && boardState[idx] !== champName) {
      const oldChamp = boardState[idx];
      boardState[idx] = null;
      renderBoardCell(idx);
      updatePoolChampState(oldChamp, false);
    }

    boardState[idx] = champName;
    renderBoardCell(idx);
    updatePoolChampState(champName, true);
    updateBoardCount();
    updateTraitTracker();
  }

  function removeChampFromBoard(idx) {
    const champName = boardState[idx];
    if (!champName) return;

    boardState[idx] = null;
    renderBoardCell(idx);
    updatePoolChampState(champName, false);
    updateBoardCount();
    updateTraitTracker();
  }

  function clearBoard() {
    boardState.fill(null);
    for (let i = 0; i < BOARD_ROWS * BOARD_COLS; i++) {
      renderBoardCell(i);
    }
    // Reset all pool items
    poolGrid.querySelectorAll('.pool-champ').forEach(el => {
      el.classList.remove('on-board');
    });
    updateBoardCount();
    updateTraitTracker();
  }

  function updateBoardCount() {
    const count = boardState.filter(c => c !== null).length;
    boardCountEl.textContent = `${count} / ${MAX_CHAMPS}`;
  }

  // --- Pool ---
  function renderPool() {
    const champs = DATA.champions.filter(c => {
      const costMatch = poolCostFilter === 'all' || c.cost === parseInt(poolCostFilter);
      const searchMatch = poolSearchQuery === '' || c.name.toLowerCase().includes(poolSearchQuery.toLowerCase());
      return costMatch && searchMatch;
    });

    poolGrid.innerHTML = '';
    const frag = document.createDocumentFragment();
    const onBoard = new Set(boardState.filter(c => c !== null));

    champs.forEach(champ => {
      const el = document.createElement('div');
      el.className = `pool-champ${onBoard.has(champ.name) ? ' on-board' : ''}`;
      el.dataset.cost = champ.cost;
      el.dataset.name = champ.name;
      el.draggable = true;
      el.title = `${champ.name} (💰${champ.cost}) - ${champ.traits.join(', ')}`;

      el.innerHTML = `
        <img class="pool-champ-img" src="${champ.image}" alt="${champ.name}" loading="lazy"
          onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 50 50%22><rect fill=%22%23141c46%22 width=%2250%22 height=%2250%22/><text x=%2225%22 y=%2230%22 text-anchor=%22middle%22 fill=%22%239ba4c7%22 font-size=%2214%22>${champ.name[0]}</text></svg>'">
        <div class="pool-champ-name">${champ.name}</div>
      `;

      // Drag events
      el.addEventListener('dragstart', (e) => {
        draggedChampName = champ.name;
        e.dataTransfer.setData('text/plain', champ.name);
        e.dataTransfer.effectAllowed = 'move';

        // Custom drag image
        const ghost = document.createElement('div');
        ghost.className = 'drag-ghost';
        ghost.innerHTML = `<img src="${champ.image}" alt="${champ.name}">`;
        document.body.appendChild(ghost);
        e.dataTransfer.setDragImage(ghost, 26, 26);
        setTimeout(() => ghost.remove(), 0);

        el.style.opacity = '0.4';
      });

      el.addEventListener('dragend', () => {
        el.style.opacity = '';
        draggedChampName = null;
      });

      // Click to add to first empty slot
      el.addEventListener('click', () => {
        if (el.classList.contains('on-board')) return;
        const currentCount = boardState.filter(c => c !== null).length;
        if (currentCount >= MAX_CHAMPS) return;

        // Find first empty cell
        const emptyIdx = boardState.indexOf(null);
        if (emptyIdx !== -1) {
          placeChampOnBoard(champ.name, emptyIdx);
          renderPool(); // Refresh pool to update on-board state
        }
      });

      frag.appendChild(el);
    });

    poolGrid.appendChild(frag);
  }

  function updatePoolChampState(champName, onBoard) {
    const el = poolGrid.querySelector(`.pool-champ[data-name="${champName}"]`);
    if (el) {
      el.classList.toggle('on-board', onBoard);
    }
  }

  // --- Trait Tracker ---
  function updateTraitTracker() {
    const champsOnBoard = boardState.filter(c => c !== null);
    if (champsOnBoard.length === 0) {
      traitTracker.innerHTML = '<div class="tracker-empty">Đặt tướng lên sân để xem tộc hệ</div>';
      return;
    }

    // Count traits
    const traitCounts = {};
    champsOnBoard.forEach(champName => {
      const champData = DATA.champions.find(c => c.name === champName);
      if (!champData) return;
      champData.traits.forEach(trait => {
        traitCounts[trait] = (traitCounts[trait] || 0) + 1;
      });
    });

    // Sort: active traits first (by highest breakpoint reached), then by count
    const traitEntries = Object.entries(traitCounts)
      .map(([name, count]) => {
        const traitInfo = DATA.traits[name];
        if (!traitInfo) return { name, count, breakpoints: [], reachedBP: 0, maxBP: 0 };
        const reachedBP = traitInfo.breakpoints.filter(bp => count >= bp).length;
        const maxBP = traitInfo.breakpoints.length;
        return { name, count, breakpoints: traitInfo.breakpoints, reachedBP, maxBP };
      })
      .sort((a, b) => {
        if (b.reachedBP !== a.reachedBP) return b.reachedBP - a.reachedBP;
        return b.count - a.count;
      });

    traitTracker.innerHTML = traitEntries.map(({ name, count, breakpoints, reachedBP, maxBP }) => {
      const isActive = reachedBP > 0;
      const isGold = reachedBP === maxBP && maxBP > 0;
      const className = isGold ? 'gold-trait' : (isActive ? 'active-trait' : '');

      const bpDots = breakpoints.map((bp, i) => {
        const reached = count >= bp;
        const dotClass = reached ? (isGold ? 'gold-reached' : 'reached') : '';
        return `<span class="bp-dot ${dotClass}" title="${bp}"></span>`;
      }).join('');

      return `
        <div class="tracker-item ${className}">
          <div style="display:flex;align-items:center;gap:6px;">
            <span class="tracker-trait-name">${name}</span>
            <div class="tracker-breakpoints-mini">${bpDots}</div>
          </div>
          <span class="tracker-trait-count">${count}</span>
        </div>
      `;
    }).join('');
  }

  // --- Templates ---
  function populateTemplates() {
    DATA.teamComps.forEach((comp, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      const label = comp.name.replace(/[⭐🎮🌌⚡🧠🗡️🤖🛡️📋🔮🔥💎🌀🎯]/g, '').trim();
      opt.textContent = comp.isFlex ? `🌈 ${label}` : label;
      templateSelect.appendChild(opt);
    });
  }

  function loadTemplate() {
    const idx = templateSelect.value;
    if (idx === '') return;

    const comp = DATA.teamComps[parseInt(idx)];
    if (!comp) return;

    clearBoard();

    // Place champions in a default pattern (fill rows from front to back)
    comp.champions.forEach((champName, i) => {
      if (i < BOARD_ROWS * BOARD_COLS) {
        // Smart placement: tanks in front rows, carries in back rows
        let cellIdx;
        if (i < 4) {
          // Front row (row 0), centered
          cellIdx = i + 1; // cols 1-4
        } else if (i < 7) {
          // Second row (row 1), centered
          cellIdx = BOARD_COLS + (i - 4) + 1;
        } else {
          // Back rows
          cellIdx = BOARD_COLS * 2 + (i - 7) + 2;
        }
        
        if (cellIdx < BOARD_ROWS * BOARD_COLS) {
          boardState[cellIdx] = champName;
        }
      }
    });

    // Re-render all cells
    for (let i = 0; i < BOARD_ROWS * BOARD_COLS; i++) {
      renderBoardCell(i);
    }

    renderPool();
    updateBoardCount();
    updateTraitTracker();
  }

  // --- Builder Events ---
  function setupBuilderEvents() {
    clearBoardBtn.addEventListener('click', () => {
      clearBoard();
      renderPool();
    });

    loadTemplateBtn.addEventListener('click', loadTemplate);

    // Pool filters
    const poolFilterBtns = $$('#poolFilters .pool-filter-btn');
    poolFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        poolFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        poolCostFilter = btn.dataset.cost;
        renderPool();
      });
    });

    // Pool search
    poolSearch.addEventListener('input', (e) => {
      poolSearchQuery = e.target.value;
      renderPool();
    });
  }

  // ==============================
  //  BOOTSTRAP
  // ==============================
  createStars();
  loadData();

})();
