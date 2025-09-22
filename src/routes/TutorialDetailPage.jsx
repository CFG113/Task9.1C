import { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  db,
  deleteTutorialDocById,
  incrementTutorialViews,
} from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  Button,
  Container,
  Flex,
  Heading,
  Text,
  Separator,
  Box,
} from "@radix-ui/themes";
import { UserContext } from "@/context/user.context";
import ReviewModal from "@/components/ReviewModal";
import DeleteModal from "@/components/DeleteModal";
import { hasUserReviewed, addTutorialRating } from "@/utils/firebase";

function TutorialDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutorial, setTutorial] = useState(null);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const { currentUser } = useContext(UserContext);
  const [canReview, setCanReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Owner can delete if they uploaded it
  const canDelete =
    !!currentUser && !!tutorial && currentUser.uid === tutorial.uploaderUid;

  // Load tutorial
  useEffect(() => {
    async function load() {
      try {
        const snap = await getDoc(doc(db, "tutorials", id));
        if (!snap.exists()) {
          setError("Tutorial not found");
          return;
        }
        setTutorial(snap.data());
      } catch (e) {
        console.error(e);
        setError("Failed to load tutorial");
      }
    }
    load();
  }, [id]);

  // Guard to prevent double increments
  const didIncrementRef = useRef(false);

  // Increment views after 5s (non-owner only)
  useEffect(() => {
    if (!tutorial || !id) return;

    const viewerIsOwner =
      !!currentUser && currentUser.uid === tutorial.uploaderUid;
    if (viewerIsOwner) return;
    if (didIncrementRef.current) return;

    const timer = setTimeout(() => {
      if (didIncrementRef.current) return;
      didIncrementRef.current = true;

      console.log("increment view count after 5 seconds");
      incrementTutorialViews(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [tutorial, id, currentUser]);

  // Decide if current user can review (logged in, not owner, not reviewed yet)
  useEffect(() => {
    async function decide() {
      if (!tutorial || !id) return;

      const viewerIsOwner =
        !!currentUser && currentUser.uid === tutorial.uploaderUid;
      if (!currentUser || viewerIsOwner) {
        setCanReview(false);
        return;
      }

      const already = await hasUserReviewed(id, currentUser.uid);
      setCanReview(!already);
    }
    decide();
  }, [tutorial, id, currentUser]);

  async function handleSubmitReview(rating) {
    try {
      if (!currentUser || !id) return;
      await addTutorialRating(id, currentUser.uid, rating); // your one-per-user writer
      setCanReview(false);
      setReviewSubmitted(true);
    } catch (e) {
      console.error("Failed to save rating", e);
      setError("Failed to save rating");
    }
  }

  async function handleDelete() {
    if (!id) return;
    try {
      setDeleting(true);
      await deleteTutorialDocById(id);
      navigate("/tutorials");
    } catch (e) {
      console.error(e);
      setError("Failed to delete tutorial");
      setDeleting(false);
    }
  }

  return (
    <Container size="5">
      <Flex align="center" justify="between" mb="4">
        <Heading size="6">{tutorial?.title}</Heading>
        <Button onClick={() => navigate(-1)}>Back</Button>
      </Flex>

      {error && <Text color="ruby">{error}</Text>}

      {tutorial && (
        <video
          controls
          preload="auto"
          playsInline
          width="100%"
          style={{ aspectRatio: "16/9", background: "#000", borderRadius: 8 }}
          poster={tutorial?.thumbnailUrl}
        >
          <source src={tutorial.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* actions area */}
      <Separator my="5" />

      <Flex justify="between" align="center" mt="3">
        {/* Left: Review (only if user can review) */}
        <Box>
          {reviewSubmitted ? (
            <Text color="green">Thanks for reviewing!</Text>
          ) : (
            canReview && <ReviewModal onSubmit={handleSubmitReview} />
          )}
        </Box>

        {/* Right: Delete (only if owner) */}
        <Box>
          {canDelete && (
            <DeleteModal deleting={deleting} onConfirm={handleDelete} />
          )}
        </Box>
      </Flex>
    </Container>
  );
}

export default TutorialDetailPage;
