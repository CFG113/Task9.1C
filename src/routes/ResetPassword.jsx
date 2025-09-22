import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { verifyResetCode, confirmResetPassword } from "@/utils/firebase";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const oobCode = params.get("oobCode");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [verifying, setVerifying] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // verify the reset code once
  useEffect(() => {
    setError("");

    if (!oobCode) {
      setError("Invalid reset link.");
      setVerifying(false);
      return;
    }

    verifyResetCode(oobCode)
      .catch(() => setError("This reset link is invalid or has expired."))
      .finally(() => setVerifying(false));
  }, [oobCode]);

  const handleSubmit = async () => {
    setError("");

    if (!password) return setError("Please enter a new password.");
    if (password.length < 6)
      return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");

    setLoading(true);
    try {
      await confirmResetPassword(oobCode, password);
      navigate("/login");
    } catch (error) {
      console.error(error);
      setError("Failed to reset password. The link may have expired.");
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
            <Text as="h2" weight="bold" size="4">
              Reset your password
            </Text>

            {verifying && (
              <Callout.Root color="gray" role="status" aria-live="polite">
                <Callout.Text>Checking your reset link…</Callout.Text>
              </Callout.Root>
            )}

            {error && (
              <Callout.Root color="red" role="alert" aria-live="assertive">
                <Callout.Text>
                  <Text weight="bold">Reset error:</Text> {error}
                </Callout.Text>
              </Callout.Root>
            )}

            {!verifying && !error && (
              <>
                <TextField.Root
                  name="newPassword"
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <TextField.Root
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  disabled={loading}
                />

                <Flex justify="between" align="center">
                  <Link href="/login">Back to sign in</Link>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    aria-busy={loading}
                  >
                    {loading ? "Updating…" : "Update password"}
                  </Button>
                </Flex>
              </>
            )}
          </Flex>
        </Card>
      </Box>
    </Box>
  );
}
