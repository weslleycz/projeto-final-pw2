import { Avatar, Box, Divider, Stack } from "@mui/material";
import styles from "./styles.module.scss";

export const Post = () => {
  return (
    <>
      <Box className={styles.container}>
        <Box>
          <Stack className={styles['avatar-container']} direction="row" spacing={2}>
            <Avatar sx={{ width: 56, height: 56 }}>H</Avatar>
            <Box >
            <strong className={styles['avatar-text']}>John Doe</strong>
            <p className={styles['avatar-date']}>12 Abril 23:05</p>
            </Box>
          </Stack>
          <p className={styles['post-title']}>Almost before we knew it, we had left the ground.</p>
        </Box>
        <Divider light />
        1.5k Likes
      </Box>
    </>
  );
};
