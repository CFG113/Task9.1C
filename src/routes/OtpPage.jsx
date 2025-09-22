import { useState, useEffect, useContext } from "react";
import {
  Box,
  Card,
  Flex,
  TextField,
  Button,
  Text,
  Callout,
} from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import { UserContext } from "@/context/user.context";
import { db, auth } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
} from "firebase/auth";

// persist across renders
let verificationId;
let recaptchaVerifier;
let autoSentOnce = false;

const OtpPage = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const [otp, setOtp] = useState("");
  const isSixDigits = /^\d{6}$/.test(otp);

  const [phone, setPhone] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState("");

  useEffect(() => {
    if (!currentUser) return;

    getDoc(doc(db, "users", currentUser.uid)).then((snap) => {
      const number = snap.data().phoneNumber;
      setPhone(number);
      if (!number || autoSentOnce) return;

      if (!recaptchaVerifier) {
        recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container-id",
          {
            size: "invisible",
          }
        );
      }

      autoSentOnce = true;
      multiFactor(currentUser)
        .getSession()
        .then((multiFactorSession) => {
          const phoneInfoOptions = {
            phoneNumber: number,
            session: multiFactorSession,
          };
          const phoneAuthProvider = new PhoneAuthProvider(auth);
          return phoneAuthProvider.verifyPhoneNumber(
            phoneInfoOptions,
            recaptchaVerifier
          );
        })
        .then((vid) => {
          verificationId = vid;
          setSent("SMS code sent."); // <-- was notice
          setError("");
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to send SMS code. Please try again.");
          setSent("");
        });
    });
  }, [currentUser]);

  const handleChange = (e) => {
    setError("");
    setSent(""); // clear the “sent” banner on input change
    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
  };

  const handleSubmit = async () => {
    setError("");
    setSent("");
    setLoading(true);

    if (!currentUser) {
      setLoading(false);
      setError("You must be signed in.");
      return navigate("/login");
    }
    if (!verificationId) {
      setLoading(false);
      setError("Code not sent yet. Please request a new code.");
      return;
    }
    if (!isSixDigits) {
      setLoading(false);
      setError("Enter the 6-digit code.");
      return;
    }

    try {
      const cred = PhoneAuthProvider.credential(verificationId, otp);
      const assertion = PhoneMultiFactorGenerator.assertion(cred);
      await multiFactor(currentUser).enroll(assertion, phone || "My phone");
      await currentUser.reload();
      setCurrentUser(currentUser);
      setSent("Phone verified. Redirecting…"); // success message
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Failed to verify the code. Please try again.");
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
            <Text size="2">
              Phone:{" "}
              <Text as="span" weight="bold">
                {phone ?? "unknown"}
              </Text>
            </Text>

            {sent && (
              <Callout.Root color="green" role="status" aria-live="polite">
                <Callout.Text>{sent}</Callout.Text>
              </Callout.Root>
            )}

            {error && (
              <Callout.Root color="red" role="alert" aria-live="assertive">
                <Callout.Text>
                  <Text as="span" weight="bold">
                    Verification error:
                  </Text>{" "}
                  {error}
                </Callout.Text>
              </Callout.Root>
            )}

            <div id="recaptcha-container-id" style={{ display: "none" }}></div>

            <TextField.Root
              name="verificationCode"
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={handleChange}
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              title="Enter the 6-digit code sent to your phone"
              disabled={loading}
            />
            <Button
              type="button"
              disabled={!isSixDigits || loading}
              onClick={handleSubmit}
              aria-busy={loading}
            >
              {loading ? "Verifying…" : "Verify"}
            </Button>
          </Flex>
        </Card>
      </Box>
    </Box>
  );
};

export default OtpPage;
