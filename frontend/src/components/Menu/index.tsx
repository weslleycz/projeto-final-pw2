import { Box, Grid, Stack } from "@mui/material";
import { AvatarHeader } from "../AvatarHeader";
import styles from "./styles.module.scss";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const Menu = () => {
  const pathname = usePathname();

  return (
    <>
      <Grid sx={{ bgcolor: "#ffffff", height: "91vh" }} item xs={6} md={2.5}>
        <AvatarHeader />
        <Box className={styles["btns-container"]}>
          <Stack spacing={2}>
            {pathname === "/" || pathname === "/feed" ? (
              <button className={styles["btn-on"]}>
                <span className={styles.line}></span>
                <Box className={styles["btn-text"]}>
                  <Image
                    src="/FeedIco-on.svg"
                    width={30}
                    height={30}
                    alt="Feed"
                  />
                  <strong>Feed</strong>
                </Box>
              </button>
            ) : (
              <Link href="/feed">
                <button className={styles["btn-off"]}>
                  <Box className={styles["btn-text"]}>
                    <Image
                      src="/FeedIco-off.svg"
                      width={30}
                      height={30}
                      alt="Feed"
                    />
                    <strong>Feed</strong>
                  </Box>
                </button>
              </Link>
            )}
            {pathname === "/perfil" ? (
              <button className={styles["btn-on"]}>
                <span></span>
                <Box className={styles["btn-text"]}>
                  <Image
                    src="/Perfil-on.svg"
                    width={25}
                    height={25}
                    alt="Perfil"
                  />
                  <strong>Perfil</strong>
                </Box>
              </button>
            ) : (
              <Link href="/perfil">
                <button className={styles["btn-off"]}>
                  <span></span>
                  <Box className={styles["btn-text"]}>
                    <Image
                      src="/Perfil-off.svg"
                      width={25}
                      height={25}
                      alt="Perfil"
                    />
                    <strong>Perfil</strong>
                  </Box>
                </button>
              </Link>
            )}
          </Stack>
        </Box>
      </Grid>
    </>
  );
};
