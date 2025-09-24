import { createContext, useReducer, useEffect, useState } from "react";
import UserReducer from "../reducers/UserReducer";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";

// Stores the state of the user so any component can get the user wihtout prop drilling
export const UserContext = createContext({
  currentUser: null,
  setCurrentUser: () => null,
});

const INITIAL_STATE = {
  currentUser: null,
};

export const UserProvider = ({ children }) => {
  // const [currentUser, setCurrentUser] = useState(null);
  const [{ currentUser }, dispatch] = useReducer(UserReducer, INITIAL_STATE); // Managing the auth state transitions
  const [loading, setLoading] = useState(false);

  const setCurrentUser = (user) => {
    dispatch({ type: "SET_CURRENT_USER", payload: user });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(true);
    });
    return unsubscribe;
  }, []);

  if (!loading) return null;

  const value = { currentUser, setCurrentUser };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
