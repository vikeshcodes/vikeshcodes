"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

interface Notification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  link?: string;
  created_at: string;
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/v1/accounts/notifications/");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unread_count);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Refresh notifications every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id: number) => {
    try {
      const res = await fetch(`/api/v1/accounts/notifications/${id}/read/`, {
        method: "POST",
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Logic for marking all as read (sequentially for now, or we could add a bulk backend endpoint)
      const unread = notifications.filter(n => !n.is_read).map(n => n.id);
      await Promise.all(unread.map(id => fetch(`/api/v1/accounts/notifications/${id}/read/`, { method: "POST" })));
      
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-white/70 transition-all hover:border-[var(--accent)] hover:bg-white"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-[var(--muted)]" />
        {unreadCount > 0 && (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-80 origin-top-right rounded-3xl border border-[var(--line)] bg-white/90 shadow-2xl backdrop-blur-xl transition-all"
          >
            <div className="p-4 border-b border-[var(--line)] flex items-center justify-between">
              <h3 className="font-bold text-sm">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-[10px] uppercase tracking-widest font-bold text-[var(--accent)] hover:opacity-70 transition-opacity"
                  >
                    Mark all read
                  </button>
                )}
                <span className="text-[10px] uppercase tracking-widest text-[var(--muted)]">
                  {unreadCount} Unread
                </span>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto overflow-x-hidden p-2 custom-scrollbar">
              {notifications.length > 0 ? (
                <div className="grid gap-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={clsx(
                        "group relative rounded-2xl p-3 transition-colors hover:bg-[var(--line)]",
                        !n.is_read && "bg-accent/5"
                      )}
                    >
                      <div className="flex gap-3">
                        <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[var(--accent)] opacity-40 group-hover:opacity-100" />
                        <div className="space-y-1">
                          <p className={clsx("text-sm font-semibold leading-tight", n.is_read && "text-[var(--muted)]")}>
                            {n.title}
                          </p>
                          <p className="text-xs text-[var(--muted)] line-clamp-2">
                            {n.message}
                          </p>
                          <p className="text-[10px] text-[var(--muted)] opacity-60">
                            {new Date(n.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      
                      {!n.is_read && (
                        <button
                          onClick={() => markAsRead(n.id)}
                          className="absolute right-3 top-3 rounded-full bg-[var(--line)] p-1 opacity-0 transition-opacity group-hover:opacity-100"
                          title="Mark as read"
                        >
                          <Check className="h-3 w-3" />
                        </button>
                      )}
                      
                      {n.link && (
                        <a href={n.link} className="absolute inset-0 z-0" onClick={() => setIsOpen(false)} />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 rounded-full bg-[var(--line)] p-4">
                    <Info className="h-6 w-6 text-[var(--muted)]" />
                  </div>
                  <p className="text-sm font-medium text-[var(--muted)]">No notifications yet</p>
                  <p className="text-xs text-[var(--muted)] opacity-60">
                    Stay tuned for updates.
                  </p>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-[var(--line)] text-center">
              <button
                className="text-[10px] uppercase tracking-widest font-bold hover:text-[var(--accent)] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Close Panel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
