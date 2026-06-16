const navItems = [
  ["Donate", "/donate"],
  ["Sponsor", "/sponsor"],
  ["Campaigns", "/campaigns"],
  ["Events", "/events"],
  ["Impact", "/impact"],
  ["Team", "/team"],
  ["Partners", "/partners"],
  ["Contact", "/contact"]
];

export function SiteHeader() {
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
          {navItems.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <a className="headerCta" href="/donate">
          Give Now
        </a>
      </header>
    </>
  );
}
