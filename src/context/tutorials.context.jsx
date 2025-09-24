import { createContext, useState, useEffect } from "react";
import { onSnapshot } from "firebase/firestore";
import { fetchTutorialsAndDocuments } from "@/utils/firebase";

export const TutorialsContext = createContext({ tutorials: [], loading: true });

export const TutorialsProvider = ({ children }) => {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryRef = fetchTutorialsAndDocuments();

    const unsubscribe = onSnapshot(
      queryRef,
      (snapshot) => {
        setTutorials(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (error) => {
        console.error("tutorials realtime error:", error);
        setTutorials([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <TutorialsContext.Provider value={{ tutorials, loading }}>
      {children}
    </TutorialsContext.Provider>
  );
};
