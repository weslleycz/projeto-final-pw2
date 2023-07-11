import { IUser } from "@/types/IUser";
import { getCookie } from "cookies-next";
import styles from "./styles.module.scss";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import { FormeEdit } from "../FormeEdit";
import { AxiosResponse } from "axios";
import { api } from "@/services/apí";
import { useQueryClient } from "react-query";

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
  const token = getCookie("token");

  const queryClient = useQueryClient();

  const handleUpload = async () => {
    try {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";

      fileInput.click();

      fileInput.onchange = async (event) => {
        if (
          event.target &&
          event.target.files &&
          event.target.files.length > 0
        ) {
          const file = event.target.files[0];

          const formData = new FormData();
          formData.append("file", file);

          const response: AxiosResponse = await api.put(
            "/files/upload",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                token: token,
              },
            }
          );
          // setIdAvatar(response.data);
          await api
            .patch(`/user/${id}`, {
              name: name,
              bio: bio,
              avatar: avatar,
              cover: response.data,
            })
            .then(() => {
              queryClient.refetchQueries("getUser");
            });
        }
      };
    } catch (error) {
      console.log(error);
    }
  };

  const imageUrl = `${process.env.API_Url}/files/download/${cover}`;

  return (
    <>
      <Box className={styles.conteiner}>
        <Box
         style={{ backgroundImage: `url(${imageUrl})` }}
         className={styles["cover-container"]}>
          <Box
            className={styles.cover}
          >
          </Box>
          <Box className={styles["cover-icon"]}>
            {userId === id ? (
              <IconButton
                onClick={handleUpload}
                sx={{ marginRight: 1 }}
                aria-label="Example"
              >
                <CreateIcon sx={{ color: "#ffffff" }} />
              </IconButton>
            ) : null}
          </Box>
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
