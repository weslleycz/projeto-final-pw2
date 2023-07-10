"use client";

import { Container } from "@/components/Container";
import { Header } from "@/components/Header";
import { api } from "@/services/apí";
import { getCookie } from "cookies-next";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "react-query";
import { ProfileInfo } from "@/components/ProfileInfo";
import { IUser } from "@/types/IUser";

const Perfil = () => {
  const params = useParams();
  const token = getCookie("token");
  const id = params.id;

  const { data: userData, isLoading: userIsLoading } = useQuery(
    "getUser",
    async () => {
      try {
        const user = await api.get(`/user/pubic/${id}`);
        return user?.data;
      } catch (error) {
        console.log(error);
      }
    }
  );

  const { data: postsData, isLoading: postsIsLoading } = useQuery(
    "getPosts",
    async () => {
      try {
        const posts = await api.get(`/post/user/${id}`);
        return posts?.data;
      } catch (error) {
        console.log(error);
      }
    }
  );

  return (
    <>
      <Header />
      <Container>
        <ProfileInfo {...userData as IUser} />
      </Container>
    </>
  );
};

export default Perfil;
