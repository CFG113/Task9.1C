import { useEffect, useState } from "react";
import { db } from "@/utils/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

export default function useTutorials(uid) {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, "tutorials"),
      where("uploaderUid", "==", uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        setTutorials(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error("tutorials query error:", err);
        setTutorials([]);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [uid]);

  return { tutorials, loading };
}
