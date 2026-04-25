import { useEffect, useMemo, useState } from 'react';
import { fetchChatConversations, fetchChatMessages, sendChatMessage } from '../../services/api';
import styles from './Chat.module.css';

function formatDraftTime() {
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
}

function formatMessageTime(value) {
  if (!value) {
    return formatDraftTime();
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return formatDraftTime();
  }

  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
  }).format(parsedDate);
}

function Chat() {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [conversationSearch, setConversationSearch] = useState('');
  const [isConversationLoading, setIsConversationLoading] = useState(true);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [draft, setDraft] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadConversations() {
      setIsConversationLoading(true);
      setLoadError('');

      try {
        const payload = await fetchChatConversations({ page: 1, limit: 50 });
        const results = Array.isArray(payload?.results) ? payload.results : [];

        if (!isMounted) {
          return;
        }

        setConversations(results);
        setActiveConversationId((currentId) => {
          if (currentId && results.some((item) => item.peer_user_id === currentId)) {
            return currentId;
          }

          return results[0]?.peer_user_id ?? null;
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setLoadError(error?.message || 'Không thể tải danh sách hội thoại.');
      } finally {
        if (isMounted) {
          setIsConversationLoading(false);
        }
      }
    }

    loadConversations();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadMessages() {
      if (!activeConversationId) {
        setMessages([]);
        return;
      }

      setIsMessageLoading(true);
      setLoadError('');

      try {
        const payload = await fetchChatMessages(activeConversationId, { page: 1, limit: 100 });
        const results = Array.isArray(payload?.results) ? payload.results : [];
        if (isMounted) {
          setMessages(results);
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(error?.message || 'Không thể tải tin nhắn.');
        }
      } finally {
        if (isMounted) {
          setIsMessageLoading(false);
        }
      }
    }

    loadMessages();
    return () => {
      isMounted = false;
    };
  }, [activeConversationId]);

  const filteredConversations = useMemo(() => {
    const keyword = conversationSearch.trim().toLowerCase();
    if (!keyword) {
      return conversations;
    }

    return conversations.filter((conversation) => {
      const name = String(conversation.peer_display_name || '').toLowerCase();
      const preview = String(conversation.last_message || '').toLowerCase();
      return name.includes(keyword) || preview.includes(keyword);
    });
  }, [conversations, conversationSearch]);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.peer_user_id === activeConversationId) ?? null,
    [conversations, activeConversationId]
  );

  const handleSendMessage = async () => {
    const content = draft.trim();

    if (!content || !activeConversation || isSending) {
      return;
    }

    setIsSending(true);
    setLoadError('');

    try {
      const newMessage = await sendChatMessage({
        nguoi_nhan_id: activeConversation.peer_user_id,
        noi_dung_tin_nhan: content,
      });

      setMessages((currentMessages) => [...currentMessages, newMessage]);
      setConversations((currentConversations) => {
        const nextConversations = currentConversations.map((conversation) => {
          if (conversation.peer_user_id !== activeConversation.peer_user_id) {
            return conversation;
          }

          return {
            ...conversation,
            last_message: newMessage.noi_dung_tin_nhan,
            last_message_time: newMessage.thoi_gian_gui,
          };
        });

        return [...nextConversations].sort(
          (first, second) => new Date(second.last_message_time).getTime() - new Date(first.last_message_time).getTime()
        );
      });
      setDraft('');
    } catch (error) {
      setLoadError(error?.message || 'Không thể gửi tin nhắn.');
    } finally {
      setIsSending(false);
    }
  };

  const handleComposerKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={styles['chat-page']}>
      <div className={styles['ambient']} aria-hidden="true" />
      <div className={styles['ambient-alt']} aria-hidden="true" />



      <main className={styles['chat-layout']}>
        <aside className={styles['conversation-rail']}>
          <div className={styles['rail-header']}>
            <h1>Hộp thư tuyển dụng</h1>

            <label className={styles['search-box']}>
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                value={conversationSearch}
                onChange={(event) => setConversationSearch(event.target.value)}
                placeholder="Tìm kiếm cuộc hội thoại..."
              />
            </label>
          </div>

          <div className={styles['conversation-list']}>
            {isConversationLoading ? <p>Đang tải hội thoại...</p> : null}
            {!isConversationLoading && filteredConversations.length === 0 ? <p>Chưa có hội thoại nào.</p> : null}
            {filteredConversations.map((conversation) => {
              const isActive = conversation.peer_user_id === activeConversationId;
              const accent = conversation.peer_role === 'cong_ty' ? 'primary' : 'secondary';

              return (
                <button
                  key={conversation.peer_user_id}
                  type="button"
                  className={`${styles['conversation-card']} ${isActive ? styles['is-active'] : ''}`}
                  onClick={() => setActiveConversationId(conversation.peer_user_id)}
                >
                  <span className={`${styles['avatar']} ${styles[`accent-${accent}`]}`} aria-hidden="true">
                    {String(conversation.peer_display_name || '?').charAt(0).toUpperCase()}
                  </span>

                  <span className={styles['conversation-copy']}>
                    <span className={styles['conversation-row']}>
                      <strong>{conversation.peer_display_name || 'Không xác định'}</strong>
                      <small>{formatMessageTime(conversation.last_message_time)}</small>
                    </span>
                    <span className={styles['conversation-row']}>
                      <span>{conversation.last_message || 'Chưa có tin nhắn'}</span>
                    </span>
                    <span className={styles['status-chip']}>
                      {conversation.peer_role === 'cong_ty' ? 'Nhà tuyển dụng' : 'Ứng viên'}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <section className={styles['thread-panel']}>
          <div className={styles['thread-header']}>
            <div className={styles['thread-title']}>
              <span className={`${styles['avatar']} ${styles['avatar-large']} ${styles['accent-primary']}`} aria-hidden="true">
                {String(activeConversation?.peer_display_name || '?').charAt(0).toUpperCase()}
              </span>
              <div>
                <h2>{activeConversation?.peer_display_name || 'Chưa chọn hội thoại'}</h2>
                <p>{activeConversation?.peer_role === 'cong_ty' ? 'Nhà tuyển dụng' : 'Ứng viên'}</p>
              </div>
            </div>
          </div>

          <div className={styles['message-stream']}>
            <div className={styles['date-divider']}>
              <span>TODAY</span>
            </div>

            {isMessageLoading ? <p>Đang tải tin nhắn...</p> : null}
            {!isMessageLoading && messages.length === 0 ? <p>Chưa có tin nhắn nào.</p> : null}
            {messages.map((message) => (
              <article
                key={message.tin_nhan_id}
                className={`${styles['message-row']} ${message.is_outgoing ? styles['align-right'] : ''}`}
              >
                {!message.is_outgoing ? <span className={`${styles['avatar']} ${styles['message-avatar']} ${styles['accent-secondary']}`} aria-hidden="true">{String(activeConversation?.peer_display_name || 'A').charAt(0).toUpperCase()}</span> : null}

                <div className={`${styles['message-bubble']} ${message.is_outgoing ? styles['is-outgoing'] : ''}`}>
                  <p>{message.noi_dung_tin_nhan}</p>
                  <div className={styles['message-meta']}>
                    <span>{formatMessageTime(message.thoi_gian_gui)}</span>
                    {message.is_outgoing ? <span>Đã gửi</span> : null}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className={styles['composer-shell']}>
            <div className={styles['composer']}>
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleComposerKeyDown}
                placeholder="Aa"
                rows="2"
              />
              <button type="button" className={styles['send-button']} onClick={handleSendMessage}>
                {isSending ? 'Đang gửi...' : 'Gửi'}
              </button>
            </div>

            {loadError ? <p>{loadError}</p> : null}

          </div>
        </section>

      </main>
    </div>
  );
}

export default Chat;