import { IUser } from "@/types/IUser";
import { getCookie } from "cookies-next";
import styles from "./styles.module.scss";
import { Avatar, Box, Typography } from "@mui/material";
import { FormeEdit } from "../FormeEdit";


type Props = {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  cover: string;
  refetch: any;
};

export const ProfileInfo = ({
  avatar,
  bio,
  cover,
  email,
  id,
  name,
  refetch,
}: Props) => {
  const userId = getCookie("id");
  return (
    <>
      <Box className={styles.conteiner}>
        <Box className={styles.cover}>
          
        </Box>
        <Box className={styles.cont}>
          <Box className={styles["conteiner-edit"]}>
            <Box className={styles.avatar}>
              <Avatar
                src={`${process.env.API_Url}/files/download/${avatar}`}
                sx={{
                  bgcolor: "#3BD6CC",
                  width: 125,
                  height: 125,
                  marginLeft: 1,
                  fontSize: "3rem",
                  marginTop: -9,
                  marginBottom: 1,
                }}
              ></Avatar>
              <Typography fontWeight={"bold"} variant="h5" gutterBottom>
                {name}
              </Typography>
            </Box>
            {userId === id ? (
              <FormeEdit
                id={id}
                name={name}
                email={email}
                bio={bio}
                avatar={avatar}
                cover={cover}
                refetch={refetch}
              />
            ) : null}
          </Box>
          <Box className={styles["conteiner-bio"]}>
            <Typography fontWeight={"bold"} variant="subtitle2" gutterBottom>
              {bio}
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};
