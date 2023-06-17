import * as yup from 'yup';

export const loginUserSchema = yup.object().shape({
  email: yup.string().required('Você precisa informar o seu e-mail'),
  password: yup.string().required('Você precisa informar a sua senha'),
});