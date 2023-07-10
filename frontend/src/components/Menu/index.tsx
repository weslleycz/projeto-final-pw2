import { Box, Grid, Stack } from "@mui/material";
import { AvatarHeader } from "../AvatarHeader";
import styles from "./styles.module.scss";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const Menu = () => {
  const pathname = usePathname();
  const userId = getCookie("id");

  const router = useRouter();

  const handlingEsc = () => {
    deleteCookie("token")
    router.push("/");
  }

  return (
    <>
      <Grid sx={{ bgcolor: "#ffffff", height: "90vh" }} item xs={6} md={2.5}>
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
            {pathname === `/perfil/${userId}` ? (
              <button className={styles["btn-on"]}>
                <span className={styles.line}></span>
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
              <Link href={`/perfil/${userId}`}>
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
            <button onClick={()=>handlingEsc()} className={styles["btn-off-esc"]}>
              <span></span>
              <Box className={styles["btn-text"]}>
                <Image
                  src="/LogoutOutlined.svg"
                  width={30}
                  height={30}
                  alt="Feed"
                />
                <strong>Sair</strong>
              </Box>
            </button>
          </Stack>
        </Box>
      </Grid>
    </>
  );
};
