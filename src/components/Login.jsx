// src/routes/Login.jsx
import { useState, useEffect, useRef } from "react";
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
  signInWithGooglePopup,
  createUserDocFromAuth,
  signinAuthUserWithEmailAndPassword,
  auth,
} from "@/utils/firebase";
import { useNavigate } from "react-router-dom";
import {
  getMultiFactorResolver,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
} from "firebase/auth";
import { validateLoginForm, loginErrorMessage } from "@/utils/error";

export default function Login() {
  const navigate = useNavigate();

  const [contact, setContact] = useState({ email: "", password: "" });
  const { email, password } = contact;

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // MFA UX banners
  const [mfaStatus, setMfaStatus] = useState("");

  // Invisible reCAPTCHA instance
  const recaptchaRef = useRef(null);

  useEffect(() => {
    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container-id",
        {
          size: "invisible",
        }
      );
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setContact((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const logGoogleUser = async () => {
    setLoading(true);
    try {
      const { user } = await signInWithGooglePopup();
      await createUserDocFromAuth(user);
      navigate("/");
    } catch (err) {
      setError(loginErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const msg = validateLoginForm(email, password);
    if (msg) {
      setError(msg);
      setLoading(false);
      return;
    }

    try {
      const { user } = await signinAuthUserWithEmailAndPassword(
        email,
        password
      );
      navigate("/");
    } catch (error) {
      // MFA required flow
      if (error.code === "auth/multi-factor-auth-required") {
        try {
          const resolver = getMultiFactorResolver(auth, error);
          const phoneHint = resolver.hints.find(
            (h) => h.factorId === PhoneMultiFactorGenerator.FACTOR_ID
          );
          if (!phoneHint) {
            setError(
              "A second factor is required for this account, but no supported factor was found."
            );
            return;
          }

          if (!recaptchaRef.current) {
            recaptchaRef.current = new RecaptchaVerifier(
              auth,
              "recaptcha-container-id",
              { size: "invisible" }
            );
          }

          // Show “sending” while Firebase dispatches the SMS
          setMfaStatus("Sending SMS code…");
          const phoneInfoOptions = {
            multiFactorHint: phoneHint,
            session: resolver.session,
          };
          const provider = new PhoneAuthProvider(auth);
          const verificationId = await provider.verifyPhoneNumber(
            phoneInfoOptions,
            recaptchaRef.current
          );

          setMfaStatus("");

          const verificationCode = window.prompt("Enter the SMS code");
          if (!verificationCode) {
            setError("SMS verification cancelled.");
            return;
          }

          setMfaStatus("Verifying SMS code...");
          const cred = PhoneAuthProvider.credential(
            verificationId,
            verificationCode
          );
          const assertion = PhoneMultiFactorGenerator.assertion(cred);
          const userCred = await resolver.resolveSignIn(assertion);

          setMfaStatus("");
          navigate("/");
        } catch (error) {
          console.log(error);
          setMfaStatus("");
          setError(loginErrorMessage(error));
        }
      } else {
        console.log(error);
        setError(loginErrorMessage(error));
      }
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
                  <Text weight="bold">Sign in error:</Text> {error}
                </Callout.Text>
              </Callout.Root>
            )}

            {mfaStatus && (
              <Callout.Root color="gray" role="status" aria-live="polite">
                <Callout.Text>{mfaStatus}</Callout.Text>
              </Callout.Root>
            )}

            <TextField.Root
              name="email"
              type="email"
              placeholder="email"
              value={email}
              onChange={handleChange}
              disabled={loading}
            />
            <TextField.Root
              name="password"
              type="password"
              placeholder="password"
              value={password}
              onChange={handleChange}
              disabled={loading}
            />

            <Button
              onClick={handleSubmit}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? "Signing in…" : "Sign in"}
            </Button>

            <Button variant="soft" onClick={logGoogleUser} disabled={loading}>
              Google sign in
            </Button>

            <Flex justify="between" align="center">
              <Link href="/signup">Sign up Instead</Link>
              <Link href="/forgot-password">Forgot password?</Link>
            </Flex>

            {/* Invisible reCAPTCHA container */}
            <div id="recaptcha-container-id" style={{ display: "none" }} />
          </Flex>
        </Card>
      </Box>
    </Box>
  );
}
