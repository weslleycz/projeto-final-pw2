import { Box } from "@mui/material";
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
    deleteCookie("token")
    router.push("/");
  }

  return (
    <>
      <div className={styles.footer}>
        <Box className={styles["iten-menu"]}>
          {pathname === "/" || pathname === "/feed" ? (
            <Link href="/feed">
            <Image src="/FeedIco-on.svg" width={30} height={30} alt="Feed" />
            </Link>
          ) : (
            <Link href="/feed">
            <Image src="/FeedIco-off.svg" width={25} height={25} alt="Feed" />
            </Link>
          )}
        </Box>
        <Box className={styles["iten-menu"]}>
          {pathname === "/perfil" ? (
            <Link href="/perfil">
              <Image src="/Perfil-on.svg" width={30} height={30} alt="Feed" />
            </Link>
          ) : (
            <Link href="/perfil">
              <Image src="/Perfil-off.svg" width={25} height={25} alt="Feed" />
            </Link>
          )}
        </Box>
        <Box className={styles["iten-menu"]}>
          <Image onClick={()=>handlingEsc()} className={styles["btn-off-esc"]} src="/LogoutOutlined.svg" width={25} height={25} alt="Feed" />
        </Box>
      </div>
    </>
  );
};
