import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import {
  founders as fallbackFounders,
  products as fallbackProducts,
  services as fallbackServices,
  spotlightStories as fallbackPosts,
  workshops as fallbackWorkshops,
} from "@/data/mockData";

const PublicDataContext = createContext(null);

export function PublicDataProvider({ children }) {
  const [data, setData] = useState({
    founders: fallbackFounders,
    products: fallbackProducts,
    services: fallbackServices,
    posts: fallbackPosts,
    workshops: fallbackWorkshops,
    settings: {},
  });
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const response = await api("/public/bootstrap");
      setData({
        founders: response.founders || [],
        products: response.products || [],
        services: response.services || [],
        posts: response.posts || [],
        workshops: response.workshops || [],
        settings: response.settings || {},
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh().catch(() => setLoading(false));
  }, []);

  const value = useMemo(() => ({ ...data, loading, refresh }), [data, loading]);
  return (
    <PublicDataContext.Provider value={value}>
      {children}
    </PublicDataContext.Provider>
  );
}

export function usePublicData() {
  const context = useContext(PublicDataContext);
  if (!context) {
    throw new Error("usePublicData must be used within PublicDataProvider");
  }
  return context;
}
