import Link from "next/link";
import EmailIcon from "@mui/icons-material/Email";

import { Fab } from "@mui/material";

export default function NewEmailButton() {
  return (
    <Link
      href="/emails/new"
      aria-label="Send Email"
      style={{ position: "fixed", bottom: 16, right: 16 }}
    >
      <Fab color="primary" aria-label="Send Email">
        <EmailIcon />
      </Fab>
    </Link>
  );
}
