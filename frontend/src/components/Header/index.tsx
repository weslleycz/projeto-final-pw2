import { Box } from "@mui/material";
import Image from "next/image";
import styles from "./styles.module.scss";
import Link from "next/link";

export const Header = () => {
  return (
    <>
      <Box className={styles.conteiner}>
      <Link href="/feed">
        <Image
           className={styles.logo}
          src="/Logo.svg"
          width={40}
          height={40}
          alt="Logo"
        />
      </Link>
      </Box>
    </>
  );
};
