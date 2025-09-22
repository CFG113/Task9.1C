import { Dialog, Button, Flex } from "@radix-ui/themes";

export default function DeleteModal({ deleting, onConfirm }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button color="ruby">Delete</Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Delete tutorial?</Dialog.Title>

        <Dialog.Description>
          Are you sure you want to delete this tutorial?
        </Dialog.Description>

        <Flex justify="between" gap="3" mt="4">
          <Dialog.Close>
            <Button variant="soft" disabled={deleting}>
              Cancel
            </Button>
          </Dialog.Close>
          <Button color="ruby" onClick={onConfirm} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
