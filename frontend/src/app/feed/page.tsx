/* eslint-disable @next/next/no-img-element */
"use client";

import { Container } from "@/components/Container";
import { ContainerFeed } from "@/components/ContainerFeed";
import { Header } from "@/components/Header";
import { Post } from "@/components/Post";
import { api } from "@/services/apí";
import { IPost } from "@/types/IPost";
import { CircularProgress } from "@mui/material";
import { deleteCookie, getCookie } from "cookies-next";
import { useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { useRouter } from "next/navigation";

const Feed = () => {
  const { data, isLoading, refetch } = useQuery("getPosts", async () => {
    const posts = await api.get("/post");
    return posts?.data.reverse();
  });

  const router = useRouter();

  const token = getCookie("token");
  const { data: userData, isLoading: userIsLoading } = useQuery(
    "getUser",
    async () => {
      try {
        const user = await api.get("/user/private/token", {
          headers: {
            token,
          },
        });
        return user?.data;
      } catch (error) {
        deleteCookie("token");
        router.push("/");
      }
    }
  );



  return (
    <>
      <Header />
      <Container>
        <div>
          <ContainerFeed
            refetch={refetch}
          >
            {isLoading || userIsLoading ? (
              <CircularProgress />
            ) : (
              data.map((post: IPost) => {
                return (
                  <Post
                    user={post.User}
                    userIdPerfil={userData?.id}
                    refetch={refetch}
                    key={post.id}
                    {...post}
                  />
                );
              })
            )}
          </ContainerFeed>
        </div>
      </Container>
    </>
  );
};

export default Feed;
