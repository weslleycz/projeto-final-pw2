import { api } from "@/services/apí";
import { CameraAlt, Close } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AxiosResponse } from "axios";
import { getCookie } from "cookies-next";
import { useState } from "react";
import { useQueryClient } from "react-query";
import styles from "./styles.module.scss";

type Props = {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  cover: string;
  refetch: any;
};

export const FormeEdit = ({ id, name, cover, bio, avatar, refetch }: Props) => {
  const [open, setOpen] = useState(false);
  const [nameUser, setNameUser] = useState(name);
  const [bioUser, setBioUser] = useState(bio);
  const [idAvatar, setIdAvatar] = useState(avatar);

  const token = getCookie("token");

  const queryClient = useQueryClient();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleBioUser = (event: any) => {
    setBioUser(event.target.value);
  };

  const handleNameUser = (event: any) => {
    setNameUser(event.target.value);
  };

  const handleUpload = async () => {
    try {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";

      fileInput.click();

      fileInput.onchange = async (event) => {
        if (
          event.target &&
          event.target.files &&
          event.target.files.length > 0
        ) {
          const file = event.target.files[0];

          const formData = new FormData();
          formData.append("file", file);

          const response: AxiosResponse = await api.put(
            "/files/upload",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                token: token,
              },
            }
          );
          setIdAvatar(response.data);
        }
      };
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    await api
      .patch(`/user/${id}`, {
        name: nameUser,
        bio: bioUser,
        avatar: idAvatar,
        cover
      })
      .then(() => {
        handleClose();
        refetch();
        queryClient.refetchQueries("getUserAvatar");
      });
  };

  return (
    <div>
      <Button onClick={handleOpen} variant="outlined">
        Editar perfil
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: 500,
            maxWidth: "90%",
            bgcolor: "background.paper",
            borderRadius: "0.76913rem",
          }}
        >
          <Box
            sx={{
              position: "relative",
              p: 2,
            }}
          >
            <Typography variant="h6">Editar Perfil</Typography>
            <IconButton
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                marginRight: 1,
              }}
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="Fechar"
            >
              <Close />
            </IconButton>
          </Box>
          <Box sx={{ p: 2 }}>
            <Stack direction="row" spacing={4}>
              <Box className={styles["avatar-container"]}>
                <Stack spacing={2}>
                  <Avatar
                    src={`${process.env.API_Url}/files/download/${idAvatar}`}
                    sx={{
                      bgcolor: "#3BD6CC",
                      width: 125,
                      height: 125,
                      marginLeft: 1,
                      fontSize: "3rem",
                    }}
                  ></Avatar>
                  <Button
                    onClick={handleUpload}
                    variant="contained"
                    color="primary"
                    startIcon={<CameraAlt />}
                  >
                    Carregar
                  </Button>
                </Stack>
              </Box>
              <Box>
                <TextField
                  id="outlined-basic"
                  label="Nome completo"
                  variant="outlined"
                  value={nameUser}
                  onChange={handleNameUser}
                  fullWidth
                  sx={{
                    marginBottom: 1,
                  }}
                />
                <TextField
                  id="outlined-multiline-static"
                  label="Biografia"
                  value={bioUser}
                  multiline
                  rows={4}
                  onChange={handleBioUser}
                  fullWidth
                />
              </Box>
            </Stack>
          </Box>
          <Box className={styles.footer}>
            <Stack spacing={2} direction="row">
              <Button
                onClick={() => handleSubmit()}
                fullWidth
                variant="contained"
              >
                Salvar
              </Button>
              <Button
                onClick={() => handleClose()}
                fullWidth
                variant="outlined"
              >
                Fechar
              </Button>
            </Stack>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};
