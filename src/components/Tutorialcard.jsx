import { Card, Inset, Text } from "@radix-ui/themes";

function TutorialCard(props) {
  const { title, thumbnailUrl } = props;

  return (
    <Card size="2" variant="surface" style={{ width: 260 }}>
      <Inset clip="padding-box" side="top" pb="current">
        <img
          src={
            thumbnailUrl ||
            "https://via.placeholder.com/640x360?text=No+Thumbnail"
          }
          alt={title || "Tutorial thumbnail"}
          style={{
            display: "block",
            width: "100%",
            height: 140,
            objectFit: "cover",
            backgroundColor: "var(--gray-5)",
          }}
        />
      </Inset>

      <Text as="div" size="2" weight="bold">
        {title}
      </Text>
    </Card>
  );
}

export default TutorialCard;
