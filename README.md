# 🌌 TFT Set 17 - Space Gods | Team Builder

<p align="center">
  <strong>Công cụ xây dựng đội hình TFT Set 17 Space Gods</strong><br>
  Phân tích tướng, tộc hệ và đội hình meta mạnh nhất
</p>

---

## ✨ Tính năng

### 🏆 Đội Hình Meta
- **10 đội hình** level 10 được phân tích dựa trên synergy tộc hệ
- Chi tiết carry chính, trang bị gợi ý, vị trí đứng
- Mốc kích hoạt traits tối ưu

### 🏗️ Team Builder (Drag & Drop)
- **Sân đấu hex 4×7** giống TFT thật
- Kéo thả hoặc click tướng vào sân
- **Trait Tracker** tự động tính tộc hệ kích hoạt
- Áp dụng đội hình mẫu từ 10 meta comps
- Filter tướng theo cost + tìm kiếm

### ⚔️ Tướng
- **63 tướng** Set 17 với đầy đủ thông tin
- Filter theo chi phí (1-5 vàng)
- Hình ảnh, traits, cost

### 🔗 Tộc/Hệ
- **34 tộc hệ** với mốc breakpoint
- Filter theo loại: Origin / Class / Unique
- Mô tả chi tiết tiếng Việt

## 🎨 Design
- **Dark cosmic theme** phong cách vũ trụ
- Stars animation + nebula gradients
- Glassmorphism cards
- Font: Inter + Orbitron
- Responsive cho mobile

## 🛠️ Tech Stack
- HTML5 + CSS3 + Vanilla JavaScript
- Không framework, không dependencies
- Dữ liệu parsed từ TFT Academy

## 🚀 Chạy Local

```bash
# Cách 1: Dùng serve
npx serve app -l 3000

# Cách 2: Live Server (VS Code)
# Mở app/index.html → Right click → Open with Live Server
```

## 📁 Cấu trúc

```
TFT-Set17-TeamBuilder/
├── app/
│   ├── index.html      # Trang chính
│   ├── style.css       # CSS premium theme
│   ├── app.js          # Logic & Builder
│   └── data.json       # Dữ liệu tướng/trait/comp
├── data/
│   └── tft_set17_data.json  # Dữ liệu gốc
├── parse_html.js       # Script parse HTML → JSON
├── index.html          # HTML gốc từ TFT Academy
└── README.md
```

## 📊 10 Đội Hình Meta

| # | Tên | Core Traits | Carry | Độ Khó |
|---|-----|------------|-------|--------|
| 1 | ⭐ Dark Star Snipers | Dark Star 6 + Sniper 6 | Jhin, Xayah | TB |
| 2 | 🎮 Meeple Army | Meeple 8 + Replicator 4 | Bard, Corki | Khó |
| 3 | 🌌 Space Groove Vanguard | Space Groove 6 + Vanguard 6 | Samira, Blitzcrank | Dễ |
| 4 | ⚡ Stargazer Challengers | Stargazer 6 + Challenger 6 | Xayah, Diana | TB |
| 5 | 🧠 Psionic Channelers | Psionic 4 + Channeler 6 | Viktor, ASol | TB |
| 6 | 🗡️ Rogue Assassins | Rogue 6 | Kai'Sa, Riven | Khó |
| 7 | 🤖 Mecha Brawlers | Brawler 6 + Mecha 4 | ASol, Mighty Mech | Dễ |
| 8 | 🛡️ N.O.V.A. Bastion | N.O.V.A. 4 + Bastion 6 | Kindred, Akali | Dễ |
| 9 | 📋 Replicator Shepherd | Replicator 6 + Shepherd 6 | Nami, Lulu | TB |
| 10 | 🔮 Arbiter Shepherd | Arbiter 4 + Shepherd 6 | LeBlanc, Diana | Khó |

## 📝 License

MIT License - Free to use and modify.
