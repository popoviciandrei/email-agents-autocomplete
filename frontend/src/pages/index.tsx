import styles from "@/styles/Home.module.css";
import NewEmailButton from "@/components/buttons/NewEmailButton";
import Emails from "@/components/homepage/emails";

export default function Home() {
  return (
    <div className={styles.container}>
      <Emails />
      <NewEmailButton />
    </div>
  );
}
