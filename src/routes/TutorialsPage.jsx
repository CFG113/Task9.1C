import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "@/context/user.context";
import useTutorials from "@/hooks/useTutorials";
import TutorialCard from "@/components/TutorialCard";
import { Button, Grid, Flex, Text, Container, Heading } from "@radix-ui/themes";

function TutorialsPage() {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

  const { tutorials, loading } = useTutorials(currentUser.uid);

  return (
    <Container size="5">
      <Flex align="center" justify="between" mb="4">
        <Heading size="6">My Tutorials</Heading>
        <Button onClick={() => navigate("new")}>Add Tutorial</Button>
      </Flex>

      {loading ? (
        <Text size="3">Loading data…</Text>
      ) : tutorials.length === 0 ? (
        <Flex direction="column" align="center" mt="9">
          <Text size="6">No Tutorials</Text>
        </Flex>
      ) : (
        <Flex justify="center">
          <Grid
            columns={{ initial: "1", sm: "2", md: "3", lg: "4" }}
            gap="3"
            width="auto"
          >
            {tutorials.map((t) => (
              <Link key={t.id} to={`/tutorials/${t.id}`}>
                <TutorialCard
                  title={t.title}
                  thumbnailUrl={t.thumbnailUrl}
                  views={t.views}
                  ratingsCount={t.ratingsCount}
                  ratingsSum={t.ratingsSum}
                />
              </Link>
            ))}
          </Grid>
        </Flex>
      )}
    </Container>
  );
}

export default TutorialsPage;
