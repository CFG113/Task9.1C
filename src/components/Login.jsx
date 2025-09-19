import { useState, useContext } from "react";
import { Box, Flex, Card, TextField, Button, Link } from "@radix-ui/themes";
import {
  signInWithGooglePopup,
  createUserDocFromAuth,
  signinAuthUserWithEmailAndPassword,
} from "@/utils/firebase";
import { UserContext } from "../context/user.context";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [contact, setContact] = useState({
    email: "",
    password: "",
  });

  const { email, password } = contact;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setContact((preValue) => {
      return {
        ...preValue,
        [name]: value,
      };
    });
  };

  const logGoogleUser = async () => {
    const { user } = await signInWithGooglePopup();
    const userDocRef = await createUserDocFromAuth(user);
    navigate("/");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { user } = await signinAuthUserWithEmailAndPassword(
        email,
        password
      );
      navigate("/");
      console.log(response);
    } catch (error) {
      console.log("error in login", error.message);
    }
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
            <TextField.Root
              name="email"
              type="email"
              placeholder="email"
              value={email}
              onChange={handleChange}
            />
            <TextField.Root
              name="password"
              type="password"
              placeholder="password"
              value={password}
              onChange={handleChange}
            />
            <Button onClick={handleSubmit}>Sign in</Button>
            <Button variant="soft" onClick={logGoogleUser}>
              Google sign in
            </Button>
            <Link href="/signup">Sign up Instead</Link>
          </Flex>
        </Card>
      </Box>
    </Box>
  );
};
export default Login;
