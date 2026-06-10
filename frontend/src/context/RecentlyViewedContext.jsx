import { createContext, useContext, useState, useCallback } from 'react';

const RecentlyViewedContext = createContext(null);

export function RecentlyViewedProvider({ children }) {
  const [items, setItems] = useState(() =>
    JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
  );

  const add = useCallback((product) => {
    setItems(prev => {
      const filtered = prev.filter(p => p._id !== product._id);
      const next = [product, ...filtered].slice(0, 8);
      localStorage.setItem('recentlyViewed', JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <RecentlyViewedContext.Provider value={{ items, add }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export const useRecentlyViewed = () => useContext(RecentlyViewedContext);
