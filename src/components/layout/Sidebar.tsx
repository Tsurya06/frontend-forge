import { NavLink, Link } from "react-router-dom";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  onNavigate?: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: string;
  isNew?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", path: "/", icon: "◈" },
      { label: "Learning Roadmap", path: "/roadmap", icon: "🗺️", badge: "8 Weeks" },
      { label: "Daily Challenge", path: "/daily", icon: "⚡" },
    ],
  },
  {
    title: "Curriculum",
    items: [
      { label: "All 85 Topics", path: "/topics", icon: "📚", badge: "85" },
      { label: "JavaScript", path: "/javascript", icon: "⚡" },
      { label: "React 19", path: "/react", icon: "⚛️" },
      { label: "TypeScript", path: "/typescript", icon: "📘" },
      { label: "Browser & Web", path: "/browser", icon: "🌐" },
      { label: "HTML5", path: "/html", icon: "📄" },
      { label: "CSS & Layout", path: "/css", icon: "🎨" },
      { label: "Redux & State", path: "/redux", icon: "🔄" },
      { label: "Performance", path: "/performance", icon: "🚀" },
      { label: "Security", path: "/security", icon: "🔒" },
      { label: "Testing", path: "/testing", icon: "🧪" },
      { label: "Design Patterns", path: "/design-patterns", icon: "📐" },
    ],
  },
  {
    title: "Engineering & Tools",
    items: [
      { label: "Git & VCS", path: "/git", icon: "📦" },
      { label: "Build Tools", path: "/build-tools", icon: "🔧" },
      { label: "Package Management", path: "/package-management", icon: "📦" },
      { label: "Code Quality", path: "/code-quality", icon: "✨" },
      { label: "Accessibility (a11y)", path: "/accessibility", icon: "♿" },
    ],
  },
  {
    title: "Practice & Sandbox",
    items: [
      { label: "Code Playground", path: "/playground", icon: "🛠️", badge: "IDE" },
      { label: "Essential 28 JS & Polyfills", path: "/coding", icon: "⚡", badge: "37" },
      { label: "Machine Coding", path: "/machine-coding", icon: "🏗️", badge: "35" },
      { label: "System Design", path: "/system-design", icon: "📐", badge: "9" },
      { label: "Staff Architecture", path: "/senior", icon: "👔" },
    ],
  },
  {
    title: "Review & Analytics",
    items: [
      { label: "Skill Assessment", path: "/interview", icon: "🎯" },
      { label: "Quiz Mode", path: "/quiz", icon: "❓" },
      { label: "Flashcards", path: "/flashcards", icon: "🧠" },
      { label: "Bookmarks", path: "/bookmarks", icon: "🔖" },
      { label: "Progress", path: "/progress", icon: "📊" },
      { label: "Settings", path: "/settings", icon: "⚙️" },
    ],
  },
];

export function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <nav className={styles.sidebar} aria-label="Main navigation">
      <Link to="/" className={styles.logo}>
        <div className={styles.logoBadge}>
          <span className={styles.logoIcon}>⚡</span>
        </div>
        <div className={styles.logoTextGroup}>
          <span className={styles.logoTitle}>FrontendForge</span>
          <span className={styles.logoSubtitle}>Architecture & Engineering Hub</span>
        </div>
      </Link>

      <div className={styles.nav}>
        {sections.map((section) => (
          <div key={section.title} className={styles.section}>
            <div className={styles.sectionLabel}>{section.title}</div>
            <div className={styles.sectionItems}>
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ""}`
                  }
                  onClick={onNavigate}
                >
                  <span className={styles.navIcon} aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className={styles.navLabel}>{item.label}</span>
                  {item.badge && (
                    <span className={styles.itemBadge}>{item.badge}</span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
}
