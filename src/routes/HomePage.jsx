import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TutorialsContext } from "@/context/tutorials.context";
import TutorialCard from "@/components/Tutorialcard";
import { Grid, Flex, Text, Container, Heading } from "@radix-ui/themes";

function HomePage() {
  const navigate = useNavigate();
  const { tutorials, loading } = useContext(TutorialsContext);

  return (
    <Container size="4" py="6">
      <Flex align="center" justify="between" mb="4">
        <Heading size="6">All Tutorials</Heading>
      </Flex>

      {loading ? (
        <Text size="3">Loading…</Text>
      ) : (tutorials?.length ?? 0) === 0 ? (
        <Flex direction="column" align="center" mt="9">
          <Text size="6">No Tutorials Yet</Text>
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

export default HomePage;
