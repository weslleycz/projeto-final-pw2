import { Box, IconButton } from "@mui/material";
import styles from "./styles.module.scss";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { deleteCookie } from "cookies-next";

export const MenuMobile = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handlingEsc = () => {
    deleteCookie("token");
    router.push("/");
  };

  return (
    <>
      <div className={styles.footer}>
        <Box className={styles["iten-menu"]}>
          {pathname === "/" || pathname === "/feed" ? (
            <IconButton aria-label="Ícone">
              <Link href="/feed">
                <Image
                  src="/FeedIco-on.svg"
                  width={30}
                  height={30}
                  alt="Feed"
                />
              </Link>
            </IconButton>
          ) : (
            <IconButton aria-label="Ícone">
              <Link href="/feed">
                <Image
                  src="/FeedIco-off.svg"
                  width={25}
                  height={25}
                  alt="Feed"
                />
              </Link>
            </IconButton>
          )}
        </Box>
        <Box className={styles["iten-menu"]}>
          {pathname === "/perfil" ? (
            <IconButton aria-label="Ícone">
              <Link href="/perfil">
                <Image src="/Perfil-on.svg" width={30} height={30} alt="Feed" />
              </Link>
            </IconButton>
          ) : (
            <IconButton aria-label="Ícone">
              <Link href="/perfil">
                <Image
                  src="/Perfil-off.svg"
                  width={25}
                  height={25}
                  alt="Feed"
                />
              </Link>
            </IconButton>
          )}
        </Box>
        <Box sx={{ cursor: "pointer" }} className={styles["iten-menu"]}>
          <Box >
            <IconButton  aria-label="Ícone">
              <Image
                onClick={() => handlingEsc()}
                className={styles["btn-off-esc"]}
                src="/LogoutOutlined.svg"
                width={25}
                height={25}
                alt="Feed"
              />
            </IconButton>
          </Box>
        </Box>
      </div>
    </>
  );
};
