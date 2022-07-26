export interface IMusic {
  _id: string;
  name: string;
  imageUrl: string;
  songUrl: string;
  album: string;
  artist: IArtis;
  language: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  formGoogle?: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IArtis {
  _id?: string;
  name: string;
  imageUrl: string;
  instagramLink?: string;
  linkedinLink?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAlbum {
  _id: string;
  name: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}


export const apiEndPoint = process.env.NEXT_PUBLIC_APP_PROXY;
