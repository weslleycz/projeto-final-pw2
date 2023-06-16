"use client";
import React from "react";
import {
  TextField,
  Button,
  FormLabel,
  Container,
  FormControl,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { createUserSchema } from "../../schema/createUserSchema";
import styles from "./styles.module.scss";
import { api } from "@/services/apí";

const initialValues = {
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
};

type ISubmit={
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const Signup = () => {
  const handleSubmit = async (data: ISubmit, { setErrors }: any) => {
    try {
      const res = await api.post(`/user`, data);
      console.log(res.data);
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
                type="password"
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
                type="password"
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
