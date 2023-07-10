import { IUser } from "@/types/IUser";
import { getCookie } from "cookies-next";
import styles from "./styles.module.scss";
import { Avatar, Box, Button, Typography } from "@mui/material";

export const ProfileInfo = ({ id, name, cover, bio }: IUser) => {
  const userId = getCookie("id");
  return (
    <>
      <Box className={styles.conteiner}>
        <Box className={styles.cover}></Box>
        <Box className={styles.cont}>
          <Box className={styles["conteiner-edit"]}>
            <Box className={styles.avatar}>
              <Avatar
                src={`${process.env.API_Url}/files/avatar/${id}`}
                sx={{
                  bgcolor: "#3BD6CC",
                  width: 125,
                  height: 125,
                  marginLeft: 1,
                  fontSize: "3rem",
                  marginTop: -9,
                  marginBottom: 1,
                }}
              >
              </Avatar>
              <Typography fontWeight={"bold"} variant="h5" gutterBottom>
                {name}
              </Typography>
            </Box>
            {userId === id ? (
              <Button
                sx={{
                  marginLeft: 1,
                  marginTop: -8,
                }}
                variant="outlined"
              >
                Editar perfil
              </Button>
            ) : null}
          </Box>
          <Typography variant="subtitle2" gutterBottom>
            {bio}
          </Typography>
        </Box>
      </Box>
    </>
  );
};
