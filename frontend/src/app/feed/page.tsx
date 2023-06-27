/* eslint-disable @next/next/no-img-element */
"use client";

import { Container } from "@/components/Container";
import { ContainerFeed } from "@/components/ContainerFeed";
import { Header } from "@/components/Header";
import { Post } from "@/components/Post";
import { api } from "@/services/apí";
import { IPost } from "@/types/IPost";
import { CircularProgress } from "@mui/material";
import { useRef } from "react";
import { useQuery } from "react-query";

const Feed = () => {
  const audioRef = useRef(null);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const { data, isLoading } = useQuery("getPosts", async () => {
    const posts = await api.get("/post");
    return posts?.data.reverse();
});

  return (
    <>
      <Header />
      <Container>
        <div>
          <audio ref={audioRef} src="./notification.wav" />
          {/* <button onClick={handlePlay}>Novas postagens</button> */}
          <ContainerFeed>
           {isLoading ? <CircularProgress /> : data.map((post:IPost)=>{
            return <Post key={post.id} {...post} />
           })}
          </ContainerFeed>
        </div>
      </Container>
    </>
  );
};

export default Feed;
