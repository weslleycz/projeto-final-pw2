import { Avatar, Box, Divider, Stack, makeStyles } from "@mui/material";
import styles from "./styles.module.scss";
import { IPost } from "@/types/IPost";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";

export const Post = ({ date, image, likes, text, userId, comments }: IPost) => {
  return (
    <>
      <Box className={styles.container}>
        <Box  className={styles['container-likes']} >
        <Image
          className={styles.logo}
          src="/Likes.svg"
          width={25}
          height={25}
          alt="Likes"
          style={{ marginLeft: 'auto' }}
        />
        </Box>
        <Box>
          <Stack
            className={styles["avatar-container"]}
            direction="row"
            spacing={2}
          >
            <Avatar
              src={`${process.env.API_Url}/files/avatar/${userId}`}
              sx={{ width: 56, height: 56 }}
            >
              H
            </Avatar>
            <Box>
              <strong className={styles["avatar-text"]}>John Doe</strong>
              <p className={styles["avatar-date"]}>
                {formatDistanceToNow(new Date(date), {
                  addSuffix: true,
                  locale: ptBR,
                }).toString()}
              </p>
            </Box>
          </Stack>
          <p className={styles["post-title"]}>{text}</p>
        </Box>
        <Divider sx={{ width: "90%" }} />
        <footer className={styles["footer-container"]}>
          <Stack direction="row" spacing={2}>
            <Box>
              <Stack
                className={styles["footer-iten"]}
                direction="row"
                spacing={1}
              >
                <Image
                  className={styles.logo}
                  src="/Likes.svg"
                  width={12}
                  height={12}
                  alt="Likes"
                />
                <p>{`${likes} Likes`}</p>
              </Stack>
            </Box>
            <Box>
              <Stack
                className={styles["footer-iten"]}
                direction="row"
                spacing={1}
              >
                <Image
                  className={styles.logo}
                  src="/comment.svg"
                  width={12}
                  height={12}
                  alt="comment"
                />
                <p>{`${comments.length} Comerciários`}</p>
              </Stack>
            </Box>
          </Stack>
        </footer>
      </Box>
    </>
  );
};
