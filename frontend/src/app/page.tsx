"use client";
import { loginUserSchema } from "@/schema/loginUserSchema";
import { api } from "@/services/apí";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  Button,
  Container,
  FormControl,
  FormLabel,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { setCookie } from "cookies-next";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import styles from "./styles.module.scss";
import { useRouter } from 'next/navigation'

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
  const router = useRouter();
  const handleSubmit = async (data: ISubmit, { setErrors }: any) => {
    try {
      const res = await api.post(`/user/login`, data);
      const expirationDate = new Date();
      expirationDate.setTime(expirationDate.getTime() + 72 * 60 * 60 * 1000);
      setCookie("token", res.data.token, {
        expires: expirationDate,
      });
      router.push(`/feed`);
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
