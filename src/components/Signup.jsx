import {
  Box,
  Flex,
  Card,
  TextField,
  Button,
  Link,
  Text,
} from "@radix-ui/themes";
import {
  createUserDocFromAuth,
  createAuthUserWithEmailAndPassword,
} from "../utils/firebase";
import { sendEmailVerification } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const validatePhoneNumber = (input) => {
  if (!input) return null;
  const x = input.replace(/[\s()-]/g, "");
  if (/^04\d{8}$/.test(x)) return `+61${x.slice(1)}`; // 04XXXXXXXX -> +61
  if (/^\+614\d{8}$/.test(x)) return x; // already E.164
  return null;
};

const Signup = () => {
  const navigate = useNavigate();

  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  // field-level errors
  const [errors, setErrors] = useState({});
  // top-level fallback error
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const { firstName, lastName, email, password, confirmPassword, phone } =
    contact;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
    // clear field error as the user edits
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormError("");
  };

  // client-side validator → returns an errors object keyed by field
  const validate = () => {
    const next = {};

    if (!firstName.trim()) next.firstName = "First name is required.";
    if (!lastName.trim()) next.lastName = "Last name is required.";

    const emailTrim = email.trim().toLowerCase();
    const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s ?? "");
    if (!emailTrim) next.email = "Email is required.";
    else if (!isEmail(emailTrim)) next.email = "Enter a valid email.";

    if (!password) next.password = "Password is required.";
    else if (password.length < 6)
      next.password = "Password must be at least 6 characters.";

    if (!confirmPassword)
      next.confirmPassword = "Please confirm your password.";
    else if (password !== confirmPassword)
      next.confirmPassword = "Passwords do not match.";

    const auPhone = validatePhoneNumber(phone?.trim());
    if (!phone?.trim()) next.phone = "Mobile number is required.";
    else if (!auPhone)
      next.phone = "Use AU format: 04XXXXXXXX or +614XXXXXXXX.";

    return { next, auPhone, emailTrim };
  };

  // map Firebase error codes to user-friendly, field-specific messages
  const applyFirebaseError = (code, message) => {
    switch (code) {
      case "auth/weak-password":
        setErrors((p) => ({
          ...p,
          password: "Password must be at least 6 characters.",
        }));
        break;
      case "auth/email-already-in-use":
        setErrors((p) => ({ ...p, email: "Email is already in use." }));
        break;
      case "auth/invalid-email":
        setErrors((p) => ({ ...p, email: "Enter a valid email." }));
        break;
      case "auth/operation-not-allowed":
        setFormError(
          "Email/password sign-in is disabled in your Firebase project."
        );
        break;
      case "auth/network-request-failed":
        setFormError("Network error. Check your connection and try again.");
        break;
      case "auth/too-many-requests":
        setFormError("Too many attempts. Please wait a moment and try again.");
        break;
      default:
        setFormError("Sign up failed. Please try again.");
        console.log("Firebase signup error:", code, message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setErrors({});
    setLoading(true);

    const { next, auPhone, emailTrim } = validate();
    if (Object.keys(next).length > 0) {
      setErrors(next);
      setLoading(false);
      return;
    }

    try {
      const { user } = await createAuthUserWithEmailAndPassword(
        emailTrim,
        password
      );

      const displayName = `${firstName.trim()} ${lastName.trim()}`;
      await createUserDocFromAuth(user, { displayName, phone: auPhone });

      await sendEmailVerification(user, {
        url: `${window.location.origin}/otp`,
      });

      sessionStorage.setItem("mfa_enroll_phone", auPhone);
      navigate("/verifyemail");
    } catch (err) {
      // err.code, err.message from Firebase
      applyFirebaseError(err.code, err.message);
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
      <Box maxWidth="360px" width="100%">
        <Card size="4" asChild>
          <form onSubmit={handleSubmit} noValidate>
            <Flex direction="column" gap="5">
              <div>
                <TextField.Root
                  name="firstName"
                  type="text"
                  placeholder="firstname"
                  value={firstName}
                  onChange={handleChange}
                  autoComplete="given-name"
                  aria-invalid={!!errors.firstName}
                />
                {errors.firstName && (
                  <Text color="ruby" size="1">
                    {errors.firstName}
                  </Text>
                )}
              </div>

              <div>
                <TextField.Root
                  name="lastName"
                  type="text"
                  placeholder="lastname"
                  value={lastName}
                  onChange={handleChange}
                  autoComplete="family-name"
                  aria-invalid={!!errors.lastName}
                />
                {errors.lastName && (
                  <Text color="ruby" size="1">
                    {errors.lastName}
                  </Text>
                )}
              </div>

              <div>
                <TextField.Root
                  name="email"
                  type="email"
                  placeholder="email"
                  value={email}
                  onChange={handleChange}
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <Text color="ruby" size="1">
                    {errors.email}
                  </Text>
                )}
              </div>

              <div>
                <TextField.Root
                  name="phone"
                  type="tel"
                  placeholder="mobile - 04… or +614…"
                  value={phone}
                  onChange={handleChange}
                  inputMode="tel"
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && (
                  <Text color="ruby" size="1">
                    {errors.phone}
                  </Text>
                )}
              </div>

              <div>
                <TextField.Root
                  name="password"
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                />
                {errors.password && (
                  <Text color="ruby" size="1">
                    {errors.password}
                  </Text>
                )}
              </div>

              <div>
                <TextField.Root
                  name="confirmPassword"
                  type="password"
                  placeholder="confirm password"
                  value={confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  aria-invalid={!!errors.confirmPassword}
                />
                {errors.confirmPassword && (
                  <Text color="ruby" size="1">
                    {errors.confirmPassword}
                  </Text>
                )}
              </div>

              {/* Top-level form error (non-field) */}
              {formError && <Text color="ruby">{formError}</Text>}

              <Button type="submit" disabled={loading}>
                {loading ? "Signing up…" : "Sign up"}
              </Button>
              <Link href="/login">Login Instead</Link>
            </Flex>
          </form>
        </Card>
      </Box>
    </Box>
  );
};

export default Signup;
