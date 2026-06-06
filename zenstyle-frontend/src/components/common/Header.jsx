import { NavLink } from "react-router-dom";
import { NavButton, NavDropdown, LoginButton } from "../../ui";

const NAV_ITEMS = [
  { label: "VỀ CHÚNG TÔI", path: "/ve-chung-toi", type: "link" },
  {
    label: "SẢN PHẨM",
    type: "dropdown",
    children: [
      { label: "Hair Styling", path: "/san-pham/hair-styling" },
      { label: "Skin Care", path: "/san-pham/skin-care" },
      { label: "Beauty Treatment", path: "/san-pham/beauty-treatment" },
    ],
  },
  { label: "NHÂN VIÊN", path: "/nhan-vien", type: "link" },
  { label: "ĐẶT LỊCH", path: "/dat-lich", type: "link" },
];

export default function Header() {
  return (
    <header className="top-0 z-50  border-b border-[var(--color-zen-accent-hover)]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between ">
        {/* ── Logo ── */}
        <NavLink to="/" className="shrink-0 ">
          <img
            src="/public/ZenStyle.jpg"
            alt="ZenStyle"
            className="h-16 w-auto object-contain"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "block";
            }}
          />
        </NavLink>
        {/* ── Navbar ── */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-3">
          {NAV_ITEMS.map((item) =>
            item.type === "dropdown" ? (
              <NavDropdown key={item.label} item={item} />
            ) : (
              <NavButton key={item.label} item={item} />
            ),
          )}
        </nav>

        {/* ── Actions ── */}
        <div className="flex items-center gap-3 shrink-0">
          <LoginButton onClick={() => console.log("login clicked")} />
        </div>
      </div>
    </header>
  );
}
