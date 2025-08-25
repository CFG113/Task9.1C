import { Box, Flex, Card, TextField, Button, Link } from "@radix-ui/themes";

const Signup = () => {
  return (
    <Box
      display="flex"
      direction="column"
      align="center"
      justify="start"
      mt="9"
    >
      <Box maxWidth="360px">
        <Card size="4">
          <Flex direction="column" gap="5">
            <TextField.Root type="text" placeholder="firstname" />
            <TextField.Root type="text" placeholder="lastname" />
            <TextField.Root type="email" placeholder="email" />
            <TextField.Root type="password" placeholder="password" />
            <TextField.Root type="password" placeholder="confirm password" />
            <Button>Sign up</Button>
            <Link href="/login" weight="regular">
              Login Instead
            </Link>
          </Flex>
        </Card>
      </Box>
    </Box>
  );
};

export default Signup;
