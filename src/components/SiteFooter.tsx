const footerLinks = [
  ["Donate", "/donate"],
  ["Volunteer", "/volunteer"],
  ["Campaigns", "/campaigns"],
  ["Events", "/events"],
  ["Impact", "/impact"],
  ["Team", "/team"],
  ["Partners", "/partners"],
  ["Corporate Giving", "/corporate"],
  ["Contact", "/contact"]
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/Heart2HFoundation",
    icon: (
      <path d="M14.2 8.2h2.3V4.4c-.4-.1-1.8-.2-3.3-.2-3.3 0-5.5 2-5.5 5.7v3.2H4v4.2h3.7V28h4.5V17.3h3.7l.6-4.2h-4.3v-2.8c0-1.2.3-2.1 2-2.1Z" />
    )
  },
  {
    label: "X",
    href: "https://x.com/_H2HFoundation",
    icon: (
      <path d="M18.6 13.6 27.2 4h-2l-7.5 8.3L11.8 4H4.9l9 12.6L4.9 26.8h2l7.9-8.8 6.3 8.8H28l-9.4-13.2Zm-2.8 3.1-.9-1.3L7.6 5.5h3.2l5.8 7.9.9 1.3 7.7 10.6H22l-6.2-8.6Z" />
    )
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@HearttoHeartFoundation-f3o",
    icon: (
      <path d="M28.4 9.2a3.1 3.1 0 0 0-2.2-2.2C24.3 6.5 16.5 6.5 16.5 6.5s-7.8 0-9.7.5a3.1 3.1 0 0 0-2.2 2.2A32.4 32.4 0 0 0 4 15a32.4 32.4 0 0 0 .6 5.8A3.1 3.1 0 0 0 6.8 23c1.9.5 9.7.5 9.7.5s7.8 0 9.7-.5a3.1 3.1 0 0 0 2.2-2.2A32.4 32.4 0 0 0 29 15a32.4 32.4 0 0 0-.6-5.8ZM14 18.6v-7.2l6.5 3.6-6.5 3.6Z" />
    )
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/heart-to-heart-foundation-nairobi/",
    icon: (
      <path d="M9.3 27H4.8V12.5h4.5V27ZM7 10.5A2.6 2.6 0 1 1 7 5.3a2.6 2.6 0 0 1 0 5.2ZM27 27h-4.5v-7.1c0-1.7 0-3.9-2.4-3.9s-2.8 1.9-2.8 3.8V27h-4.5V12.5h4.3v2h.1a4.7 4.7 0 0 1 4.2-2.3c4.5 0 5.4 3 5.4 6.9V27Z" />
    )
  }
];

export function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div>
        <img src="/assets/heart-to-heart-logo.svg" alt="Heart to Heart Foundation" />
        <p>
          Dedicated to the prevention, control, and treatment of heart disease in
          children in Kenya.
        </p>
        <div className="footerSocials" aria-label="Social media links">
          {socialLinks.map((social) => (
            <a
              aria-label={social.label}
              href={social.href}
              key={social.href}
              rel="noreferrer"
              target="_blank"
            >
              <svg aria-hidden="true" focusable="false" viewBox="0 0 32 32">
                {social.icon}
              </svg>
            </a>
          ))}
        </div>
      </div>
      <nav aria-label="Footer navigation">
        {footerLinks.map(([label, href]) => (
          <a href={href} key={href}>{label}</a>
        ))}
      </nav>
      <div>
        <strong>Contact us</strong>
        <span>P.O. Box 66399 - 000800 Nairobi</span>
        <span>Off Langa&apos;ta Road, next to Don Bosco Utume</span>
        <a href="tel:+254738150092">+254 738 150 092</a>
        <a href="mailto:hearttoheart@karenhospital.org">hearttoheart@karenhospital.org</a>
        <span>Mon-Fri: 8 AM - 5 PM</span>
        <span>Sat: 8 AM - 1 PM</span>
        <strong className="footerGiveTitle">Give offline</strong>
        <span>M-Pesa Paybill 517800</span>
        <span>Equity Bank 0180 2919 43847</span>
      </div>
    </footer>
  );
}
