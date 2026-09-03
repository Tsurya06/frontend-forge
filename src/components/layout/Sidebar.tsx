import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
  Code2,
  Component,
  Layers,
  Map,
  Flame,
  Terminal,
  BookOpen,
  Zap,
  Atom,
  FileCode2,
  Globe,
  Palette,
  Gauge,
  ShieldCheck,
  FlaskConical,
  Boxes,
  Award,
  Mic,
  CreditCard,
  HelpCircle,
  BarChart3,
  Bookmark,
} from "lucide-react";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  onNavigate?: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
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
      {
        label: "Problemset",
        path: "/coding",
        icon: <Code2 size={16} />,
        badge: "28",
      },
      {
        label: "Machine Coding",
        path: "/machine-coding",
        icon: <Component size={16} />,
        badge: "35",
      },
      {
        label: "System Design",
        path: "/system-design",
        icon: <Layers size={16} />,
        badge: "9",
      },
      {
        label: "Learning Roadmap",
        path: "/roadmap",
        icon: <Map size={16} />,
        badge: "8 Wks",
      },
      {
        label: "Daily Challenge",
        path: "/daily",
        icon: <Flame size={16} />,
      },
      {
        label: "Code Sandbox",
        path: "/playground",
        icon: <Terminal size={16} />,
        badge: "IDE",
      },
    ],
  },
  {
    title: "Curriculum Tracks",
    items: [
      {
        label: "All 85 Topics",
        path: "/topics",
        icon: <BookOpen size={16} />,
        badge: "85",
      },
      {
        label: "JavaScript Internals",
        path: "/javascript",
        icon: <Zap size={16} />,
      },
      {
        label: "React 19 & Hooks",
        path: "/react",
        icon: <Atom size={16} />,
      },
      {
        label: "TypeScript",
        path: "/typescript",
        icon: <FileCode2 size={16} />,
      },
      {
        label: "Browser & Web APIs",
        path: "/browser",
        icon: <Globe size={16} />,
      },
      {
        label: "CSS & Layouts",
        path: "/css",
        icon: <Palette size={16} />,
      },
      {
        label: "Performance & Vitals",
        path: "/performance",
        icon: <Gauge size={16} />,
      },
      {
        label: "Security & Defenses",
        path: "/security",
        icon: <ShieldCheck size={16} />,
      },
      {
        label: "Testing (Vitest/RTL)",
        path: "/testing",
        icon: <FlaskConical size={16} />,
      },
      {
        label: "Design Patterns",
        path: "/design-patterns",
        icon: <Boxes size={16} />,
      },
      {
        label: "Senior & Staff Guide",
        path: "/senior",
        icon: <Award size={16} />,
        badge: "Senior",
      },
    ],
  },
  {
    title: "Study Modes & Analytics",
    items: [
      {
        label: "Mock Interview",
        path: "/interview",
        icon: <Mic size={16} />,
      },
      {
        label: "Flashcards",
        path: "/flashcards",
        icon: <CreditCard size={16} />,
      },
      {
        label: "Quiz Mode",
        path: "/quiz",
        icon: <HelpCircle size={16} />,
      },
      {
        label: "My Progress",
        path: "/progress",
        icon: <BarChart3 size={16} />,
      },
      {
        label: "Bookmarks",
        path: "/bookmarks",
        icon: <Bookmark size={16} />,
      },
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
