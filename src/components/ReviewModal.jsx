import { useState } from "react";
import { Dialog, Button, Flex, Text, RadioGroup } from "@radix-ui/themes";

export default function ReviewModal({ onSubmit }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState("");

  function handleSubmit() {
    if (!rating) return;
    onSubmit?.(Number(rating));
    setOpen(false);
    setRating("");
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button>Review this tutorial</Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Review this tutorial</Dialog.Title>
        <Dialog.Description>Select a rating from 1 to 5.</Dialog.Description>

        <RadioGroup.Root value={rating} onValueChange={setRating}>
          <Flex direction="column" gap="2" mt="3">
            {[1, 2, 3, 4, 5].map((n) => (
              <RadioGroup.Item key={n} value={String(n)}>
                <Text>
                  {n} {n === 1 ? "star" : "stars"}
                </Text>
              </RadioGroup.Item>
            ))}
          </Flex>
        </RadioGroup.Root>

        <Flex justify="between" gap="3" mt="4">
          <Dialog.Close>
            <Button variant="soft" onClick={() => setRating("")}>
              Cancel
            </Button>
          </Dialog.Close>
          <Button onClick={handleSubmit} disabled={!rating}>
            Submit
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
