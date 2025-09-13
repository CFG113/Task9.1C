import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user.context";
import { fetchTutorialsByUser } from "@/utils/firebase";
import TutorialCard from "@/components/TutorialCard";
import { Button, Grid } from "@radix-ui/themes";

function TutorialsPage(props) {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const [tutorials, setTutorials] = useState({});

  useEffect(() => {
    if (!currentUser?.uid) return;

    fetchTutorialsByUser(currentUser.uid).then(setTutorials);
  }, [currentUser.uid]);

  const data = {
    abc123: {
      title: "Intro to React",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
    },
    def456: {
      title: "Firebase Uploads",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
    },
    ghi789: {
      title: "Designing Clean UIs",
      thumbnailUrl: "", // shows the placeholder
    },
    ghi689: {
      title: "Designing Clean UIs",
      thumbnailUrl: "", // shows the placeholder
    },
    ghi899: {
      title: "Designing Clean UIs",
      thumbnailUrl: "", // shows the placeholder
    },
  };

  return (
    <div>
      <h1>My Tutorials</h1>
      <Button className="cursor-pointer" onClick={() => navigate("new")}>
        Add Tutorial
      </Button>
      {/* render list */}
      <Grid
        columns="4"
        gapX="2" // between cards in the same row
        gapY="9" // between rows
        mx="auto"
        mt="8"
        style={{ maxWidth: 1500 }}
      >
        {Object.entries(data).map(([id, t]) => (
          <TutorialCard
            key={id}
            title={t.title}
            thumbnailUrl={t.thumbnailUrl}
          />
        ))}
      </Grid>
    </div>
  );
}
export default TutorialsPage;
