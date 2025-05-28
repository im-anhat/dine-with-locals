export interface Blog {
  _id: string;
  userId: string;
  blogTitle: string;
  blogContent: string;
  photos: string[];
  createdAt: string;
  likes: number;
  comments: number;
}