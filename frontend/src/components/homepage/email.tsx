import { useEffect, useState } from "react";
import { Email as EmailInterface } from "@/pages/api/types";
import {
  Button,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { htmlEscape, stringAvatar } from "@/utils/string";
import { API_BASE_URL } from "@/utils/consts";

export default function Email({
  emailId,
  clearActiveEmailId,
  handleEmailDeleted,
}: {
  emailId: number;
  clearActiveEmailId: () => void;
  handleEmailDeleted: () => void;
}) {
  const [email, setEmail] = useState<EmailInterface | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const deleteEmail = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/emails/${emailId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete email");
      }
      handleEmailDeleted();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      clearActiveEmailId();
    }
  };

  useEffect(() => {
    if (!emailId) {
      return;
    }

    async function loadEmail() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/emails/${emailId}`);
        if (!res.ok) {
          throw new Error("Failed to load email");
        }
        const data = await res.json();
        setEmail(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadEmail();
  }, [emailId]);

  if (loading) {
    return <Typography variant="body1">Loading...</Typography>;
  }

  if (error) {
    return (
      <Typography variant="body1" color="error">
        {error}
      </Typography>
    );
  }

  if (!email) {
    return <Typography variant="body1">No email found</Typography>;
  }

  return (
    <>
      {email.to && (
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar {...stringAvatar(email.to || "")} />
          </ListItemAvatar>
          <ListItemText
            primary={email?.subject}
            secondary={
              <span style={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" component="span">
                  TO: {email.to}
                </Typography>
                {email.cc && (
                  <Typography variant="body2" component="span">
                    CC: {email.cc}
                  </Typography>
                )}
                {email.bcc && (
                  <Typography variant="body2" component="span">
                    BCC: {email.bcc}
                  </Typography>
                )}
                <Divider sx={{ my: 1 }} component="span" />
                <Typography variant="body1" component="span">
                  {htmlEscape(email.body)}
                </Typography>
              </span>
            }
          />
        </ListItem>
      )}
      {!email && <Typography variant="body1">No email found</Typography>}
      <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-start" }}>
        <Button onClick={clearActiveEmailId} variant="contained">
          Back
        </Button>
        <Button
          onClick={() => {
            if (window.confirm("Are you sure you want to delete this email?")) {
              deleteEmail();
            }
          }}
          color="error"
        >
          Delete
        </Button>
      </Box>
    </>
  );
}
