import { Button, Grid, TextField } from "@mui/material";
import { useState, useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import AiPromptModal from "./modal";
import { API_BASE_URL } from "@/utils/consts";

type Inputs = {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  body: string;
};

export default function NewEmail() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();

  const [aiPromptOpen, setAiPromptOpen] = useState(false);

  const setAiSubject = (subject: string) => {
    setValue("subject", subject);
  };
  const setAiBody = (body: string) => {
    setValue("body", body);
  };

  const handleAiButtonClick = () => {
    setAiPromptOpen(true);
  };

  const handleAiPromptClose = () => {
    setAiPromptOpen(false);
  };

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    (data) => {
      fetch(`http://localhost:3001/emails/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then(async (res) => {
          if (!res.ok) {
            return new Promise((_resolve, reject) => {
              reject(new Error("Failed to send email"));
            });
          }

          alert("Email sent successfully!");
          router.push(`/`);
        })
        .catch((err) => {
          console.error("Error:", err);
          alert("Failed to send email.");
        });
    },
    [router]
  );

  return (
    <div>
      <h1>New Email</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} direction="column">
          <Grid size={6}>
            <TextField
              id="to"
              label="To"
              {...register("to", {
                required: true,
                pattern: {
                  // value: /^([\w+-.%]+@[\w-.]+\.[A-Za-z]{2,4};?\s?)+$/i, // regex for multiple emails ; separated
                  value: /^[\w+-.%]+@[\w-.]+\.[A-Za-z]{2,}$/i, // regex for single email address
                  message: "Invalid email address",
                },
              })}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              fullWidth
              error={!!errors.to}
              helperText={errors.to?.message}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              id="cc"
              label="CC"
              {...register("cc", {
                pattern: {
                  value: /^[\w+-.%]+@[\w-.]+\.[A-Za-z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              fullWidth
              error={!!errors.cc}
              helperText={errors.cc?.message}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              id="bcc"
              label="BCC"
              {...register("bcc", {
                pattern: {
                  value: /^[\w+-.%]+@[\w-.]+\.[A-Za-z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              fullWidth
              error={!!errors.bcc}
              helperText={errors.bcc?.message}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              id="subject"
              label="Subject"
              {...register("subject", {
                required: true,
              })}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              type="text"
              error={!!errors.subject}
              helperText={errors.subject?.message}
              fullWidth
            />
          </Grid>
          <Grid size={6}>
            <TextField
              id="body"
              label="Body"
              {...register("body", {
                required: true,
              })}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              type="text"
              error={!!errors.body}
              helperText={errors.body?.message}
              multiline
              rows={4}
              fullWidth
            />
          </Grid>
          <Grid size={12}>
            <Button variant="contained" type="submit">
              Send
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleAiButtonClick}
              style={{ marginLeft: 8 }}
            >
              AI ✨
            </Button>
          </Grid>
        </Grid>
      </form>
      <AiPromptModal
        opened={aiPromptOpen}
        CloseModal={handleAiPromptClose}
        setAiSubject={setAiSubject}
        setAiBody={setAiBody}
      />
    </div>
  );
}
