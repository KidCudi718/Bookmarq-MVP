import React, { useState } from 'react';
import { logBookmarkToHedera } from '../lib/hedera';

interface Bookmark {
  id: string;
  text: string;
  user: string;
  url: string;
  date: string;
  excerpt: string;
}

export default function Home() {
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Mock bookmarks data with "Hedera"
  const mockBookmarks: Bookmark[] = [
    {
      id: "1",
      text: "Hedera is revolutionizing blockchain with its speed and security.",
      user: "CryptoFan",
      url: "https://x.com/cryptofan/status/123",
      date: "May 1, 2025",
      excerpt: "Hedera's speed and security...",
    },
    {
      id: "2",
      text: "Building a dApp on Hedera Testnet was a breeze!",
      user: "DevMaster",
      url: "https://x.com/devmaster/status/456",
      date: "Apr 30, 2025",
      excerpt: "Hedera Testnet dApp building...",
    },
    {
      id: "3",
      text: "Why Hedera is the future of decentralized tech.",
      user: "TechGuru",
      url: "https://x.com/techguru/status/789",
      date: "Apr 29, 2025",
      excerpt: "Hedera as the future of tech...",
    },
  ];

  // Filter bookmarks based on search query
  const filteredBookmarks = mockBookmarks.filter(
    (bookmark) =>
      bookmark.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogToHedera = async (bookmarkId: string) => {
    setLoading(true);
    setError(null);
    setTransactionId(null);
    try {
      const txId: string = await logBookmarkToHedera(bookmarkId);
      setTransactionId(txId);
      console.log(`Bookmark logged on Hedera: ${txId}`);
    } catch (err: unknown) {
      setError('Failed to log to Hedera. Check console for details.');
      console.error('Hedera Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap"
        rel="stylesheet"
      />
      <div style={styles.container}>
        <h1 style={styles.brandHeader}>Bookmarq</h1>
        <h2 style={styles.subHeader}>Organize Your X Bookmarks</h2>

        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search bookmarks by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Bookmarks List */}
        <div style={styles.bookmarksContainer}>
          {searchQuery ? (
            filteredBookmarks.length > 0 ? (
              filteredBookmarks.map((bookmark) => (
                <div key={bookmark.id} style={styles.bookmarkCard}>
                  <h2 style={styles.bookmarkTitle}>{bookmark.user}</h2>
                  <p style={styles.bookmarkText}>
                    {bookmark.text} • {bookmark.date}
                  </p>
                  <p style={styles.bookmarkExcerpt}>{bookmark.excerpt}</p>
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.bookmarkLink}
                  >
                    View on X
                  </a>
                  <button
                    onClick={() => handleLogToHedera(bookmark.id)}
                    disabled={loading}
                    style={loading ? styles.buttonDisabled : styles.button}
                  >
                    {loading ? 'Logging...' : 'Log to Hedera'}
                  </button>
                </div>
              ))
            ) : (
              <p style={styles.noResults}>No bookmarks found.</p>
            )
          ) : (
            <p style={styles.noResults}>Search to find your bookmarks.</p>
          )}
        </div>

        {/* Hedera Status */}
        <div style={styles.status}>
          {transactionId ? (
            <p style={styles.success}>
              ✅ Logged to Hedera Testnet: {transactionId}
            </p>
          ) : error ? (
            <p style={styles.error}>❌ {error}</p>
          ) : null}
        </div>
      </div>
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: "'Inter', sans-serif",
    backgroundColor: '#141414',
    color: '#ffffff',
    minHeight: '100vh',
    width: '100%',
    boxSizing: 'border-box',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  brandHeader: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: '3.5rem',
    fontWeight: 700,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: '10px',
  },
  subHeader: {
    fontSize: '1.5rem',
    fontWeight: 500,
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: '40px',
  },
  searchContainer: {
    marginBottom: '30px',
    display: 'flex',
    justifyContent: 'center',
  },
  searchInput: {
    width: '100%',
    maxWidth: '500px',
    padding: '12px 20px',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #333',
    backgroundColor: '#222',
    color: '#ffffff',
    outline: 'none',
  },
  bookmarksContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  bookmarkCard: {
    backgroundColor: '#1c1c1c',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
  },
  bookmarkTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#ffffff',
    marginBottom: '10px',
  },
  bookmarkText: {
    fontSize: '1rem',
    color: '#cccccc',
    margin: '5px 0',
  },
  bookmarkExcerpt: {
    fontSize: '0.9rem',
    color: '#999999',
    margin: '10px 0',
  },
  bookmarkLink: {
    fontSize: '1rem',
    color: '#1DA1F2',
    textDecoration: 'none',
    fontWeight: 500,
    display: 'block',
    marginBottom: '10px',
  },
  button: {
    backgroundColor: '#1DA1F2',
    color: '#ffffff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  buttonDisabled: {
    backgroundColor: '#666',
    color: '#ffffff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 500,
    cursor: 'not-allowed',
  },
  status: {
    textAlign: 'center',
    marginTop: '20px',
  },
  success: {
    color: '#16a34a',
    fontSize: '1rem',
    fontWeight: 500,
  },
  error: {
    color: '#dc2626',
    fontSize: '1rem',
    fontWeight: 500,
  },
  noResults: {
    textAlign: 'center',
    color: '#999999',
    fontSize: '1rem',
  },
};
