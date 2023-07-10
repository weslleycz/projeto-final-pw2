"use client";

import { Container } from "@/components/Container";
import { Header } from "@/components/Header";
import { ProfileInfo } from "@/components/ProfileInfo";
import { api } from "@/services/apí";
import { getCookie } from "cookies-next";
import { useParams } from "next/navigation";
import { useQuery } from "react-query";

const Perfil = () => {
  const params = useParams();
  const token = getCookie("token");
  const id = params.id;

  const {
    data: userData,
    isLoading: userIsLoading,
    refetch,
  } = useQuery("getUser", async () => {
    try {
      const user = await api.get(`/user/pubic/${id}`);
      return user?.data;
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <>
      <Header />
      <Container>
        {userIsLoading ? (
          <></>
        ) : (
          <ProfileInfo
            id={userData?.id}
            name={userData?.name}
            email={userData?.email}
            bio={userData?.bio}
            avatar={userData?.avatar}
            cover={userData?.cover}
            refetch={refetch}
          />
        )}
      </Container>
    </>
  );
};

export default Perfil;
