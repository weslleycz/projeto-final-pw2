"use client";
import styles from "./styles.module.scss";
import {
  TextField,
  Button,
  FormLabel,
  Container,
  FormControl,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { api } from "@/services/apí";
import { loginUserSchema } from "@/schema/loginUserSchema";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useState } from "react";

const initialValues = {
  email: "",
  password: "",
};

type ISubmit={
  email: string;
  password: string;
}

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = async (data: ISubmit, { setErrors }: any) => {
    try {
      const res = await api.post(`/user/login`, data);
      console.log(res.data);
    } catch (error: any) {
      if (error.response && error.response.data) {
        const { message } = error.response.data;
        if (message === 'Senha incorreta') {
          setErrors({ password: message });
        }else{
          setErrors({ email: message });
        }
      } else {
        console.log(error);
        setErrors({ email: "Ocorreu um erro ao realizar o login" });
      }
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Container maxWidth="sm">
        <Formik
          initialValues={initialValues}
          validationSchema={loginUserSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <FormControl fullWidth margin="normal">
              <FormLabel>E-mail</FormLabel>
              <Field
                as={TextField}
                id="email"
                name="email"
                fullWidth
                margin="normal"
                type="text"
              />
              <ErrorMessage
                name="email"
                component="div"
                className={styles["error-text"]}
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Senha</FormLabel>
              <Field
                as={TextField}
                id="password"
                name="password"
                fullWidth
                margin="normal"
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityIcon /> :  <VisibilityOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <ErrorMessage
                name="password"
                component="div"
                className={styles["error-text"]}
              />
            </FormControl>

            <Button fullWidth variant="contained" type="submit" color="primary">
              Entrar
            </Button>
          </Form>
        </Formik>
      </Container>
    </>
  );
}
