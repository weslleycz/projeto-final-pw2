# EcoConnect

## Visão Geral
EcoConnect é uma plataforma online que conecta pessoas apaixonadas pelo meio ambiente e promove a conscientização ambiental de forma colaborativa. Nossa rede social oferece um espaço interativo para compartilhar informações, histórias inspiradoras, dicas práticas e projetos sustentáveis. Junte-se a uma comunidade engajada, conheça pessoas com interesses semelhantes e descubra maneiras de fazer a diferença para o nosso planeta. Seja parte do movimento e conecte-se com a sustentabilidade através do EcoConnect.

## Tecnologias
O EcoConnect é desenvolvido utilizando as seguintes tecnologias:
1. Next.js: Framework React para desenvolvimento web com recursos como renderização do lado do servidor e roteamento.
5. TypeScript: Linguagem de programação que adiciona recursos ao JavaScript.
2. Nest.js: Framework Node.js para desenvolvimento de servidores web escaláveis e eficientes.
3. MongoDB:Banco de dados orientado a documentos que fornece uma maneira flexível e escalável de armazenar dados.
4. Prisma.js: ORM (Object-Relational Mapping) moderno para facilitar a interação com o banco de dados.
5. SCSS: Linguagem de estilo que permite escrever estilos CSS mais avançados e organizados.
5. GridFS: Sistema de arquivos para armazenamento e recuperação de arquivos de grande porte no MongoDB.
5. JWT (JSON Web Tokens): Mecanismo de autenticação stateless baseado em tokens para proteger 
rotas e endpoints.

## Configuração do ambiente
- `DATABASE_URL`: URL da base de dados utilizada para armazenar as reservas.
- `Security_JWT`: Chave secreta utilizada para assinar e verificar tokens JWT.
- `MONGO_USERNAME`: Usuário do MongoDB.
- `MONGO_PASSWORD`: Senha do MongoDB.

## Instalação
Siga as etapas abaixo para configurar e executar o EcoTracker localmente:
1. Inicie o servidor de desenvolvimento: `docker-compose up`
2. Navegue até a pasta do projeto do frontend (Next.js): `cd frontend`
3. Instale as dependências do frontend: `npm install`
4. Navegue até a pasta do projeto do backend (Nest.js): `cd ../backend`
5. Instale as dependências do backend: `npm install`
6. Inicie o servidor do backend: `npm run dev`
7. Em outra janela do terminal, navegue até a pasta do frontend novamente: `cd ./frontend`
8. Inicie o servidor do frontend: `npm run dev`

Certifique-se de ter as ferramentas necessárias instaladas, como o Node.js e o npm.