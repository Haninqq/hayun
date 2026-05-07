'use client';

import { useState } from 'react';
import {
  Home,
  History,
  Settings,
  Bot,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const menuItems: SidebarItem[] = [
  { id: 'home', label: '홈', icon: <Home className="w-5 h-5" /> },
  { id: 'history', label: '이전 기록', icon: <History className="w-5 h-5" /> },
  { id: 'settings', label: '설정', icon: <Settings className="w-5 h-5" /> },
];

export function Sidebar() {
  const [activeItem, setActiveItem] = useState('home');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
        relative flex flex-col h-screen glass
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-[72px]' : 'w-64'}
        shrink-0
      `}
    >
      {/* Logo / App Name */}
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[oklch(0.7_0.18_270)] to-[oklch(0.6_0.2_240)] shadow-lg shadow-[oklch(0.7_0.18_270_/_0.2)]">
          <Bot className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="text-base font-bold gradient-text tracking-tight">
              HAIC Guide
            </h1>
            <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
              Human–AI Collaboration
            </p>
          </div>
        )}
      </div>

      <Separator className="opacity-30 mx-4" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <li
              key={item.id}
              className="animate-slide-in-left"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    id={`sidebar-${item.id}`}
                    onClick={() => setActiveItem(item.id)}
                    className={`
                      flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
                      text-sm font-medium transition-all duration-200
                      ${
                        activeItem === item.id
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm shadow-[oklch(0.7_0.18_270_/_0.1)]'
                          : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                      }
                      ${collapsed ? 'justify-center' : ''}
                    `}
                  >
                    <span
                      className={`transition-colors ${
                        activeItem === item.id
                          ? 'text-[oklch(0.75_0.18_270)]'
                          : ''
                      }`}
                    >
                      {item.icon}
                    </span>
                    {!collapsed && <span>{item.label}</span>}
                  </button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" sideOffset={10}>
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-4 pb-4">
        <Separator className="opacity-30 mb-4" />
        {!collapsed && (
          <div className="animate-fade-in text-[11px] text-muted-foreground/50 text-center">
            HAIC Guide v1.0
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        id="sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
        className="
          absolute -right-3 top-8
          w-6 h-6 rounded-full
          bg-sidebar-accent border border-sidebar-border
          flex items-center justify-center
          text-muted-foreground hover:text-foreground
          transition-all duration-200
          hover:scale-110
          shadow-md
        "
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>
    </aside>
  );
}
