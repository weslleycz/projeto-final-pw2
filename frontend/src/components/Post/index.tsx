import { Avatar, Box, Divider, Stack, makeStyles } from "@mui/material";
import styles from "./styles.module.scss";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import { api } from "@/services/apí";
import { getCookie } from "cookies-next";
import { useQuery } from "react-query";

export type IPost = {
  id: string;
  text: string;
  image: string;
  date: string;
  likes: [];
  userId: string;
  comments: [];
  refetch: () => void;
  userIdPerfil: string;
};

export const Post = ({
  date: dateTime,
  image,
  likes,
  text,
  userId,
  comments,
  id,
  userIdPerfil,
  refetch,
}: IPost) => {
  const token = getCookie("token");
  const { data, isLoading } = useQuery("getUser", async () => {
    try {
      const user = await api.get("/user/private/token", {
        headers: {
          token,
        },
      });
      return user?.data;
    } catch (error) {
      console.log(error);
    }
  });
  const likesPost = async (refetch: () => void) => {
    await api.get(`/post/like/${id}`, {
      headers: {
        token,
      },
    });
    refetch();
  };
  return (
    <>
      <Box className={styles.container}>
        <Box className={styles["container-likes"]}>
          {likes.includes(userIdPerfil) ? <>
            <Image
            onClick={() => likesPost(refetch)}
            className={styles.logo}
            src="/Likes2.svg"
            width={25}
            height={25}
            alt="Likes"
            style={{ marginLeft: "auto", cursor: "pointer" }}
          />
          </> : <>          <Image
            onClick={() => likesPost(refetch)}
            className={styles.logo}
            src="/Likes1.svg"
            width={25}
            height={25}
            alt="Likes"
            style={{ marginLeft: "auto", cursor: "pointer" }}
          /></>}
        </Box>
        <Box>
          <Stack
            className={styles["avatar-container"]}
            direction="row"
            spacing={2}
          >
            {isLoading ? (
              <></>
            ) : (
              <Avatar
                src={`${process.env.API_Url}/files/avatar/${userId}`}
                sx={{ width: 56, height: 56, bgcolor: "#3BD6CC" }}
              >
                {data.name[0]}
              </Avatar>
            )}

            <Box>
              <strong className={styles["avatar-text"]}>John Doe</strong>
              <p className={styles["avatar-date"]}>
                {formatDistanceToNow(new Date(dateTime), {
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
                  src="/Likes1.svg"
                  width={12}
                  height={12}
                  alt="Likes"
                />
                <p>{`${likes.length} Likes`}</p>
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
