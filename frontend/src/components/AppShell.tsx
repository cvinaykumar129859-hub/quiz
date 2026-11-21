import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BookOpenCheck, ChartNoAxesCombined, House, Info, LogOut, Menu, UserRound, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function AppShell() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const links = [
    { to: '/', label: 'Home', icon: House },
    { to: '/about', label: 'About', icon: Info },
    { to: '/categories', label: 'Quizzes', icon: BookOpenCheck, auth: true },
    { to: '/history', label: 'History', icon: ChartNoAxesCombined, auth: true },
    { to: '/profile', label: 'Profile', icon: UserRound, auth: true }
  ].filter(item => !item.auth || user);
  async function signOut() { await logout(); navigate('/'); setOpen(false); }
  return <div className="app-shell">
    <header className="topbar">
      <NavLink to="/" className="brand"><span className="brand-mark"><BookOpenCheck size={19} /></span><span>quiz<span className="brand-accent">master</span></span></NavLink>
      <button className="icon-button mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button>
      <nav className={`topnav ${open ? 'topnav-open' : ''}`}>
        {links.slice(0, 3).map(({ to, label }) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>{label}</NavLink>)}
        <div className="nav-session">{user ? <><span className="nav-user">{user.username}</span><button className="nav-link signout" onClick={signOut}><LogOut size={15} /> Logout</button></> : <><NavLink className="nav-link" to="/login">Login</NavLink><NavLink className="button button-small" to="/register">Get started <span aria-hidden="true">↗</span></NavLink></>}</div>
      </nav>
    </header>
    <aside className="side-rail"><span className="rail-label">WORKSPACE</span>{links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} title={label} className={({ isActive }) => isActive ? 'rail-link active' : 'rail-link'}><Icon size={18} /><span>{label}</span></NavLink>)}{user && <button className="rail-link rail-logout" onClick={signOut}><LogOut size={18} /><span>Sign out</span></button>}<div className="rail-note"><span className="signal-dot" />Learning in progress<span>Keep your momentum going.</span></div></aside>
    <main className="main-content"><Outlet /></main>
    <footer className="site-footer"><span>© {new Date().getFullYear()} QuizMaster</span><span>Make every answer count.</span></footer>
  </div>;
}
