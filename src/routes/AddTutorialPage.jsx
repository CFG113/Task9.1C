import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { useState, useContext } from "react";
import { Form } from "radix-ui";
import { Button, Text, Flex } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import { uploadVideo, createTutorialDocFromData } from "@/utils/firebase";
import { UserContext } from "../context/user.context";
import { uploadThumbnail } from "@/utils/firebase";

function AddTutorialPage() {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const [files, setFiles] = useState();
  const [form, setForm] = useState({ title: "" });
  const [thumbnail, setThumbnail] = useState();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { title } = form;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((preValue) => ({ ...preValue, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!currentUser?.uid) throw new Error("Not signed in");
      setLoading(true);

      const uid = currentUser.uid;

      const [videoUrl, thumbnailUrl] = await Promise.all([
        uploadVideo(files[0], uid),
        uploadThumbnail(thumbnail[0], uid),
      ]);

      await createTutorialDocFromData({
        title: title.trim(),
        videoUrl,
        thumbnailUrl,
        uploaderUid: uid,
        uploaderName: currentUser.displayName,
      });

      setSuccess(true);
      // brief confirmation, then go to /tutorials
      setTimeout(() => navigate("/tutorials"), 700);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center py-10">
      <div className="w-full max-w-md px-4">
        <h1 className="text-2xl font-semibold text-center mb-6">
          This is Add Tutorials Page.
        </h1>

        <Form.Root onSubmit={handleSubmit} className="space-y-5">
          <Form.Field name="title" className="space-y-2">
            <Form.Label className="block text-sm">Title</Form.Label>
            <Form.Control asChild>
              <input
                name="title"
                required
                value={title}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2"
              />
            </Form.Control>
            <Form.Message match="valueMissing" className="text-red-600 text-sm">
              Please enter a title.
            </Form.Message>
          </Form.Field>

          <Form.Field
            name="thumbnail"
            serverInvalid={!thumbnail?.length}
            className="space-y-2"
          >
            <Form.Label className="block text-sm">Thumbnail</Form.Label>
            <Form.Control asChild>
              <div>
                <Dropzone
                  accept={{ "image/*": [] }}
                  maxFiles={1}
                  onDrop={setThumbnail}
                  onError={console.error}
                  src={thumbnail}
                >
                  <DropzoneEmptyState />
                  <DropzoneContent />
                </Dropzone>
              </div>
            </Form.Control>
            <Form.Message forceMatch={!thumbnail?.length} asChild>
              <Text color="ruby">Please add a thumbnail.</Text>
            </Form.Message>
          </Form.Field>

          <Form.Field
            name="video"
            serverInvalid={!files?.length}
            className="space-y-2"
          >
            <Form.Label className="block text-sm">Video</Form.Label>
            <Form.Control asChild>
              <div>
                <Dropzone
                  accept={{ "video/*": [] }}
                  maxFiles={1}
                  onDrop={setFiles}
                  onError={console.error}
                  src={files}
                >
                  <DropzoneEmptyState />
                  <DropzoneContent />
                </Dropzone>
              </div>
            </Form.Control>
            <Form.Message forceMatch={!files?.length} asChild>
              <Text color="ruby">Please add a video.</Text>
            </Form.Message>
          </Form.Field>

          <Button
            color="lightred"
            disabled={loading || !files?.length || !thumbnail?.[0]}
            className="mt-2"
          >
            {loading ? "Saving…" : "Save"}
          </Button>

          {success && (
            <Flex mt="2" justify="center">
              <Text color="green">Upload successful - redirecting...</Text>
            </Flex>
          )}
        </Form.Root>
      </div>
    </div>
  );
}

export default AddTutorialPage;
