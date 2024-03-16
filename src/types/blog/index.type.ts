import type { ObjectId } from "mongodb";

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface TokenData {
  token: string;
  type: string;
  expiresAt: number;
}

interface Artwork {
  id: number;
  alpha_channel: boolean;
  animated: boolean;
  game: number;
  width: number;
  height: number;
  image_id: string;
  url: string;
  checksum: string;
}

interface Cover {
  id: number;
  alpha_channel: boolean;
  animated: boolean;
  game: number;
  width: number;
  height: number;
  image_id: string;
  url: string;
  checksum: string;
}

interface Screenshot {
  id: number;
  game: number;
  width: number;
  height: number;
  image_id: string;
  url: string;
  checksum: string;
}

interface Video {
  id: number;
  game: number;
  name: string;
  video_id: string;
  checksum: string;
}

export interface GameResponse {
  id: number;
  aggregated_rating: number;
  artworks: Artwork[];
  cover: Cover;
  first_release_date: number;
  rating: number;
  screenshots: Screenshot[];
  total_rating: number;
  videos: Video[];
}

type ImageKeys = "width" | "height" | "image_id" | "url";

export interface GameApiResponse {
  id: number;
  aggregated_rating: number;
  artworks?: Pick<Artwork, ImageKeys>[];
  cover?: Pick<Cover, ImageKeys>;
  first_release_date: Date;
  rating: number;
  screenshots?: Pick<Screenshot, ImageKeys>[];
  total_rating: number;
  videos?: ({ url: string } & Pick<Video, "name" | "video_id">)[];
}

export interface Post {
  slug: string;
  views: number;
  likes: string[];
}

export interface CommentPayload {
  parentId?: ObjectId;
  name: string;
  type: "text" | "image";
  content: string;
  password: string;
}

export interface BaseComment {
  parentId?: ObjectId;
  slug: string;
  name: string;
  type: "text" | "image";
  content: string;
  password: string;
  ip: string;
  isDeleted: boolean;
  isSubComment: boolean;
  subComments?: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DeleteCommentPayload {
  password: string;
}

export interface DeletedComment extends BaseComment {
  deletedBy: "Host" | "User";
  deletedAt: Date;
}

export type Comment = BaseComment | DeletedComment;
