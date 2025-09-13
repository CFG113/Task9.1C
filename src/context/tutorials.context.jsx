import { createContext, useState, useEffect } from "react";
import { fetchTutorialsAndDocuments } from "../utils/firebase";

export const TutorialsContext = createContext({
  tutorials: {},
});

export const TutorialsProvider = ({ children }) => {
  const [tutorials, setTutorials] = useState({});
  useEffect(() => {
    const fetchTutorialsMap = async () => {
      const tutorialsMap = await fetchTutorialsAndDocuments();
      setTutorials(tutorialsMap);
    };
    fetchTutorialsMap();
  }, []);

  console.log(tutorials);
  const value = { tutorials };

  return (
    <TutorialsContext.Provider value={value}>
      {children}
    </TutorialsContext.Provider>
  );
};
