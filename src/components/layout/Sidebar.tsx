import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  onNavigate?: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    title: "Core Practice",
    items: [
      { label: "Problemset", path: "/coding", icon: "💻", badge: "28" },
      {
        label: "Machine Coding",
        path: "/machine-coding",
        icon: "🏗️",
        badge: "35",
      },
      {
        label: "System Design",
        path: "/system-design",
        icon: "📐",
        badge: "9",
      },
      {
        label: "Learning Roadmap",
        path: "/roadmap",
        icon: "🗺️",
        badge: "8 Wks",
      },
      { label: "Daily Challenge", path: "/daily", icon: "⚡" },
      { label: "Code Sandbox", path: "/playground", icon: "🛠️", badge: "IDE" },
    ],
  },
  {
    title: "Curriculum Tracks",
    items: [
      { label: "All 85 Topics", path: "/topics", icon: "📚", badge: "85" },
      { label: "JavaScript Internals", path: "/javascript", icon: "⚡" },
      { label: "React 19 & Hooks", path: "/react", icon: "⚛️" },
      { label: "TypeScript", path: "/typescript", icon: "📘" },
      { label: "Browser & Web APIs", path: "/browser", icon: "🌐" },
      { label: "CSS & Layouts", path: "/css", icon: "🎨" },
      { label: "Performance & Vitals", path: "/performance", icon: "🚀" },
      { label: "Security & Defenses", path: "/security", icon: "🔒" },
      { label: "Testing (Vitest/RTL)", path: "/testing", icon: "🧪" },
      { label: "Design Patterns", path: "/design-patterns", icon: "📐" },
      {
        label: "Senior & Staff Guide",
        path: "/senior",
        icon: "👔",
        badge: "Senior",
      },
    ],
  },
  {
    title: "Study Modes & Analytics",
    items: [
      { label: "Mock Interview", path: "/interview", icon: "🎙️" },
      { label: "Flashcards", path: "/flashcards", icon: "📇" },
      { label: "Quiz Mode", path: "/quiz", icon: "❓" },
      { label: "My Progress", path: "/progress", icon: "📊" },
      { label: "Bookmarks", path: "/bookmarks", icon: "⭐" },
      { label: "Settings", path: "/settings", icon: "⚙️" },
    ],
  },
];

export function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <nav className={styles.sidebar} aria-label="Curriculum Navigation">
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
