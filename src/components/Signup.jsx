import { Box, Flex, Card, TextField, Button, Link } from "@radix-ui/themes";
import {
  createUserDocFromAuth,
  createAuthUserWithEmailAndPassword,
} from "../utils/firebase";
import { useState } from "react";

const Signup = () => {
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { firstName, lastName, email, password, confirmPassword } = contact;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setContact((preValue) => ({
      ...preValue,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const { user } = await createAuthUserWithEmailAndPassword(
        email,
        password
      );

      const displayName = `${firstName.trim()} ${lastName.trim()}`;
      await createUserDocFromAuth(user, { displayName });
    } catch (error) {
      console.log("error in creating user", error.message);
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
              name="firstName"
              type="text"
              placeholder="firstname"
              value={firstName}
              onChange={handleChange}
            />
            <TextField.Root
              name="lastName"
              type="text"
              placeholder="lastname"
              value={lastName}
              onChange={handleChange}
            />
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
            <TextField.Root
              name="confirmPassword"
              type="password"
              placeholder="confirm password"
              value={confirmPassword}
              onChange={handleChange}
            />
            <Button onClick={handleSubmit}>Sign up</Button>
            <Link href="/login">Login Instead</Link>
          </Flex>
        </Card>
      </Box>
    </Box>
  );
};

export default Signup;
