import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { auth } from "../../../firebase";
import { useTheme } from "../../context/ThemeContext";
import { useFirebase } from "../../context/FirebaseContext";
import Icon from "../../ui/Icon";
import Avatar from "../../ui/Avatar";
import Badge from "../../ui/Badge";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { theme, toggleTheme } = useTheme();
  const { users, dataNavBar } = useFirebase();
  const [authUser, setAuthUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(setAuthUser);
    return () => unsub();
  }, []);

  const isDark = theme === "dark";
  const totalUsers = Array.isArray(users) ? users.length : 0;
  const isGameActive = Boolean(dataNavBar?.isActivated);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-neutral-200 bg-white/85 px-4 py-3 backdrop-blur-md transition-colors duration-300 dark:border-secondary-700 dark:bg-secondary-800/85 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-pill text-ink transition-colors hover:bg-neutral-100 dark:hover:bg-secondary-700 lg:hidden"
          aria-label="Ouvrir le menu"
        >
          <Icon name={sidebarOpen ? "X" : "Menu"} size="md" />
        </button>

        <div className="hidden items-center gap-2 rounded-pill bg-primary-50 px-3 py-1.5 text-body-sm font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-200 sm:inline-flex">
          <span className="text-display-md leading-none">{totalUsers}</span>
          <span>utilisateurs inscrits</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Badge variant={isGameActive ? "success" : "neutral"} dot>
          {isGameActive ? "Game active" : "Game inactive"}
        </Badge>

        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex h-10 w-10 items-center justify-center rounded-pill text-ink transition-colors hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 dark:hover:bg-secondary-700"
          aria-label={isDark ? "Mode clair" : "Mode sombre"}
          title={isDark ? "Mode clair" : "Mode sombre"}
        >
          <Icon name={isDark ? "Sun" : "Moon"} size="md" />
        </button>

        <button
          type="button"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-pill text-ink transition-colors hover:bg-neutral-100 dark:hover:bg-secondary-700"
          aria-label="Notifications"
        >
          <Icon name="Bell" size="md" />
        </button>

        <div className="flex items-center gap-3 pl-2">
          <div className="hidden text-right sm:block">
            <p className="text-body-sm font-medium text-ink">
              {authUser?.displayName || authUser?.email?.split("@")[0] || "Admin"}
            </p>
            <p className="text-caption text-ink-muted">Administrateur</p>
          </div>
          <Avatar
            src={authUser?.photoURL}
            name={authUser?.displayName || authUser?.email || "Admin"}
            size="md"
          />
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
};

export default Header;
