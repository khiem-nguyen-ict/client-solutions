// ── PROVINCE DATA ─────────────────────────
// 34 đơn vị hành chính cấp tỉnh theo NQ202/2025/QH15 (hiệu lực 12/6/2025)
const PROVINCES = [
  // Miền Bắc (15)
  "Hà Nội",
  "Hải Phòng",
  "Quảng Ninh",
  "Lào Cai",
  "Tuyên Quang",
  "Cao Bằng",
  "Thái Nguyên",
  "Lạng Sơn",
  "Sơn La",
  "Lai Châu",
  "Điện Biên",
  "Phú Thọ",
  "Bắc Ninh",
  "Hưng Yên",
  "Ninh Bình",
  // Miền Trung (9)
  "Thanh Hóa",
  "Nghệ An",
  "Hà Tĩnh",
  "Quảng Trị",
  "Huế",
  "Đà Nẵng",
  "Quảng Ngãi",
  "Gia Lai",
  "Khánh Hòa",
  // Tây Nguyên & Đông Nam Bộ (4)
  "Đắk Lắk",
  "Lâm Đồng",
  "Đồng Nai",
  "TP. Hồ Chí Minh",
  // ĐBSCL (6)
  "Tây Ninh",
  "Đồng Tháp",
  "Vĩnh Long",
  "Cần Thơ",
  "An Giang",
  "Cà Mau",
];

// ── SEED PROVINCE DATA ────────────────────
function seedProvinceData() {
  PROVINCES.forEach((p) => {
    STATE.provinceData[p] = Math.floor(Math.random() * 800) + 50;
  });
  // Major cities get more
  STATE.provinceData["Hà Nội"] = 4820;
  STATE.provinceData["TP. Hồ Chí Minh"] = 6340;
  STATE.provinceData["Đà Nẵng"] = 1780;
  STATE.provinceData["Hải Phòng"] = 1240;
  STATE.provinceData["Cần Thơ"] = 980;
  STATE.provinceData["Lào Cai"] = 720;
  STATE.provinceData["Tuyên Quang"] = 410;
  STATE.provinceData["Thái Nguyên"] = 650;
  STATE.provinceData["Quảng Ninh"] = 890;
  STATE.provinceData["Nghệ An"] = 740;
  STATE.provinceData["Phú Thọ"] = 530;
  STATE.provinceData["Bắc Ninh"] = 820;
  STATE.provinceData["Ninh Bình"] = 470;
  STATE.provinceData["Thanh Hóa"] = 690;
  STATE.provinceData["Huế"] = 380;
  STATE.provinceData["Quảng Trị"] = 310;
  STATE.provinceData["Gia Lai"] = 560;
  STATE.provinceData["Khánh Hòa"] = 870;
  STATE.provinceData["Đắk Lắk"] = 490;
  STATE.provinceData["Lâm Đồng"] = 430;
  STATE.provinceData["Đồng Nai"] = 760;
  STATE.provinceData["Tây Ninh"] = 350;
  STATE.provinceData["Đồng Tháp"] = 420;
  STATE.provinceData["Vĩnh Long"] = 380;
  STATE.provinceData["An Giang"] = 640;
  STATE.provinceData["Cà Mau"] = 290;
}

// ── MAP COLOR HELPERS ─────────────────────
function getProvinceClass(count) {
  if (count >= 3000) return "active-5";
  if (count >= 1000) return "active-4";
  if (count >= 400) return "active-3";
  if (count >= 100) return "active-2";
  if (count >= 20) return "active-1";
  return "";
}

function refreshMapColors() {
  document.querySelectorAll(".province[data-province]").forEach((path) => {
    const name = path.dataset.province;
    const cnt = STATE.provinceData[name] || 0;
    // Remove old active classes
    path.classList.remove(
      "active-1",
      "active-2",
      "active-3",
      "active-4",
      "active-5",
    );
    const cls = getProvinceClass(cnt);
    if (cls) path.classList.add(cls);
  });
}

// ── TOOLTIP ───────────────────────────────
const tooltip = document.getElementById("province-tooltip");

function attachMapTooltips() {
  document.querySelectorAll(".province[data-province]").forEach((path) => {
    path.addEventListener("mouseenter", (e) => {
      const name = path.dataset.province;
      const cnt = (STATE.provinceData[name] || 0).toLocaleString("vi-VN");
      tooltip.innerHTML = `<strong>${name}</strong>${cnt}&nbsp;Gen đã đăng ký`;
      tooltip.classList.add("show");
    });

    path.addEventListener("mousemove", (e) => {
      tooltip.style.left = e.clientX + 14 + "px";
      tooltip.style.top = e.clientY - 10 + "px";
    });

    path.addEventListener("mouseleave", () => {
      tooltip.classList.remove("show");
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  fetch("./assets/map.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("map-container").innerHTML = html;

      seedProvinceData();

      // Initial counter
      document.querySelectorAll("[data-counter]").forEach((el) => {
        el.dataset.current = CONFIG.BASE_COUNT;
        el.textContent = CONFIG.BASE_COUNT.toLocaleString("vi-VN");
      });

      // Map
      attachMapTooltips();
      refreshMapColors();
    })
    .catch((error) => console.error("Error loading map:", error));
});
