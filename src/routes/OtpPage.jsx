import { useState, useEffect, useContext } from "react";
import { Box, Card, Flex, TextField, Button, Text } from "@radix-ui/themes";
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

// persist across renders without new React state
let verificationId;
let recaptchaVerifier;
let autoSentOnce = false;

const OtpPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

  const [otp, setOtp] = useState("");
  const isSixDigits = /^\d{6}$/.test(otp);

  // minimal: fetch phone from Firestore user doc
  const [phone, setPhone] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    getDoc(doc(db, "users", currentUser.uid)).then((snap) => {
      const number = snap.data().phoneNumber;
      setPhone(number);
      if (!number || autoSentOnce) return;

      // ensure recaptcha exists after DOM is mounted
      if (!recaptchaVerifier) {
        recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container-id",
          { size: "invisible" }
        );
      }

      // send SMS once
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
          alert("SMS code sent.");
        })
        .catch((err) => {
          console.error(err);
          alert(err.message);
        });
    });
  }, [currentUser]);

  const handleChange = (e) => {
    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
  };

  // verify & enroll using the code the user typed
  const handleSubmit = async () => {
    if (!currentUser) {
      alert("You must be signed in.");
      navigate("/login");
      return;
    }
    if (!verificationId) {
      alert("Code not sent yet.");
      return;
    }
    if (!isSixDigits) return;

    try {
      const cred = PhoneAuthProvider.credential(verificationId, otp);
      const assertion = PhoneMultiFactorGenerator.assertion(cred);
      await multiFactor(currentUser).enroll(assertion, phone || "My phone");
      alert("Phone MFA enrolled successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.message || "OTP verification failed.");
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

            {/* reCAPTCHA target */}
            <div id="recaptcha-container-id" />

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
            />
            <Button
              type="button"
              disabled={!isSixDigits}
              onClick={handleSubmit}
            >
              Verify
            </Button>
          </Flex>
        </Card>
      </Box>
    </Box>
  );
};

export default OtpPage;
