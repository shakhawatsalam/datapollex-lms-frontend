export interface ICourse {
  _id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: { public_id: string; url: string };
  modules: IModule[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IModule {
  _id: string;
  title: string;
  moduleNumber: number;
  lectures: ILecture[];
}

export interface ILecture {
  _id: string;
  title: string;
  videoUrl: string;
  pdfNotes: Array<{ public_id: string; url: string }>;
}
