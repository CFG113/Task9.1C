import {
  Box,
  Flex,
  Card,
  TextField,
  Button,
  Link,
  Callout,
  Text,
} from "@radix-ui/themes";
import {
  createUserDocFromAuth,
  createAuthUserWithEmailAndPassword,
  sendVerificationEmail,
} from "@/utils/firebase";
import { useContext, useState } from "react";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { UserContext } from "@/context/user.context";
import {
  authErrorMessage,
  validateSignupForm,
  validatePhoneNumber,
} from "@/utils/error";

function Signup() {
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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { firstName, lastName, email, phone, password, confirmPassword } =
    contact;

  // format AU local phone input as 9 digits
  const handlePhoneNumber = (phoneNumber) =>
    phoneNumber.replace(/\D/g, "").replace(/^0+/, "").slice(0, 9);

  const handleChange = (e) => {
    setError("");
    const { name, value } = e.target;
    if (name === "phone") {
      setContact((p) => ({ ...p, phone: handlePhoneNumber(value) }));
    } else {
      setContact((p) => ({ ...p, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    // one-shot client validation
    const msg = validateSignupForm(contact);
    if (msg) {
      setError(msg);
      setLoading(false);
      return;
    }

    // derive E.164 after validation
    const phoneNumber = validatePhoneNumber(phone);

    try {
      const { user } = await createAuthUserWithEmailAndPassword(
        email,
        password
      );

      const displayName = `${firstName.trim()} ${lastName.trim()}`;
      await updateProfile(user, { displayName });
      await createUserDocFromAuth(user, { displayName, phoneNumber });

      await sendVerificationEmail(user);

      navigate("/verifyemail");
    } catch (error) {
      console.log(error);
      setError(authErrorMessage(error));
    } finally {
      setLoading(false);
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
            {error && (
              <Callout.Root color="red" role="alert" aria-live="assertive">
                <Callout.Text>
                  <Text as="span" weight="bold">
                    Sign up error:
                  </Text>{" "}
                  {error}
                </Callout.Text>
              </Callout.Root>
            )}

            <TextField.Root
              name="firstName"
              value={firstName}
              onChange={handleChange}
              placeholder="firstname"
              disabled={loading}
            />
            <TextField.Root
              name="lastName"
              value={lastName}
              onChange={handleChange}
              placeholder="lastname"
              disabled={loading}
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
              disabled={loading}
            >
              <TextField.Slot side="left">+61</TextField.Slot>
            </TextField.Root>
            <TextField.Root
              name="email"
              type="email"
              value={email}
              onChange={handleChange}
              placeholder="email"
              disabled={loading}
            />
            <TextField.Root
              name="password"
              type="password"
              value={password}
              onChange={handleChange}
              placeholder="password"
              disabled={loading}
            />
            <TextField.Root
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="confirm password"
              disabled={loading}
            />

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? "Signing up…" : "Sign up"}
            </Button>

            <Link href="/login">Login Instead</Link>
          </Flex>
        </Card>
      </Box>
    </Box>
  );
}

export default Signup;
