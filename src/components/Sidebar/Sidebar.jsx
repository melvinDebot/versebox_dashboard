import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import PropTypes from "prop-types";
import { auth } from "../../../firebase";
import Logo from "../../images/logo/logo.svg";
import LogoIcon from "../../images/logo/logo-icon.svg";
import Icon from "../../ui/Icon";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { to: "/tables-user", label: "Utilisateurs", icon: "Users" },
  {
    to: "/tables-challenges/spiritualité",
    label: "Challenges",
    icon: "Sparkles",
    matches: (pathname) => pathname.startsWith("/tables-challenges"),
  },
  { to: "/tables-event", label: "Événements", icon: "CalendarHeart" },
  { to: "/tables-store", label: "Boutique", icon: "ShoppingBag" },
  { to: "/calendar", label: "Calendrier", icon: "Calendar" },
];

const CREATE_ITEMS = [
  { to: "/create-challenge", label: "Challenge", icon: "Trophy" },
  { to: "/create-event", label: "Événement", icon: "PartyPopper" },
  { to: "/create-product", label: "Produit", icon: "Gift" },
];

const NavItem = ({ to, label, icon, end, matches }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) => {
      const active = matches ? matches(window.location.pathname) : isActive;
      return [
        "group relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-200",
        active
          ? "bg-primary-500 text-secondary-900 shadow-soft"
          : "text-neutral-300 hover:bg-secondary-700 hover:text-white",
      ].join(" ");
    }}
  >
    <Icon name={icon} size="md" strokeWidth={1.8} />
    <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-pill bg-secondary-800 px-3 py-1.5 text-caption font-medium text-white opacity-0 shadow-lifted transition-opacity duration-150 group-hover:opacity-100 z-50">
      {label}
    </span>
  </NavLink>
);

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  end: PropTypes.bool,
  matches: PropTypes.func,
};

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      navigate("/");
    } catch (err) {
      console.error("Sign out failed", err);
    }
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-secondary-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-20 flex-col items-center bg-secondary-900 text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-20 w-full items-center justify-center">
          <NavLink to="/dashboard" aria-label="Versebox">
            <img
              src={LogoIcon || Logo}
              alt="Versebox"
              className="h-9 w-9 object-contain"
            />
          </NavLink>
        </div>

        <nav className="flex flex-1 flex-col items-center gap-2 py-4">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}

          <div className="my-3 h-px w-8 bg-secondary-700" />

          {CREATE_ITEMS.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>

        <div className="mb-5 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={handleSignOut}
            className="group relative flex h-12 w-12 items-center justify-center rounded-2xl text-neutral-300 transition-colors hover:bg-error-500/20 hover:text-error-300"
            aria-label="Déconnexion"
          >
            <Icon name="LogOut" size="md" strokeWidth={1.8} />
            <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-pill bg-secondary-800 px-3 py-1.5 text-caption font-medium text-white opacity-0 shadow-lifted transition-opacity duration-150 group-hover:opacity-100 z-50">
              Déconnexion
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

Sidebar.propTypes = {
  sidebarOpen: PropTypes.bool,
  setSidebarOpen: PropTypes.func,
};

export default Sidebar;
