"use client";

import { useState } from "react";

const navGroups = [
  {
    label: "About us",
    href: "/team",
    links: [
      ["Team", "/team"],
      ["Partners", "/partners"],
      ["Impact", "/impact"]
    ]
  },
  {
    label: "Get Involved",
    href: "/donate",
    links: [
      ["Donate", "/donate"],
      ["Sponsor", "/sponsor"],
      ["Volunteer", "/volunteer"],
      ["Campaigns", "/campaigns"],
      ["Shop", "/shop"]
    ]
  },
  {
    label: "News & Events",
    href: "/events",
    links: [
      ["Events", "/events"],
      ["Gallery", "/gallery"],
      ["News & Blogs", "/news"]
    ]
  }
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className="utilityBar">
        <span>Heart to Heart Foundation, Kenya. Founded in 1993.</span>
        <a href="/admin">Admin portal</a>
      </div>
      <header className="siteHeader">
        <a className="brand" href="/" aria-label="Heart to Heart Foundation home">
          <img src="/assets/heart-to-heart-logo.svg" alt="Heart to Heart Foundation" />
        </a>
        <nav className="mainNav" aria-label="Main navigation">
          <a href="/">Home</a>
          {navGroups.map((group) => (
            <div className="navGroup" key={group.label}>
              <a aria-haspopup="true" href={group.href}>
                {group.label}
              </a>
              <div className="navDropdown" role="menu">
                {group.links.map(([label, href]) => (
                  <a href={href} key={href} role="menuitem">
                    {label}
                  </a>
                ))}
              </div>
            </div>
          ))}
          <a href="/contact">Contact Us</a>
        </nav>
        <button
          className="mobileMenuButton"
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
        <a className="headerCta" href="/donate">
          Give Now
        </a>
        <nav
          className={`mobileNav${menuOpen ? " open" : ""}`}
          id="mobile-navigation"
          aria-label="Mobile navigation"
        >
          <a href="/" onClick={closeMenu}>Home</a>
          {navGroups.map((group) => (
            <details className="mobileNavGroup" key={group.label}>
              <summary>{group.label}</summary>
              <div>
                {group.links.map(([label, href]) => (
                  <a href={href} key={href} onClick={closeMenu}>
                    {label}
                  </a>
                ))}
              </div>
            </details>
          ))}
          <a href="/contact" onClick={closeMenu}>Contact Us</a>
          <a className="mobileNavCta" href="/donate" onClick={closeMenu}>Give Now</a>
        </nav>
      </header>
    </>
  );
}
