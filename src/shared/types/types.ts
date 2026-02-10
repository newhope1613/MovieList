export interface MovieType {
  backdrop_path: string;
  id: number;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  vote_average: number;
  vote_count: number;
}

export interface GenreType {
  id: number;
  name: string;
}

export interface GenreResponse {
  genres: GenreType[];
}
