import { Link, useLocation, useRouter } from '@tanstack/react-router';
import cn from 'clsx';
import { m } from 'framer-motion';
import {
  MessageSquarePlus,
  PanelLeftClose,
  PanelLeftOpen,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

import { ThemeLayout } from '@/components/layouts/theme';

import styles from './index.module.scss';
import { useGetChatList } from '@/hooks/chat/useGetChatList';
import { Loader } from '@/components/ui';
import { useDeleteChat } from '@/hooks/chat/useDeleteChat';

const Sidebar = () => {
  const userId = localStorage.getItem('userId');
  const { navigate } = useRouter();
  const { pathname } = useLocation();

  const { deleteChat } = useDeleteChat();
  const { data, isFetching } = useGetChatList(userId);
  const chatList = data?.data;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleRemoveChat = (chatId: string) => {
    const isConfirm = confirm('Вы точно хотите удалити данный чат?');
    isConfirm && deleteChat(chatId);
    if (pathname.includes(chatId) && isConfirm) {
      navigate({ to: '/' });
    }
  };

  return (
    <div className={styles.sidebar_block}>
      <m.aside
        className={cn(styles.sidebar, {
          [styles.collapsed]: isCollapsed,
        })}
        animate={{
          width: isCollapsed ? 0 : 280,
        }}
        transition={{
          type: 'keyframes',
          duration: 0.1,
          ease: 'linear',
        }}
      >
        <div className={styles.buttons}>
          <button
            className={styles.toggle}
            title={'Свернуть'}
            onClick={toggleSidebar}
          >
            <PanelLeftClose />
          </button>
          <ThemeLayout.ThemeToggler />
        </div>
        <Link to='/' className={styles.new_chat_btn} title={'Новый чат'}>
          <MessageSquarePlus size={24} />
          <span>Новый чат</span>
        </Link>
        <hr />
        {isFetching ? (
          <Loader size={36} style={{ marginTop: '50px' }} />
        ) : chatList?.length ? (
          <ul>
            {chatList.map(({ id, title }) => (
              <li
                key={id}
                className={cn({
                  [styles.active]: pathname?.includes(id),
                })}
              >
                <Link
                  to={'/chat/$chatId'}
                  params={{ chatId: id }}
                  title={title}
                >
                  <span>{title}</span>
                </Link>
                <button
                  className={styles.remove_chat_btn}
                  title='Удалить сообщение'
                  onClick={() => handleRemoveChat(id)}
                >
                  <Trash2 />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.not_found}>
            <p>У вас пока нет чатов</p>
          </div>
        )}
      </m.aside>
      {isCollapsed && (
        <div className={styles.set_collapsed_btn}>
          <button
            className={styles.toggle}
            title={'Развернуть'}
            onClick={toggleSidebar}
          >
            <PanelLeftOpen />
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
