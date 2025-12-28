import React, { useState } from 'react';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { useTasks } from '../../../features/tasks/context/TaskContext';
import { Button } from '../common/Button';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const { logout } = useAuth();
  const { searchQuery, setSearchQuery } = useTasks();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1 className={styles.logo}>Checked</h1>
        <div className={styles.rightSection}>
          <div className={styles.desktopSearch}>
            <div className={styles.searchWrapper}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search"
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="secondary" onClick={logout} className={styles.logoutButton}>
              🔒 Logout
            </Button>
          </div>
          <button
            className={styles.hamburger}
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Menu"
          >
            ☰
          </button>
        </div>
      </div>
      {showMobileMenu && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileSearchWrapper}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search"
              className={styles.mobileSearchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="secondary" onClick={logout} className={styles.mobileLogoutButton}>
            🔒 Logout
          </Button>
        </div>
      )}
    </header>
  );
};
