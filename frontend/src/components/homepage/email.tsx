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

export default function Email({
  emailId,
  clearActiveEmailId,
}: {
  emailId: number;
  clearActiveEmailId: () => void;
}) {
  const [email, setEmail] = useState<EmailInterface | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!emailId) {
      return;
    }

    async function loadEmail() {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3001/emails/${emailId}`);
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
      <Button onClick={clearActiveEmailId} variant="contained">
        Back
      </Button>
    </>
  );
}
