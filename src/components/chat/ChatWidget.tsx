"use client";

// components/chat/ChatWidget.tsx
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { ChatNode, Locale } from "@/lib/chat/types";
import styles from "./ChatWidget.module.css";

const TYPING_MS = 480;

// TODO: move these into your i18n dictionary under `chat.*`.
const UI: Record<Locale, Record<string, string>> = {
  ar: {
    open: "افتح المحادثة",
    close: "إغلاق المحادثة",
    back: "رجوع",
    title: "مساعد هيونداي",
    subtitle: "إجابات سريعة، بدون انتظار",
    restart: "البدء من جديد",
    call: "اتصل",
  },
  en: {
    open: "Open chat",
    close: "Close chat",
    back: "Back",
    title: "Hyundai assistant",
    subtitle: "Quick answers, no waiting",
    restart: "Start over",
    call: "Call",
  },
  ku: {
    open: "کردنەوەی گفتوگۆ",
    close: "داخستنی گفتوگۆ",
    back: "گەڕانەوە",
    title: "یاریدەدەری هیوندای",
    subtitle: "وەڵامی خێرا، بێ چاوەڕوانی",
    restart: "دەستپێکردنەوە",
    call: "پەیوەندی",
  },
};

interface Props {
  tree: ChatNode;
  locale: Locale;
}

export default function ChatWidget({ tree, locale }: Props) {
  const t = UI[locale] ?? UI.en;

  const [open, setOpen] = useState(false);
  const [stack, setStack] = useState<ChatNode[]>([tree]);
  const [typing, setTyping] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLButtonElement>(null);

  const current = stack[stack.length - 1];
  const atRoot = stack.length === 1;

  /* ---------- navigation ---------- */

  const select = useCallback((child: ChatNode) => {
    setStack((prev) => [...prev, child]);
    setTyping(true);
  }, []);

  const goBack = useCallback(() => {
    setTyping(false);
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const restart = useCallback(() => {
    setTyping(false);
    setStack([tree]);
  }, [tree]);

  /* ---------- typing delay ---------- */

  useEffect(() => {
    if (!typing) return;
    const id = window.setTimeout(() => setTyping(false), TYPING_MS);
    return () => window.clearTimeout(id);
  }, [typing]);

  /* ---------- keep the newest message in view ---------- */

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !open) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [stack.length, typing, open]);

  /* ---------- escape to close, focus handoff ---------- */

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        bubbleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const toggle = () => {
    setOpen((wasOpen) => {
      if (wasOpen) bubbleRef.current?.focus();
      return !wasOpen;
    });
  };

  /* ---------- render ---------- */

  return (
    <div className={styles.root}>
      <div
        ref={panelRef}
        className={styles.panel}
        data-open={open}
        role="dialog"
        aria-modal="false"
        aria-label={t.title}
        tabIndex={-1}
        aria-hidden={!open}
      >
        <header className={styles.header}>
          {!atRoot && (
            <button type="button" className={styles.headerBtn} onClick={goBack} aria-label={t.back}>
              <ChevronIcon className={styles.backIcon} />
            </button>
          )}
          <div className={styles.headerTitle}>
            {t.title}
            <span className={styles.headerSub}>{t.subtitle}</span>
          </div>
          <button type="button" className={styles.headerBtn} onClick={toggle} aria-label={t.close}>
            <CloseIcon />
          </button>
        </header>

        <div className={styles.scroll} ref={scrollRef} aria-live="polite">
          {stack.map((node, i) => {
            const isLast = i === stack.length - 1;
            const hideBot = isLast && typing;

            return (
              <Fragment key={`${node.id}-${i}`}>
                {i > 0 && (
                  <div className={`${styles.row} ${styles.rowUser}`}>
                    <div className={`${styles.msg} ${styles.msgUser}`}>{node.label}</div>
                  </div>
                )}

                {!hideBot && (
                  <div className={`${styles.row} ${styles.rowBot}`}>
                    <div style={{ maxWidth: "85%" }}>
                      <div className={`${styles.msg} ${styles.msgBot}`} style={{ maxWidth: "100%" }}>
                        {node.message}
                      </div>

                      {(node.phones.length > 0 || node.link) && (
                        <div className={styles.cards}>
                          {node.phones.map((phone, n) => (
                            <a
                              key={phone}
                              href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                              className={`${styles.card} ${styles.cardPhone}`}
                              style={{ animationDelay: `${n * 50}ms` }}
                            >
                              <PhoneIcon />
                              {phone}
                            </a>
                          ))}

                          {node.link && (
                            <Link
                              href={`/${locale}${node.link.href}`}
                              className={styles.card}
                              onClick={() => setOpen(false)}
                              style={{ animationDelay: `${node.phones.length * 50}ms` }}
                            >
                              <ArrowIcon />
                              {node.link.label}
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Fragment>
            );
          })}

          {typing && (
            <div className={`${styles.row} ${styles.rowBot}`}>
              <div className={styles.typing} aria-label="…">
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
              </div>
            </div>
          )}
        </div>

        {!typing && (
          <div className={styles.options}>
            {current.options.map((child, i) => (
              <button
                key={child.id}
                type="button"
                className={styles.option}
                onClick={() => select(child)}
                style={{ animationDelay: `${i * 45}ms` }}
              >
                {child.label}
              </button>
            ))}
            {!atRoot && (
              <button type="button" className={styles.restart} onClick={restart}>
                {t.restart}
              </button>
            )}
          </div>
        )}
      </div>

      <button
        ref={bubbleRef}
        type="button"
        className={styles.bubble}
        data-open={open}
        onClick={toggle}
        aria-label={open ? t.close : t.open}
        aria-expanded={open}
      >
        <ChatIcon className={`${styles.icon} ${styles.iconChat}`} />
        <CloseIcon className={`${styles.icon} ${styles.iconClose}`} />
      </button>
    </div>
  );
}

/* ---------------- icons ---------------- */

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="m15 18-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
