import { useState } from "react";
import {
  Box,
  Card,
  Flex,
  TextField,
  Button,
  Callout,
  Text,
  Link,
} from "@radix-ui/themes";
import { resetPassword, userExistsByEmail } from "@/utils/firebase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setError("");
    setSent("");
    setEmail(event.target.value);
  };

  const handleSubmit = async () => {
    setError("");
    setSent("");

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const exists = await userExistsByEmail(trimmed);
      if (!exists) {
        setError("We couldn't find an account with that email.");
        setLoading(false);
        return;
      }

      await resetPassword(trimmed);
      console.log("reset email sent");
      setSent("Password reset email sent. Check your inbox.");
    } catch (error) {
      console.error(error);
      setError("Failed to send reset email. Please try again.");
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
            <Text as="p" size="2">
              Enter your account email and we'll send a password reset link.
            </Text>

            {sent && (
              <Callout.Root color="green" role="status" aria-live="polite">
                <Callout.Text>{sent}</Callout.Text>
              </Callout.Root>
            )}

            {error && (
              <Callout.Root color="red" role="alert" aria-live="assertive">
                <Callout.Text>
                  <Text weight="bold">Reset error:</Text> {error}
                </Callout.Text>
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

            <Flex justify="between" align="center">
              <Link href="/login">Back to sign in</Link>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? "Sending…" : "Send reset link"}
              </Button>
            </Flex>
          </Flex>
        </Card>
      </Box>
    </Box>
  );
}
