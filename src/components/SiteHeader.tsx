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
        <a className="headerCta" href="/donate">
          Give Now
        </a>
      </header>
    </>
  );
}
