import EmailIcon from "@mui/icons-material/Email";
import Button from "@mui/material/Button";

export default function Sidebar() {
  return (
    <div className="sidebar" role="navigation">
      <Button
        variant="contained"
        startIcon={<EmailIcon style={{ color: "white" }} />}
        href="/"
      >
        Inbox
      </Button>
    </div>
  );
}
