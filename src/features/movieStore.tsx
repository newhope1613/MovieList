import api from "@/shared/api/api";
import type { GenreResponse, GenreType, MovieType } from "@/shared/types/types";
import { create, type StateCreator } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface IActions {
  fetchMovies: () => Promise<void>;
  fetchGenres: () => Promise<void>;
  fetchInitialData: () => Promise<void>;
  setRatingFilter: (filter: RatingFilterType) => void;
  setGenreFilter: (filter: number | null) => void;
  loadPages: () => void;
  sortMovies: (movies: MovieType[], filter: RatingFilterType) => MovieType[];
}

export type RatingFilterType = "high rated" | "low rated";

interface IInitialState {
  movies: MovieType[];
  genres: GenreType[];
  isLoading: boolean;
  ratingFilter: RatingFilterType;
  genreFilter: number | null;
  pages: number;
}

interface IMovieState extends IInitialState, IActions {}

const initialState: IInitialState = {
  movies: [],
  genres: [],
  isLoading: false,
  ratingFilter: "high rated",
  genreFilter: null,
  pages: 1,
};

const movieStore: StateCreator<IMovieState> = (set, get) => ({
  ...initialState,

  fetchMovies: async () => {
    try {
      const response = await api.get<{ results: MovieType[] }>(
        "/movie/popular?page=1",
      );
      const fetchedMovies = response.data.results;

      const currentFilter = get().ratingFilter;
      const sortedMovies = get().sortMovies(fetchedMovies, currentFilter);

      set({ movies: sortedMovies });
    } catch (e) {
      console.error("Error fetching movies:", e);
      set({ movies: [] });
    }
  },

  fetchGenres: async () => {
    try {
      const response = await api.get<GenreResponse>("/genre/movie/list");
      set({ genres: response.data.genres });
    } catch (e) {
      console.error("Error fetching genres:", e);
      set({ genres: [] });
    }
  },

  sortMovies: (movies: MovieType[], filter: RatingFilterType) => {
    return [...movies].sort((a, b) =>
      filter === "high rated"
        ? b.vote_average - a.vote_average
        : a.vote_average - b.vote_average,
    );
  },

  filterMovies: (movies: MovieType[], filter: number | null) => {
    movies.filter((elem) => elem.genre_ids[0] != filter);
  },

  fetchInitialData: async () => {
    set({ isLoading: true });
    try {
      await Promise.all([get().fetchMovies(), get().fetchGenres()]);
    } catch (e) {
      console.error(e);
    } finally {
      set({ isLoading: false });
    }
  },

  setRatingFilter: (filter) => {
    const { movies, sortMovies } = get();
    const sortedMovies = sortMovies(movies, filter);

    set({
      ratingFilter: filter,
      movies: sortedMovies,
    });
  },

  setGenreFilter: (filterId: number | null) => {
    // const { movies } = get();

    set({ genreFilter: filterId });
  },

  loadPages: async () => {
    const { pages, movies, ratingFilter, sortMovies } = get();
    const nextPage = pages + 1;

    try {
      set({ isLoading: true });
      const response = await api.get<{ results: MovieType[] }>(
        `/movie/popular?page=${nextPage}`,
      );
      const newMovies = response.data.results;

      const movieMap = new Map(movies.map((m) => [m.id, m]));

      newMovies.forEach((m) => movieMap.set(m.id, m));

      const uniqueMoviesArray = Array.from(movieMap.values());

      const updatedMovies = sortMovies(uniqueMoviesArray, ratingFilter);

      set({
        movies: updatedMovies,
        pages: nextPage,
      });
    } catch (e) {
      console.error("Error loading more movies:", e);
    } finally {
      set({ isLoading: false });
    }
  },
});

const useMovieStore = create<IMovieState>()(
  devtools(
    persist(movieStore, {
      name: "movie-storage",
      storage: createJSONStorage(() => localStorage),
    }),
  ),
);

// Селекторы
export const useMovies = () => useMovieStore((state) => state.movies);
export const useGenres = () => useMovieStore((state) => state.genres);
export const useIsLoading = () => useMovieStore((state) => state.isLoading);

//Filter and Sort
export const useRatingFilter = () =>
  useMovieStore((state) => state.ratingFilter);
export const useSetRatingFilter = () =>
  useMovieStore((state) => state.setRatingFilter);
export const useGenreFilter = () => useMovieStore((state) => state.genreFilter);
export const useSetGenreFilter = () =>
  useMovieStore((state) => state.setGenreFilter);

//fetching
export const fetchMovies = useMovieStore.getState().fetchMovies;
export const fetchGenres = useMovieStore.getState().fetchGenres;
export const fetchInitialData = useMovieStore.getState().fetchInitialData;
export const fetchNewFilms = useMovieStore.getState().loadPages;
