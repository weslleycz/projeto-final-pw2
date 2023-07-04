export type IPost = {
    id: string;
    text: string;
    image: string;
    date: string;
    likes: [];
    userId: string;
    comments:[]
    User:{
      name: string
    }
  };