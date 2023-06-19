import { useQuery } from "react-query";
import { Avatar, Badge, Box, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import styles from "./styles.module.scss";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { api } from "@/services/apí";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44F1A6",
    color: "#44F1A6",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

export const AvatarHeader = () => {
  const router = useRouter();
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
      deleteCookie("token");
      router.push("/");
    }
  });
  return (
    <>
      {isLoading || !token ? (
      <></>
      ) : (
        <Box className={styles.container}>
        <Stack direction="row" alignItems={"center"} spacing={3}>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <Avatar
              src={`${process.env.API_Url}/files/avatar/${data.id}`}
              sx={{ bgcolor: "#3BD6CC", width: 35, height: 35, marginLeft:1 }}
            >
              {data.name[0]}
            </Avatar>
          </StyledBadge>
          <strong className={styles.text}>{data.name}</strong>
        </Stack>
      </Box>
      )}
    </>
  );
};
