import { api } from "@/services/apí";
import { Avatar, Box, Divider, Stack } from "@mui/material";
import { getCookie } from "cookies-next";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useQuery } from "react-query";
import styles from "./styles.module.scss";

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
  user: {
    name: string;
  };
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
  user,
}: IPost) => {
  const token = getCookie("token");
  const { data, isLoading } = useQuery("getUser", async () => {
    try {
      const user = await api.get(`/user/pubic/${userId}`);
      return user?.data;
    } catch (error) {
      console.log(error);
    }
  });
  const audioRef = useRef(null);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const likesPost = async (refetch: () => void) => {
    await api.get(`/post/like/${id}`, {
      headers: {
        token,
      },
    });
    refetch();
    handlePlay();
  };

  return (
    <>
      <Box className={styles.container}>
        <Box className={styles["container-likes"]}>
          {likes.includes(userIdPerfil) ? (
            <>
              <audio ref={audioRef} src="./notification.wav" />
              <Image
                onClick={() => likesPost(refetch)}
                className={styles.logo}
                src="/Likes2.svg"
                width={25}
                height={25}
                alt="Likes"
                style={{ marginLeft: "auto", cursor: "pointer" }}
              />
            </>
          ) : (
            <>
              {" "}
              <audio ref={audioRef} src="./notification.wav" />
              <Image
                onClick={() => likesPost(refetch)}
                className={styles.logo}
                src="/Likes1.svg"
                width={25}
                height={25}
                alt="Likes"
                style={{ marginLeft: "auto", cursor: "pointer" }}
              />
            </>
          )}
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
              <>
                <Link href={`/perfil/${userIdPerfil}`}>
                  <Avatar
                    src={`${process.env.API_Url}/files/avatar/${userId}`}
                    sx={{ width: 56, height: 56, bgcolor: "#3BD6CC" }}
                  >
                    {data?.name[0]}
                  </Avatar>
                </Link>
                <Box>
                  <Link href={`/perfil/${userIdPerfil}`}>
                    <strong className={styles["avatar-text"]}>
                      {user?.name}
                    </strong>
                  </Link>
                  <p className={styles["avatar-date"]}>
                    {formatDistanceToNow(new Date(dateTime), {
                      addSuffix: true,
                      locale: ptBR,
                    }).toString()}
                  </p>
                </Box>
              </>
            )}
          </Stack>
          <figure>
            {image ? (
              <img
                className={styles["post-img"]}
                src={`${process.env.API_Url}/files/download/${image}`}
                alt="Imagem da postagem"
              ></img>
            ) : null}
          </figure>
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
                <p>{`${comments?.length} Comerciários`}</p>
              </Stack>
            </Box>
          </Stack>
        </footer>
      </Box>
    </>
  );
};
