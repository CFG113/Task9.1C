import { Box, Flex, Card, TextField, Button, Link } from "@radix-ui/themes";
import {
  createUserDocFromAuth,
  createAuthUserWithEmailAndPassword,
} from "@/utils/firebase";
import { useContext, useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { UserContext } from "@/context/user.context";

// AU helpers
const handlePhoneNumber = (raw) =>
  (raw || "").replace(/\D/g, "").replace(/^0+/, "").slice(0, 9);
const validatePhoneNumber = (local) => {
  const nine = (local || "").replace(/\D/g, "").replace(/^0+/, "");
  return /^\d{9}$/.test(nine) ? `+61${nine}` : null;
};

const Signup = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { firstName, lastName, email, phone, password, confirmPassword } =
    contact;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone")
      setContact((p) => ({ ...p, phone: handlePhoneNumber(value) }));
    else setContact((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async () => {
    if (password !== confirmPassword) return alert("Passwords do not match!");
    const phoneNumber = validatePhoneNumber(phone);
    if (!phoneNumber)
      return alert("Enter 9 digits without leading 0 (e.g. 411234567).");

    try {
      const { user } = await createAuthUserWithEmailAndPassword(
        email,
        password
      );
      const displayName = `${firstName.trim()} ${lastName.trim()}`;
      await createUserDocFromAuth(user, { displayName, phoneNumber });

      await sendEmailVerification(user, {
        url: `${window.location.origin}/otp`,
      });

      navigate("/verifyemail");
    } catch (error) {
      console.log("error in creating user", error.message);
      alert(error.message);
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
              value={firstName}
              onChange={handleChange}
              placeholder="firstname"
            />
            <TextField.Root
              name="lastName"
              value={lastName}
              onChange={handleChange}
              placeholder="lastname"
            />
            <TextField.Root
              name="phone"
              type="tel"
              placeholder="411234567"
              value={phone}
              onChange={handleChange}
              inputMode="numeric"
              pattern="[0-9]{9}"
              title="9 digits without the leading 0"
            >
              <TextField.Slot side="left">+61</TextField.Slot>
            </TextField.Root>
            <TextField.Root
              name="email"
              type="email"
              value={email}
              onChange={handleChange}
              placeholder="email"
            />
            <TextField.Root
              name="password"
              type="password"
              value={password}
              onChange={handleChange}
              placeholder="password"
            />
            <TextField.Root
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="confirm password"
            />
            <Button type="button" onClick={handleSubmit}>
              Sign up
            </Button>
            <Link href="/login">Login Instead</Link>
          </Flex>
        </Card>
      </Box>
    </Box>
  );
};

export default Signup;
