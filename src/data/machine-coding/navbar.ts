import type { MachineCodingProblem } from '../../types';

export const navbarProblem: MachineCodingProblem = {
  id: 'mc-navbar',
  title: 'Responsive Navbar with Mobile Menu',
  difficulty: 'Intermediate',
  category: 'Machine Coding',
  tags: ['react', 'responsive', 'navigation', 'hamburger-menu', 'css', 'mobile-first'],

  problemStatement: `Build a responsive navigation bar component in React that displays a horizontal menu on desktop and collapses into a hamburger menu on mobile. The navbar should include a logo/brand section, navigation links, and optional action buttons (e.g., login/signup). This is a practical component that tests your understanding of responsive design, CSS media queries (or container queries), and mobile interaction patterns.

The mobile menu should slide in from the side or drop down with smooth animation. It must handle outside clicks to close, support keyboard navigation, and properly manage focus when opened. The navbar should support active link highlighting based on the current route and dropdown submenus for nested navigation. The component should be built without CSS frameworks, using plain CSS or CSS-in-JS.`,

  functionalRequirements: [
    'Horizontal nav links on desktop, hamburger menu on mobile',
    'Hamburger button toggles mobile menu open/close',
    'Close mobile menu on link click, outside click, or Escape key',
    'Active link highlighting based on current path',
    'Support dropdown submenus for nested navigation',
    'Sticky/fixed positioning at the top of the viewport',
    'Smooth open/close animation for mobile menu',
  ],

  nonFunctionalRequirements: [
    'Pure CSS responsive breakpoints (no resize event listeners)',
    'Accessible: proper ARIA attributes for navigation landmarks',
    'Focus trap within mobile menu when open',
    'Support for both client-side routing and anchor links',
  ],

  componentHierarchy: `Navbar
├── Brand/Logo
├── DesktopNav (hidden on mobile)
│   └── NavLink (repeated)
│       └── DropdownMenu (optional)
├── NavActions (login/signup buttons)
├── HamburgerButton (hidden on desktop)
└── MobileMenu (overlay + slide panel)
    ├── MobileNavLink (repeated)
    └── MobileNavActions`,

  stateDesign: `// State shape
interface NavbarState {
  isMobileMenuOpen: boolean;
  activeDropdown: string | null;  // which dropdown submenu is open
}

// isMobileMenuOpen toggles the mobile menu overlay.
// activeDropdown tracks which nav item's submenu is expanded.
// The current active path is compared against link hrefs for highlighting.
// CSS media queries handle the responsive layout switch.`,

  architecture: `The navbar uses CSS media queries to switch between desktop (horizontal links) and mobile (hamburger menu) layouts at a configurable breakpoint (default 768px). On desktop, nav links are displayed inline with hover-activated dropdown submenus. On mobile, the hamburger button toggles a full-height slide-out menu.

The mobile menu uses a combination of transform and opacity for its slide animation. An overlay backdrop captures outside clicks. Body scroll is locked when the mobile menu is open. The component accepts navigation items as a configuration array, making it easy to update the structure. Active link detection compares the current window.location.pathname against each link's href. Dropdown submenus use hover on desktop and click on mobile for consistent interaction patterns.`,

  implementation: `import React, { useState, useEffect, useRef, useCallback } from 'react';

interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

interface NavbarProps {
  brand: string;
  items: NavItem[];
  currentPath?: string;
}

const BREAKPOINT = 768;

export default function Navbar({ brand, items, currentPath = '/' }: NavbarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia(\`(max-width: \${BREAKPOINT}px)\`);
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);
    handler(mq);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  useEffect(() => {
    if (!isMobileOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileOpen]);

  const handleLinkClick = useCallback(() => {
    setIsMobileOpen(false);
    setOpenDropdown(null);
  }, []);

  const renderLink = (item: NavItem, mobile = false) => {
    const isActive = currentPath === item.href;
    const hasChildren = item.children && item.children.length > 0;
    const isDropdownOpen = openDropdown === item.label;

    return (
      <div
        key={item.label}
        style={{ position: 'relative' }}
        onMouseEnter={() => !mobile && hasChildren && setOpenDropdown(item.label)}
        onMouseLeave={() => !mobile && setOpenDropdown(null)}
      >
        <a
          href={item.href}
          onClick={(e) => {
            if (hasChildren && mobile) {
              e.preventDefault();
              setOpenDropdown(isDropdownOpen ? null : item.label);
            } else {
              handleLinkClick();
            }
          }}
          aria-current={isActive ? 'page' : undefined}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: mobile ? '14px 24px' : '8px 16px',
            textDecoration: 'none', fontSize: mobile ? 18 : 15, fontWeight: 500,
            color: isActive ? '#2563eb' : '#374151',
            borderBottom: !mobile && isActive ? '2px solid #2563eb' : '2px solid transparent',
            transition: 'color 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          {item.label}
          {hasChildren && <span style={{ fontSize: 10, marginLeft: 2 }}>▼</span>}
        </a>

        {hasChildren && isDropdownOpen && (
          <div style={{
            position: mobile ? 'static' : 'absolute',
            top: mobile ? undefined : '100%', left: 0,
            background: '#fff',
            border: mobile ? 'none' : '1px solid #e5e7eb',
            borderRadius: mobile ? 0 : 8,
            boxShadow: mobile ? 'none' : '0 8px 24px rgba(0,0,0,0.1)',
            padding: mobile ? '0 0 0 24px' : '8px 0',
            minWidth: 180, zIndex: 100,
          }}>
            {item.children!.map((child) => (
              <a
                key={child.label}
                href={child.href}
                onClick={handleLinkClick}
                style={{
                  display: 'block', padding: '10px 20px', textDecoration: 'none',
                  color: '#374151', fontSize: mobile ? 16 : 14,
                  transition: 'background 0.1s',
                }}
              >
                {child.label}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      style={{
        position: 'sticky', top: 0, zIndex: 1000,
        background: '#fff', borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: 60,
      }}>
        <a href="/" style={{ fontSize: 20, fontWeight: 700, textDecoration: 'none', color: '#111827' }}>
          {brand}
        </a>

        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {items.map((item) => renderLink(item))}
          </div>
        )}

        {isMobile && (
          <button
            onClick={() => setIsMobileOpen((o) => !o)}
            aria-expanded={isMobileOpen}
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            style={{
              background: 'none', border: 'none', fontSize: 24,
              cursor: 'pointer', padding: 8, display: 'flex',
              flexDirection: 'column', gap: 5, width: 32,
            }}
          >
            <span style={{
              display: 'block', width: 24, height: 2, background: '#374151',
              transition: 'transform 0.2s',
              transform: isMobileOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
            }} />
            <span style={{
              display: 'block', width: 24, height: 2, background: '#374151',
              opacity: isMobileOpen ? 0 : 1, transition: 'opacity 0.2s',
            }} />
            <span style={{
              display: 'block', width: 24, height: 2, background: '#374151',
              transition: 'transform 0.2s',
              transform: isMobileOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
            }} />
          </button>
        )}
      </div>

      {isMobile && (
        <>
          <div
            onClick={() => setIsMobileOpen(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
              zIndex: 998, opacity: isMobileOpen ? 1 : 0,
              pointerEvents: isMobileOpen ? 'auto' : 'none',
              transition: 'opacity 0.2s',
            }}
            aria-hidden="true"
          />
          <div
            ref={menuRef}
            style={{
              position: 'fixed', top: 60, right: 0, bottom: 0,
              width: 280, background: '#fff', zIndex: 999,
              transform: isMobileOpen ? 'translateX(0)' : 'translateX(100%)',
              transition: 'transform 0.3s ease',
              overflowY: 'auto', boxShadow: '-4px 0 16px rgba(0,0,0,0.1)',
              paddingTop: 8,
            }}
          >
            {items.map((item) => renderLink(item, true))}
          </div>
        </>
      )}
    </nav>
  );
}`,

  accessibility: `The navbar uses \`<nav>\` with \`role="navigation"\` and \`aria-label="Main navigation"\` for landmark identification. The hamburger button has \`aria-expanded\` and a descriptive \`aria-label\` that changes based on state. Active links use \`aria-current="page"\` for screen reader identification. The mobile menu overlay has \`aria-hidden="true"\` since it's decorative. Dropdown triggers indicate expandable content. All interactive elements are keyboard accessible. The mobile menu can be dismissed with the Escape key.`,

  performance: `Responsive breakpoint detection uses \`matchMedia\` API instead of resize event listeners, which is more efficient as it only fires at the breakpoint boundary. CSS transitions handle animations without JavaScript, leveraging GPU-accelerated transforms. The mobile menu remains in the DOM but is translated off-screen when closed, avoiding mount/unmount costs. Body scroll locking is handled via direct DOM manipulation in useEffect with cleanup. The nav items configuration array is typically static and doesn't require memoization.`,

  edgeCases: [
    'Window resize from mobile to desktop should close the mobile menu',
    'Clicking a link in the mobile menu should close the menu',
    'Very long nav item labels should truncate or wrap gracefully',
    'Deeply nested dropdown menus need careful positioning',
    'Touch devices need tap handling instead of hover for dropdowns',
  ],

  testingStrategy: [
    'Unit test: hamburger button toggles mobile menu visibility',
    'Unit test: clicking a link closes the mobile menu',
    'Unit test: Escape key closes the mobile menu',
    'Integration test: active link styling matches current path',
    'Integration test: dropdown submenu opens on hover (desktop) and click (mobile)',
    'Responsive test: layout switches at the breakpoint',
  ],

  improvements: [
    'Add search bar integration that expands on click',
    'Support mega menus for complex navigation structures',
    'Add notification badges on nav items',
    'Implement breadcrumb integration for nested pages',
    'Add theme toggle (light/dark) in the navbar',
  ],

  followUpQuestions: [
    'How would you handle accessibility for mega menu dropdowns?',
    'What are the trade-offs of CSS media queries vs container queries for responsive navbars?',
    'How would you integrate this navbar with a client-side router like React Router?',
    'How would you implement a scroll-hide navbar that reappears on scroll up?',
  ],
};
