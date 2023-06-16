import * as Yup from 'yup';

export const createUserSchema = Yup.object().shape({
    name: Yup.string().required('O nome é obrigatório'),
    email: Yup.string().email('E-mail inválido').required('O e-mail é obrigatório'),
    password: Yup.string()
      .min(7, 'A senha deve ter pelo menos 7 caracteres')
      .max(20, 'A senha deve ter no máximo 20 caracteres')
      .required('A senha é obrigatória')
      .matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        'Senha muito fraca'
      ),
    passwordConfirm: Yup.string()
      .required('Esse campo e obrigatorio')
      .oneOf([Yup.ref('password')], 'As senhas não correspondem'),
  });