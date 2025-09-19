import { Box, Card, Flex, Heading, Text } from "@radix-ui/themes";

const VerifyEmail = () => {
  return (
    <Box display="flex" align="center" justify="center" mt="9">
      <Box width="100%" maxWidth="480px">
        <Card size="4" style={{ width: "100%" }}>
          <Flex direction="column" gap="5">
            <Heading size="6">Check your inbox</Heading>
            <Text color="gray">
              We've sent you a verification email. Click the link in that
              message to confirm your address and continue.
            </Text>
            <Text size="1" color="gray" aria-live="polite" role="status">
              Tip: If you don't see it, check your spam folder.
            </Text>
          </Flex>
        </Card>
      </Box>
    </Box>
  );
};

export default VerifyEmail;
