import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import { Email as EmailInterface } from "@/pages/api/types";
import Grid from "@mui/material/Grid";
import Email from "./email";
import { stringAvatar } from "@/utils/string";

export default function Emails() {
  const [emails, setEmails] = useState<EmailInterface[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeEmailId, setActiveEmailId] = useState<number | null>(null);

  useEffect(() => {
    // Check if there's a hash in the URL (e.g., #5)
    const hash = window.location.hash;
    if (hash && hash.startsWith("#")) {
      const id = parseInt(hash.substring(1), 10);
      if (!isNaN(id)) {
        setActiveEmailId(id);
      }
    }
  }, []);

  useEffect(() => {
    fetch("http://localhost:3001/emails")
      .then((res) => res.json())
      .then((data) => setEmails(data))
      .catch((error) => setError(error.message));
  }, []);

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Emails
      </Typography>
      <Grid container spacing={2}>
        <Grid size={6} key={crypto.randomUUID()}>
          <List
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "background.paper",
              overflowY: "auto",
              maxHeight: "calc(100vh - 100px)",
            }}
          >
            {emails.map((email) => (
              <ListItem
                key={email.id}
                alignItems="flex-start"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveEmailId(email.id);
                  window.location.hash = `#${email.id}`;
                }}
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    activeEmailId === email.id ? "lightgray" : "white",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <ListItemAvatar>
                  <Avatar {...stringAvatar(email.to)} />
                </ListItemAvatar>
                <ListItemText
                  primary={email.subject}
                  secondary={
                    <>
                      <Typography variant="body2" component="span">
                        {email.body.slice(0, 40)}
                      </Typography>
                      <Typography variant="body2" component="span">
                        {email.created_at}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
            {error && (
              <Typography variant="body1" color="error">
                Error loading emails
              </Typography>
            )}
            {emails.length === 0 && !error && (
              <Typography variant="body1">No emails found</Typography>
            )}
          </List>
        </Grid>
        <Grid size={6} key={activeEmailId}>
          {activeEmailId && (
            <Email
              emailId={activeEmailId}
              clearActiveEmailId={() => setActiveEmailId(null)}
            />
          )}
        </Grid>
      </Grid>
    </div>
  );
}
