import { Box, Button, IconButton, InputAdornment, TextField } from "@mui/material";
import styles from "./styles.module.scss";
import ImageIcon from "@mui/icons-material/Image";
import { ChangeEvent, useRef, useState } from "react";
import { api } from "@/services/apí";
import { AxiosResponse } from "axios";
import { getCookie } from "cookies-next";


type Props={
  refetch:any
}

export const PostCreator = ({refetch}:Props) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const fileInputRef = useRef(null);

  const token = getCookie("token");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    try {
      if (!selectedFile) {
        console.error("No file selected.");
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);

      const headers = {
        "Content-Type": "multipart/form-data",
        token,
      };

      const response: AxiosResponse = await api.put("/files/upload", formData, {
        headers,
      });

      return response.data;
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async () => {
    if (selectedFile != null) {
      const image = await handleUpload();
      if (text != "") {
        try {
          await api.post(
            "/post",
            {
              text,
              image,
            },
            {
              headers: {
                token,
              },
            }
          );
          setText("");
          setSelectedFile(null);
          refetch()
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      if (text != "") {
        try {
          await api.post(
            "/post",
            {
              text,
            },
            {
              headers: {
                token,
              },
            }
          );
          refetch()
          setText("");
          setSelectedFile(null);
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const handleChange = (event: { target: { value: any; }; }) => {
    setText(event.target.value);
  }

  return (
    <>
      <Box className={styles.continer}>
        <Box className={styles.cont}>
          <TextField
            id="standard-multiline-static"
            multiline
            fullWidth
            rows={4}
            onChange={handleChange}
            variant="standard"
            value={text}
            placeholder="Escreva sua postagem..."
          />
        </Box>
        <Box className={styles.footer}>
        <TextField
        variant="outlined"
        disabled
        InputProps={{
          sx: { '& .MuiOutlinedInput-notchedOutline': { display: 'none' } },
          startAdornment: (
            <InputAdornment position="start">
              <IconButton onClick={handleIconClick}>
                <ImageIcon  sx={{ color: "#44F1A6", fontSize: 30 }}  />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <input
        type="file"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
          <Button onClick={handleSubmit} variant="contained">
            publicar
          </Button>
        </Box>
      </Box>
    </>
  );
};
