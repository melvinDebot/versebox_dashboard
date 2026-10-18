import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase";
import { useTheme } from "../../context/ThemeContext";
import { useFirebase } from "../../context/FirebaseContext";
import Icon from "../../ui/Icon";
import Avatar from "../../ui/Avatar";
import { countLivePromoCodes } from "../../utils/promoCodes";

const PROMO_PILL_STYLES = {
  live: "bg-success-50 text-success-700 hover:bg-success-100 dark:bg-success-900/30 dark:text-success-300",
  idle: "bg-warning-50 text-warning-900 hover:bg-warning-100 dark:bg-warning-900/30 dark:text-warning-300",
  off: "bg-neutral-100 text-ink-muted hover:bg-neutral-200 dark:bg-secondary-700 dark:hover:bg-secondary-600",
};

const DOT_STYLES = {
  live: "bg-success-500",
  idle: "bg-warning-500",
  off: "bg-neutral-400",
};

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { theme, toggleTheme } = useTheme();
  const { users, featuresFlag, getListCodes } = useFirebase();
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(setAuthUser);
    return () => unsub();
  }, []);

  const isDark = theme === "dark";
  const totalUsers = Array.isArray(users) ? users.length : 0;
  const promoEnabled = Boolean(featuresFlag?.promoCodes);
  const livePromoCodes = countLivePromoCodes(getListCodes);
  const promoState = !promoEnabled ? "off" : livePromoCodes > 0 ? "live" : "idle";
  const promoLabel = promoEnabled ? "Codes promo activés" : "Codes promo désactivés";
  const promoDetail = !promoEnabled
    ? "Masqués dans l'app"
    : livePromoCodes > 0
      ? `${livePromoCodes} code${livePromoCodes > 1 ? "s" : ""} en cours`
      : "Aucun code en cours";

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
        <button
          type="button"
          onClick={() => navigate("/dashboard#promo-codes")}
          title={`${promoLabel} · ${promoDetail}`}
          aria-label={`${promoLabel}, ${promoDetail}. Gérer les codes promo`}
          className={`inline-flex items-center gap-2 rounded-pill px-3 py-1.5 text-body-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${PROMO_PILL_STYLES[promoState]}`}
        >
          <span className="relative flex h-2 w-2">
            {promoState === "live" && (
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${DOT_STYLES[promoState]}`}
              />
            )}
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${DOT_STYLES[promoState]}`}
            />
          </span>
          <Icon name={promoEnabled ? "TicketPercent" : "TicketX"} size="sm" />
          <span className="hidden md:inline">{promoLabel}</span>
          <span className="hidden text-caption opacity-80 lg:inline">
            · {promoDetail}
          </span>
        </button>

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
