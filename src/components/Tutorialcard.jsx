import { Card, Inset, Text, Flex } from "@radix-ui/themes";
import { FaStar } from "react-icons/fa";
import { FiEye } from "react-icons/fi";

function TutorialCard(props) {
  const { title, thumbnailUrl, views, ratingsCount, ratingsSum } = props;

  const avg = ratingsSum / ratingsCount;

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
            height: 140,
            objectFit: "cover",
          }}
        />
      </Inset>

      <Text as="div" size="2" weight="bold">
        {title}
      </Text>
      <Flex align="center" gap="2">
        <Flex align="center" gap="1">
          <Text size="1" color="gray">
            <FaStar />
          </Text>
          <Text size="1" color="gray">
            {avg.toFixed(1)} ({ratingsCount})
          </Text>
        </Flex>

        <Text size="1" color="gray">
          ·
        </Text>

        <Flex align="center" gap="1">
          <Text size="1" color="gray">
            <FiEye />
          </Text>
          <Text size="1" color="gray">
            {views} views
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
}

export default TutorialCard;
