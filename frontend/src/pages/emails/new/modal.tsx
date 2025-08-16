import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import { useState } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { emailTemplateSchema } from "@/pages/api/schema";

export default function AiPromptModal({
  opened,
  CloseModal,
  setAiSubject,
  setAiBody,
}: {
  opened: boolean;
  CloseModal: () => void;
  setAiSubject: (subject: string) => void;
  setAiBody: (body: string) => void;
}) {
  const {
    object,
    submit,
    stop,
    isLoading: isLoadingObject,
  } = useObject({
    // api: "/api/classify",
    api: "http://localhost:3001/emails/suggestions",
    schema: emailTemplateSchema,
    onFinish: ({ object, error }) => {
      if (object) {
        setAiSubject(object.subject);
        setAiBody(object.body);
        setTimeout(() => {
          CloseModal();
          setDescription("");
        }, 1000);
      }
      if (error) {
        alert("Failed to generate email template.");
      }
    },
  });

  const [description, setDescription] = useState("");

  return (
    <Dialog open={opened} onClose={CloseModal}>
      <DialogTitle>AI Email Assistant</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Describe what the email should be about (e.g., &apos;Meeting request
          for Tuesday&apos;):
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="ai-description"
          label="Description"
          type="text"
          fullWidth
          variant="standard"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            stop();

            CloseModal();
          }}
          color="secondary"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            submit({
              description,
            });
          }}
          color="primary"
          variant="outlined"
          disabled={!description}
          loading={isLoadingObject}
        >
          Generate
        </Button>
      </DialogActions>
    </Dialog>
  );
}
