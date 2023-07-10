"use client";
import { createUserSchema } from "@/schema/createUserSchema";
import { api } from "@/services/apí";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Box,
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
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "../../../public/Logo.svg";
import styles from "./styles.module.scss";

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
      setCookie("id", res.data.id, {
        expires: expirationDate,
      });
      router.push(`/feed`);
    } catch (error) {
      setErrors({ email: "E-mail já está cadastrado" });
    }
  };

  return (
    <>
      <Box className={styles["ContainerAll"]}>
        <Container className={styles["containerImg"]} />
        <Container className={styles["containerMain"]}>
        <Image
              src={Logo}
              width={45}
              height={45}
              alt="Picture of the author"
              style={{ marginBottom: 5 }}
            />
          <main>
            <aside className={styles["aside"]}>
              <p>Registro</p>
            </aside>

            <Formik
              initialValues={initialValues}
              validationSchema={createUserSchema}
              onSubmit={handleSubmit}
            >
              <Form>
                <FormControl fullWidth margin="dense">
                  <FormLabel>Nome completo</FormLabel>
                  <Field
                    as={TextField}
                    id="name"
                    name="name"
                    fullWidth
                    inputProps={{ style: { height: '14px' } }}
                    type="text"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className={styles["error-text"]}
                  />
                </FormControl>

                <FormControl fullWidth margin="dense">
                  <FormLabel>E-mail</FormLabel>
                  <Field
                    as={TextField}
                    id="email"
                    name="email"
                    type="email"
                    inputProps={{ style: { height: "14px" } }}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className={styles["error-text"]}
                  />
                </FormControl>

                <FormControl fullWidth margin="dense">
                  <FormLabel>Senha</FormLabel>
                  <Field
                    as={TextField}
                    id="password"
                    name="password"
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    inputProps={{ style: { height: '14px' } }}
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

                <FormControl fullWidth margin="dense">
                  <FormLabel>Confirme sua senha</FormLabel>
                  <Field
                    as={TextField}
                    id="passwordConfirm"
                    name="passwordConfirm"
                    inputProps={{ style: { height: '14px' } }}
                    fullWidth
                    type={showPasswordConfirm ? "text" : "password"}
                    InputProps={{
                      height: "14px",
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

                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  color="primary"
                  className={styles["bttUp"]}
                >
                  Cadastre-se
                </Button>
              </Form>
            </Formik>
          </main>
          <footer className={styles["footerPage"]}>
            <p>Tem conta? </p>
            <span>Visite a página de login.</span>
            <Link href="/">
              <Button fullWidth variant="outlined" className={styles["bttUp"]}>
                Entrar
              </Button>
            </Link>
          </footer>
        </Container>
      </Box>
    </>
  );
};

export default Signup;
