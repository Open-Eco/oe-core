import "../globals.css";
import styles from "./layout.module.css";
import Link from "next/link";
import { ReactNode } from "react";
import TopNav from "@/components/Navigation/TopNav";
import Sidebar from "@/components/Navigation/Sidebar";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  // TODO: Get user from session
  const user = {
    name: "User",
    email: "user@example.com",
  };

  return (
    <div className={styles.appLayout}>
      <TopNav user={user} />
      <div className={styles.appLayoutBody}>
        <Sidebar />
        <main className={styles.appLayoutMain}>{children}</main>
      </div>
    </div>
  );
}
