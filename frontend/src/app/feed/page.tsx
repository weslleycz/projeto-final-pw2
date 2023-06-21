/* eslint-disable @next/next/no-img-element */
"use client";

import { Container } from "@/components/Container";
import { ContainerFeed } from "@/components/ContainerFeed";
import { Header } from "@/components/Header";
import { Post } from "@/components/Post";
import { useRef } from "react";

const Feed = () => {
  const audioRef = useRef(null);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <>
      <Header />
      <Container>
        <div>
          <audio ref={audioRef} src="./notification.wav" />
          <button onClick={handlePlay}>Novas postagens</button>
          <ContainerFeed>
          <Post/>
          <Post/>
          <Post/>
          <Post/>
          </ContainerFeed>
        </div>
      </Container>
    </>
  );
};

export default Feed;
