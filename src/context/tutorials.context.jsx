import { createContext, useState, useEffect } from "react";
import { fetchTutorialsAndDocuments } from "../utils/firebase";

export const TutorialsContext = createContext({ tutorials: [], loading: true });

export const TutorialsProvider = ({ children }) => {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchTutorialsAndDocuments();
        setTutorials(data);
      } catch (err) {
        console.error("Failed to fetch tutorials:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <TutorialsContext.Provider value={{ tutorials, loading }}>
      {children}
    </TutorialsContext.Provider>
  );
};
