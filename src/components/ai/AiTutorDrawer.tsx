import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Sparkles,
  X,
  Settings,
  Trash2,
  ChevronDown,
  ChevronUp,
  Send,
  Square,
  Key,
  ExternalLink,
  Cpu,
  Plus,
  Clock,
  ArrowDown,
  AlertTriangle,
  Maximize2,
  Minimize2,
  Pencil,
} from "lucide-react";
import { useAiTutor } from "@/hooks/useAiTutor";
import type { ChatMessage } from "@/services/ai";
import { AiMarkdown } from "./AiMarkdown";
import styles from "./AiTutorDrawer.module.css";

export function AiTutorDrawer() {
  const {
    isOpen,
    setIsOpen,
    isSettingsOpen,
    setIsSettingsOpen,
    isHistoryOpen,
    setIsHistoryOpen,
    showLimitWarning,
    setShowLimitWarning,
    oldestSessionTitle,
    sessions,
    activeSessionId,
    createNewChat,
    confirmCreateNewChat,
    switchSession,
    deleteSession,
    clearAllSessions,
    activeContext,
    updateConfig,
    messages,
    isLoading,
    error,
    hasConfiguredProvider,
    sendMessage,
    editUserMessage,
    clearChat,
    cancelStream,
  } = useAiTutor();

  const [inputVal, setInputVal] = useState("");
  const [showContextDetails, setShowContextDetails] = useState(false);
  // Manual override key input (kept empty if using .env.local to avoid exposing raw key in DOM)
  const [keyOverride, setKeyOverride] = useState("");
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);

  // Message inline editing state (like ChatGPT)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  // Panel dimensions and Fullscreen state
  const [panelSize, setPanelSize] = useState<{ width: number; height: number }>(() => {
    if (typeof window === "undefined") return { width: 460, height: 700 };
    try {
      const saved = localStorage.getItem("feeq-ai-panel-dimensions");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.width === "number" && typeof parsed.height === "number") {
          return {
            width: Math.min(Math.max(380, parsed.width), window.innerWidth - 32),
            height: Math.min(Math.max(460, parsed.height), window.innerHeight - 32),
          };
        }
      }
    } catch {}
    return {
      width: Math.min(460, window.innerWidth - 32),
      height: Math.min(700, window.innerHeight - 48),
    };
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const isDraggingResizeRef = useRef<"corner" | "top" | "left" | null>(null);
  const dragStartRef = useRef<{ startX: number; startY: number; startW: number; startH: number }>({
    startX: 0,
    startY: 0,
    startW: 0,
    startH: 0,
  });

  const handleResizeStart = (
    direction: "corner" | "top" | "left",
    e: React.MouseEvent
  ) => {
    if (isFullscreen) return;
    e.preventDefault();
    e.stopPropagation();
    isDraggingResizeRef.current = direction;
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: panelSize.width,
      startH: panelSize.height,
    };
    document.body.style.userSelect = "none";
    document.body.style.cursor =
      direction === "corner" ? "nwse-resize" : direction === "top" ? "ns-resize" : "ew-resize";

    const handleMouseMove = (moveEvt: MouseEvent) => {
      if (!isDraggingResizeRef.current) return;
      const { startX, startY, startW, startH } = dragStartRef.current;
      const deltaX = startX - moveEvt.clientX;
      const deltaY = startY - moveEvt.clientY;

      setPanelSize((prev) => {
        let newW = prev.width;
        let newH = prev.height;

        if (isDraggingResizeRef.current === "left" || isDraggingResizeRef.current === "corner") {
          newW = Math.min(Math.max(380, startW + deltaX), window.innerWidth - 32);
        }

        if (isDraggingResizeRef.current === "top" || isDraggingResizeRef.current === "corner") {
          newH = Math.min(Math.max(460, startH + deltaY), window.innerHeight - 32);
        }

        return { width: newW, height: newH };
      });
    };

    const handleMouseUp = () => {
      isDraggingResizeRef.current = null;
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      setPanelSize((curr) => {
        try {
          localStorage.setItem("feeq-ai-panel-dimensions", JSON.stringify(curr));
        } catch {}
        return curr;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchResizeStart = (
    direction: "corner" | "top" | "left",
    e: React.TouchEvent
  ) => {
    if (isFullscreen || !e.touches[0]) return;
    const touch = e.touches[0];
    isDraggingResizeRef.current = direction;
    dragStartRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startW: panelSize.width,
      startH: panelSize.height,
    };

    const handleTouchMove = (moveEvt: TouchEvent) => {
      if (!isDraggingResizeRef.current || !moveEvt.touches[0]) return;
      const t = moveEvt.touches[0];
      const deltaX = dragStartRef.current.startX - t.clientX;
      const deltaY = dragStartRef.current.startY - t.clientY;

      setPanelSize((prev) => {
        let newW = prev.width;
        let newH = prev.height;

        if (isDraggingResizeRef.current === "left" || isDraggingResizeRef.current === "corner") {
          newW = Math.min(Math.max(380, dragStartRef.current.startW + deltaX), window.innerWidth - 32);
        }

        if (isDraggingResizeRef.current === "top" || isDraggingResizeRef.current === "corner") {
          newH = Math.min(Math.max(460, dragStartRef.current.startH + deltaY), window.innerHeight - 32);
        }

        return { width: newW, height: newH };
      });
    };

    const handleTouchEnd = () => {
      isDraggingResizeRef.current = null;
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      setPanelSize((curr) => {
        try {
          localStorage.setItem("feeq-ai-panel-dimensions", JSON.stringify(curr));
        } catch {}
        return curr;
      });
    };

    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
  };

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesAreaRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const isUserScrolledUpRef = useRef<boolean>(false);

  // Check if key is already loaded from .env.local
  const hasEnvKey = Boolean(
    typeof import.meta !== "undefined" && import.meta.env?.VITE_NVIDIA_API_KEY
  );

  // Scroll listener to detect when user manually scrolls
  const handleMessagesScroll = useCallback(() => {
    const el = messagesAreaRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceFromBottom <= 20) {
      // User reached the bottom: re-enable auto-scroll
      isUserScrolledUpRef.current = false;
      setShowScrollBottomBtn(false);
    } else if (distanceFromBottom > 40) {
      // User scrolled away from bottom: disable auto-scroll
      isUserScrolledUpRef.current = true;
      setShowScrollBottomBtn(true);
    }
  }, []);

  // Detect user gesture upward (wheel or touch) immediately
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.deltaY < 0) {
      // User is scrolling up with mouse/trackpad: instantly freeze auto-scroll
      isUserScrolledUpRef.current = true;
      setShowScrollBottomBtn(true);
    }
  }, []);

  const touchStartYRef = useRef<number | null>(null);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const firstTouch = e.touches[0];
    touchStartYRef.current = firstTouch ? firstTouch.clientY : null;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const firstTouch = e.touches[0];
    if (touchStartYRef.current !== null && firstTouch) {
      const delta = firstTouch.clientY - touchStartYRef.current;
      if (delta > 0) {
        // Swiping down to see earlier content (scrolling up)
        isUserScrolledUpRef.current = true;
        setShowScrollBottomBtn(true);
      }
    }
  }, []);

  // Auto-scroll to bottom ONLY if user hasn't scrolled up
  useEffect(() => {
    if (isOpen && !isSettingsOpen && !isHistoryOpen) {
      if (!isUserScrolledUpRef.current) {
        const el = messagesAreaRef.current;
        if (el) {
          // Instant direct scroll avoids smooth animation loop fighting against trackpad/wheel
          el.scrollTop = el.scrollHeight;
        }
      }
    }
  }, [messages, isOpen, isSettingsOpen, isHistoryOpen]);

  // Jump to bottom handler
  const handleScrollToBottom = () => {
    isUserScrolledUpRef.current = false;
    setShowScrollBottomBtn(false);
    const el = messagesAreaRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  };

  // Focus textarea when opened
  useEffect(() => {
    if (isOpen && !isSettingsOpen && !isHistoryOpen) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen, isSettingsOpen, isHistoryOpen]);

  const handleSend = () => {
    if (!inputVal.trim() || isLoading) return;
    isUserScrolledUpRef.current = false;
    setShowScrollBottomBtn(false);
    sendMessage(inputVal);
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickChip = (chipPrompt: string) => {
    isUserScrolledUpRef.current = false;
    setShowScrollBottomBtn(false);
    sendMessage(chipPrompt);
  };

  const handleSaveSettings = () => {
    const updates: Partial<{ apiKey: string }> = {};
    if (keyOverride.trim()) {
      updates.apiKey = keyOverride.trim();
    }
    updateConfig(updates);
    setIsSettingsOpen(false);
  };

  // If closed, render only the floating trigger button
  if (!isOpen) {
    return (
      <button
        type="button"
        className={styles.fabTrigger}
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Tutor"
        title="Open AI Tutor (Cmd+J / Ctrl+J)"
      >
        <Sparkles size={16} className={styles.fabSparkle} />
        <span>Ask AI Tutor</span>
        <span className={styles.fabShortcut}>⌘J</span>
      </button>
    );
  }

  return (
    <div
      className={`${styles.aiPanelContainer} ${isFullscreen ? styles.aiPanelFullscreen : ""}`}
      style={
        isFullscreen
          ? undefined
          : {
              width: `${panelSize.width}px`,
              height: `${panelSize.height}px`,
            }
      }
      role="dialog"
      aria-label="FrontendForge AI Tutor"
    >
      {/* ── Resizing Handles (Top, Left, Top-Left Corner) ── */}
      {!isFullscreen && (
        <>
          <div
            className={styles.resizeHandleTop}
            onMouseDown={(e) => handleResizeStart("top", e)}
            onTouchStart={(e) => handleTouchResizeStart("top", e)}
            title="Drag to resize height"
          />
          <div
            className={styles.resizeHandleLeft}
            onMouseDown={(e) => handleResizeStart("left", e)}
            onTouchStart={(e) => handleTouchResizeStart("left", e)}
            title="Drag to resize width"
          />
          <div
            className={styles.resizeHandleCorner}
            onMouseDown={(e) => handleResizeStart("corner", e)}
            onTouchStart={(e) => handleTouchResizeStart("corner", e)}
            title="Drag corner to resize chat width and height"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <circle cx="2" cy="2" r="1" />
              <circle cx="2" cy="6" r="1" />
              <circle cx="6" cy="2" r="1" />
              <circle cx="2" cy="10" r="1" />
              <circle cx="6" cy="6" r="1" />
              <circle cx="10" cy="2" r="1" />
            </svg>
          </div>
        </>
      )}

      {/* ── 10-Chat Limit Warning Modal Overlay ── */}
      {showLimitWarning && (
        <div className={styles.warningOverlay} role="alertdialog">
          <div className={styles.warningBox}>
            <div className={styles.warningHeaderRow}>
              <AlertTriangle size={18} />
              <span>Chat History Limit (10/10)</span>
            </div>
            <p className={styles.warningText}>
              FrontendForge maintains up to <strong>10 saved chats</strong>. Starting a new chat now will permanently delete your oldest chat:
            </p>
            <div className={styles.warningOldestQuote}>
              &ldquo;{oldestSessionTitle}&rdquo;
            </div>
            <p className={styles.warningText}>
              Do you want to proceed and start a new chat?
            </p>
            <div className={styles.warningActionsRow}>
              <button
                type="button"
                className={styles.warningCancelBtn}
                onClick={() => setShowLimitWarning(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.warningConfirmBtn}
                onClick={confirmCreateNewChat}
              >
                Delete Oldest & Start New
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <header className={styles.panelHeader}>
        <div className={styles.headerTitleRow}>
          <Sparkles size={18} className={styles.aiLogoIcon} />
          <h3 className={styles.headerTitle}>Forge AI Tutor</h3>
        </div>

        <div className={styles.headerControls}>
          {/* New Chat Button */}
          <button
            type="button"
            className={styles.newChatBtn}
            onClick={createNewChat}
            title="Start a new chat (Max 10 maintained)"
            aria-label="New Chat"
          >
            <Plus size={13} />
            <span>New Chat</span>
          </button>

          {/* History / Sessions Button */}
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => {
              setIsHistoryOpen(!isHistoryOpen);
              if (isSettingsOpen) setIsSettingsOpen(false);
            }}
            title={`View Chat History (${sessions.length}/10 saved)`}
            aria-label="Chat History"
          >
            <Clock size={15} />
            <span className={styles.historyCountBadge}>{sessions.length}</span>
          </button>

          {/* Fullscreen / Maximize Toggle Button */}
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Fullscreen (Restore size)" : "Full Screen"}
            aria-label={isFullscreen ? "Exit Fullscreen" : "Full Screen"}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>

          {/* Settings Button */}
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => {
              setIsSettingsOpen(!isSettingsOpen);
              if (isHistoryOpen) setIsHistoryOpen(false);
            }}
            title="AI Settings"
            aria-label="AI Settings"
          >
            <Settings size={15} />
          </button>

          {/* Clear Current Chat Button */}
          <button
            type="button"
            className={styles.iconBtn}
            onClick={clearChat}
            title="Clear Current Chat"
            aria-label="Clear Current Chat"
          >
            <Trash2 size={15} />
          </button>

          {/* Close Drawer Button */}
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => setIsOpen(false)}
            title="Close Drawer (Esc)"
            aria-label="Close Drawer"
          >
            <X size={16} />
          </button>
        </div>
      </header>

      {/* ── Active Context Bar ── */}
      <div className={styles.contextBar}>
        <button
          type="button"
          className={styles.contextSummaryPill}
          onClick={() => setShowContextDetails(!showContextDetails)}
          title="Click to view live context details captured for this page"
        >
          <div className={styles.contextPillLeft}>
            <span className={styles.contextDot} />
            <span className={styles.contextTitleText}>
              {activeContext.title}
              {activeContext.subtitle ? ` · ${activeContext.subtitle}` : ""}
            </span>
          </div>
          <span className={styles.contextChevron}>
            {showContextDetails ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </span>
        </button>

        {showContextDetails && (
          <div className={styles.contextDrawerContent}>
            <div className={styles.contextDetailsTitle}>Live Page Context:</div>
            <div>{activeContext.summary}</div>
            {activeContext.selectedText && (
              <div className={styles.contextHighlightBox}>
                <strong>Selected Text:</strong> &ldquo;{activeContext.selectedText}&rdquo;
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── History Panel (When toggled) ── */}
      {isHistoryOpen ? (
        <div className={styles.historyPanel}>
          <div className={styles.historyHeaderRow}>
            <h4 className={styles.historyTitle}>Saved Chat History</h4>
            <span className={styles.historyLimitPill}>{sessions.length} / 10 Chats</span>
          </div>
          <p style={{ fontSize: "0.75rem", color: "#9ca3af", margin: "0 0 8px 0", lineHeight: 1.4 }}>
            Up to 10 chats are maintained in history. Your active chat stays open after page refresh. Click &ldquo;New Chat&rdquo; above to start a fresh conversation.
          </p>

          <div className={styles.sessionsList}>
            {sessions.map((sess) => {
              const isActive = sess.id === activeSessionId;
              const dateStr = new Date(sess.updatedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={sess.id}
                  className={`${styles.sessionItem} ${isActive ? styles.sessionItemActive : ""}`}
                  onClick={() => switchSession(sess.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") switchSession(sess.id);
                  }}
                >
                  <div className={styles.sessionItemLeft}>
                    <span className={styles.sessionTitleText}>
                      {sess.title || "Untitled Chat"}
                    </span>
                    <span className={styles.sessionMetaText}>
                      {sess.messages.length} messages · {dateStr}
                      {isActive && <strong style={{ color: "#f59e0b", marginLeft: 6 }}>● Active</strong>}
                    </span>
                  </div>

                  {sessions.length > 1 && (
                    <button
                      type="button"
                      className={styles.sessionDeleteIconBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(sess.id);
                      }}
                      title="Delete this chat"
                      aria-label="Delete this chat"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: "auto", paddingTop: 12 }}>
            <button
              type="button"
              className={styles.warningCancelBtn}
              style={{ width: "100%", textAlign: "center" }}
              onClick={clearAllSessions}
            >
              Clear All Chat History
            </button>
          </div>
        </div>
      ) : isSettingsOpen ? (
        /* ── Settings View ── */
        <div className={styles.settingsView}>
          <h4 className={styles.settingsTitle}>AI Engine Settings</h4>
          <p className={styles.settingsDesc}>
            FrontendForge AI Tutor is powered by NVIDIA Nemotron 3.5 Lightning for high-speed, browser-independent reasoning.
          </p>

          <div className={styles.providerCards}>
            <div className={`${styles.providerCard} ${styles.providerCardActive}`}>
              <div className={styles.providerCardHeader}>
                <div className={styles.providerName}>
                  <Cpu size={14} style={{ display: "inline", marginRight: 6 }} />
                  NVIDIA Nemotron 3.5 Lightning
                </div>
                <span className={styles.providerTag}>
                  {hasConfiguredProvider ? "Connected" : "Key Needed"}
                </span>
              </div>
              <div className={styles.providerCardDesc}>
                Advanced frontend engineering reasoning. Works browser-independently across Brave, Chrome, Safari, and Firefox.
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="nvidia-key" className={styles.formLabel}>
              NVIDIA NIM API Key:
            </label>
            <input
              id="nvidia-key"
              type="password"
              className={styles.formInput}
              placeholder={
                hasEnvKey
                  ? "•••••••••••••••• (Configured via .env.local)"
                  : "nvapi-..."
              }
              value={keyOverride}
              onChange={(e) => setKeyOverride(e.target.value)}
              autoComplete="off"
            />
            <div className={styles.formHint}>
              {hasEnvKey ? (
                <span style={{ color: "#10b981" }}>
                  ✓ Key active from <code style={{ color: "#fcd34d" }}>.env.local</code>. (Your secret key is safely protected and never exposed in the UI).
                </span>
              ) : (
                <span>
                  Add <code style={{ color: "#f59e0b" }}>VITE_NVIDIA_API_KEY</code> to your{" "}
                  <code style={{ color: "#f59e0b" }}>.env.local</code> file, or enter an override key above. Free at{" "}
                  <a
                    href="https://build.nvidia.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    build.nvidia.com <ExternalLink size={11} style={{ display: "inline" }} />
                  </a>.
                </span>
              )}
            </div>
          </div>


          <button
            type="button"
            className={styles.settingsDoneBtn}
            onClick={handleSaveSettings}
          >
            Save Settings & Return to Chat
          </button>
        </div>
      ) : (
        /* ── Messages Chat View ── */
        <div
          ref={messagesAreaRef}
          className={styles.messagesArea}
          onScroll={handleMessagesScroll}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          {/* Scroll to bottom floating button when scrolled up */}
          {showScrollBottomBtn && (
            <button
              type="button"
              className={styles.scrollToBottomBtn}
              onClick={handleScrollToBottom}
              title="Jump to latest response"
            >
              <ArrowDown size={13} />
              <span>Scroll to bottom</span>
            </button>
          )}

          {/* Prompt Banner if user hasn't configured a key */}
          {!hasConfiguredProvider && (
            <div className={styles.setupPromptBanner}>
              <div className={styles.setupBannerTitle}>
                <Key size={14} style={{ display: "inline", marginRight: 4 }} />
                NVIDIA API Key Needed
              </div>
              <p className={styles.setupBannerText}>
                To enable live AI Tutor streaming, add your NVIDIA API key to <code style={{ color: "#fcd34d" }}>.env.local</code> (<code style={{ color: "#fcd34d" }}>VITE_NVIDIA_API_KEY=nvapi-...</code>) or enter it in settings.
              </p>
              <button
                type="button"
                className={styles.setupActionBtn}
                onClick={() => setIsSettingsOpen(true)}
              >
                Configure NVIDIA Key →
              </button>
            </div>
          )}

          {messages.length === 0 ? (
            <div className={styles.emptyChatState}>
              <Sparkles size={32} className={styles.emptySparkleIcon} />
              <h4 className={styles.emptyTitle}>How can I help you?</h4>
              <p className={styles.emptySubtitle}>
                I have full context of what you are currently viewing or coding on this page. Ask anything about frontend engineering, React, TypeScript, or coding problems.
              </p>
            </div>
          ) : (
            messages.map((m: ChatMessage) => (
              <div
                key={m.id}
                className={`${styles.messageItem} ${
                  m.role === "user"
                    ? `${styles.userMessage} ${editingMessageId === m.id ? styles.userMessageEditing : ""}`
                    : styles.assistantMessage
                }`}
              >
                {m.role === "user" ? (
                  editingMessageId === m.id ? (
                    <div className={styles.editMessageWrapper}>
                      <textarea
                        className={styles.editMessageTextarea}
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            const trimmed = editingText.trim();
                            if (trimmed && !isLoading) {
                              isUserScrolledUpRef.current = false;
                              setShowScrollBottomBtn(false);
                              editUserMessage(m.id, trimmed);
                              setEditingMessageId(null);
                              setEditingText("");
                            }
                          } else if (e.key === "Escape") {
                            setEditingMessageId(null);
                            setEditingText("");
                          }
                        }}
                        rows={Math.min(6, Math.max(2, editingText.split("\n").length))}
                        autoFocus
                      />
                      <div className={styles.editActionsRow}>
                        <button
                          type="button"
                          className={styles.editCancelBtn}
                          onClick={() => {
                            setEditingMessageId(null);
                            setEditingText("");
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className={styles.editSaveBtn}
                          disabled={!editingText.trim() || isLoading}
                          onClick={() => {
                            const trimmed = editingText.trim();
                            if (trimmed && !isLoading) {
                              isUserScrolledUpRef.current = false;
                              setShowScrollBottomBtn(false);
                              editUserMessage(m.id, trimmed);
                              setEditingMessageId(null);
                              setEditingText("");
                            }
                          }}
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={styles.userMessageHeaderRow}>
                        {m.contextSummary ? (
                          <span className={styles.userContextTag}>
                            📍 {m.contextSummary}
                          </span>
                        ) : (
                          <span />
                        )}
                        {!isLoading && (
                          <button
                            type="button"
                            className={styles.editMsgIconBtn}
                            onClick={() => {
                              setEditingMessageId(m.id);
                              setEditingText(m.content);
                            }}
                            title="Edit message"
                            aria-label="Edit message"
                          >
                            <Pencil size={12} />
                          </button>
                        )}
                      </div>
                      <div className={styles.userMessageContent}>{m.content}</div>
                    </>
                  )
                ) : (
                  <>
                    <div className={styles.assistantHeader}>
                      <Sparkles size={13} className={styles.aiLogoIcon} />
                      <span className={styles.assistantName}>Forge Tutor</span>
                    </div>
                    <AiMarkdown content={m.content} />
                    {m.isStreaming && <span className={styles.streamingCursor} />}
                  </>
                )}
              </div>
            ))
          )}

          {error && (
            <div
              style={{
                padding: "10px 12px",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "8px",
                color: "#fca5a5",
                fontSize: "0.8rem",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {/* ── Quick Action Chips (When Chat is Active & Not in Settings/History) ── */}
      {!isSettingsOpen && !isHistoryOpen && (
        <div className={styles.quickChipsRow}>
          <button
            type="button"
            className={styles.chipBtn}
            onClick={() => handleQuickChip("Explain this concept simply using an intuitive mental model (EL5)")}
          >
            👶 Explain simply
          </button>
          <button
            type="button"
            className={styles.chipBtn}
            onClick={() => handleQuickChip("Give me a hint without spoiling the solution")}
          >
            💡 Hint
          </button>
          <button
            type="button"
            className={styles.chipBtn}
            onClick={() => handleQuickChip("What are the real-world production trade-offs of this approach?")}
          >
            ⚡ Trade-offs
          </button>
          <button
            type="button"
            className={styles.chipBtn}
            onClick={() => handleQuickChip("What edge cases should I test for here?")}
          >
            🧪 Edge cases
          </button>
        </div>
      )}

      {/* ── Input Box (When Not in Settings/History) ── */}
      {!isSettingsOpen && !isHistoryOpen && (
        <footer className={styles.inputBar}>
          <div className={styles.inputWrapper}>
            <textarea
              ref={textareaRef}
              className={styles.promptTextarea}
              placeholder="Ask a question about frontend code, architecture, or challenges..."
              rows={1}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {isLoading ? (
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={cancelStream}
                title="Stop generating"
              >
                <Square size={13} fill="currentColor" />
              </button>
            ) : (
              <button
                type="button"
                className={styles.sendBtn}
                onClick={handleSend}
                disabled={!inputVal.trim()}
                title="Send message"
              >
                <Send size={14} />
              </button>
            )}
          </div>
          <div className={styles.inputFooterText}>
            <span>Strictly frontend & platform questions</span>
            <span>Enter to send · Shift+Enter for newline</span>
          </div>
        </footer>
      )}
    </div>
  );
}
