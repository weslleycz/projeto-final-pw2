"use client";
import { createUserSchema } from "@/schema/createUserSchema";
import { api } from "@/services/apí";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
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
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
};

type ISubmit = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const router = useRouter();

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleTogglePasswordConfirmVisibility = () => {
    setShowPasswordConfirm(
      (prevShowPasswordConfirm) => !prevShowPasswordConfirm
    );
  };

  const handleSubmit = async (data: ISubmit, { setErrors }: any) => {
    try {
      const res = await api.post(`/user`, data);
      const expirationDate = new Date();
      expirationDate.setTime(expirationDate.getTime() + 72 * 60 * 60 * 1000);
      setCookie("token", res.data.token, {
        expires: expirationDate,
      });
      router.push(`/feed`);
    } catch (error) {
      setErrors({ email: "E-mail já está cadastrado" });
    }
  };

  return (
    <>
      <Container maxWidth="sm">
        <Formik
          initialValues={initialValues}
          validationSchema={createUserSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <FormControl fullWidth margin="normal">
              <FormLabel>Nome completo</FormLabel>
              <Field
                as={TextField}
                id="name"
                name="name"
                fullWidth
                margin="normal"
                type="text"
              />
              <ErrorMessage
                name="name"
                component="div"
                className={styles["error-text"]}
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>E-mail</FormLabel>
              <Field
                as={TextField}
                id="email"
                name="email"
                fullWidth
                margin="normal"
                type="email"
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
                      <IconButton onClick={handleTogglePasswordVisibility}>
                        {showPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
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

            <FormControl fullWidth margin="normal">
              <FormLabel>Confirme sua senha</FormLabel>
              <Field
                as={TextField}
                id="passwordConfirm"
                name="passwordConfirm"
                fullWidth
                margin="normal"
                type={showPasswordConfirm ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordConfirmVisibility}
                      >
                        {showPasswordConfirm ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <ErrorMessage
                name="passwordConfirm"
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
};

export default Signup;
