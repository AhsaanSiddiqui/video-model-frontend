import { NavLink } from 'react-router-dom'
import {
  IconClock,
  IconFolder,
  IconHelpCircle,
  IconHome,
  IconLayoutDashboard,
  IconSettings,
  IconThumbsUp,
  IconUserPlus,
  IconVideo,
} from '../icons/OutlineIcons.jsx'

const primaryItems = [
  { label: 'Home', to: '/', end: true, icon: IconHome },
  { label: 'Liked Videos', to: '/liked', icon: IconThumbsUp },
  { label: 'History', to: '/history', icon: IconClock },
  { label: 'My content', to: '/my-content', icon: IconVideo },
  { label: 'Dashboard', to: '/dashboard', icon: IconLayoutDashboard },
  { label: 'Collection', to: '/collection', icon: IconFolder },
  { label: 'Subscribers', to: '/subscribers', icon: IconUserPlus },
]

const secondaryItems = [
  { label: 'Support', to: '/support', icon: IconHelpCircle },
  { label: 'Settings', to: '/settings', icon: IconSettings },
]

function NavItem({ label, to, end, icon: Icon, collapsed }) {
  const baseClass =
    'cursor-pointer border border-play-border bg-transparent text-play-foreground transition hover:bg-play-surface-elevated focus-visible:outline focus-visible:ring-2 focus-visible:ring-play-ring focus-visible:ring-offset-2 focus-visible:ring-offset-play-canvas'
  const collapsedClass = 'flex size-10 items-center justify-center rounded-md'
  const expandedClass = 'flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left text-sm font-medium'

  return (
    <NavLink
      to={to}
      end={end}
      title={label}
      aria-label={label}
      className={({ isActive }) =>
        [baseClass, collapsed ? collapsedClass : expandedClass, isActive ? 'bg-play-surface-elevated ring-1 ring-inset ring-play-primary' : ''].join(' ')
      }
    >
      <Icon />
      {!collapsed ? <span>{label}</span> : null}
    </NavLink>
  )
}

export function AppSidebar({ collapsed = true }) {
  return (
    <aside
      className={[
        'hidden h-full min-h-0 shrink-0 flex-col overflow-hidden border-r border-play-border bg-play-canvas py-3 transition-[width] duration-200 md:flex',
        collapsed ? 'w-play-sidebar items-center px-0' : 'w-72 px-3',
      ].join(' ')}
    >
      <nav className={['flex w-full flex-col gap-2', collapsed ? 'items-center' : 'items-stretch'].join(' ')} aria-label="Main">
        {primaryItems.map(({ label, to, end, icon }) => (
          <NavItem key={to} label={label} to={to} end={end} icon={icon} collapsed={collapsed} />
        ))}
      </nav>
      <div className="min-h-6 flex-1" aria-hidden />
      <nav
        className={['flex w-full flex-col gap-2 border-t border-play-border-subtle pt-3', collapsed ? 'items-center' : 'items-stretch'].join(' ')}
        aria-label="Help and settings"
      >
        {secondaryItems.map(({ label, to, icon }) => (
          <NavItem key={to} label={label} to={to} icon={icon} collapsed={collapsed} />
        ))}
      </nav>
    </aside>
  )
}
