import { Box, Flex, Card, TextField, Button, Link } from "@radix-ui/themes";
import { signInWithGooglePopup } from "../utils/firebase";

const Login = () => {
  const logGoogleUser = async () => {
    const { user } = await signInWithGooglePopup();
    // const userDocRef = await createUserDocFromAuth(user);
  };

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
            <TextField.Root type="email" placeholder="email" />
            <TextField.Root type="password" placeholder="password" />
            <Button>Sign in</Button>
            <Button variant="soft" onClick={logGoogleUser}>
              Google sign in
            </Button>
            <Link href="/signup" weight="regular">
              Sign up Instead
            </Link>
          </Flex>
        </Card>
      </Box>
    </Box>
  );
};
export default Login;
