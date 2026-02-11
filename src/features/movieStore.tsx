import api from "@/shared/api/api";
import type { GenreType, MovieType } from "@/shared/types/types";
import { create, type StateCreator } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";

interface IActions {
  fetchMovies: () => Promise<void>;
  fetchGenres: () => Promise<void>;
  fetchInitialData: () => Promise<void>;
  setRatingFilter: (filter: RatingFilterType) => void;
  setGenreFilter: (filter: number | null) => void;
  applyFiltersAndSort: (
    allMovies: MovieType[],
    genreId: number | null,
    rating: RatingFilterType,
  ) => MovieType[];
  loadPages: () => void;
  sortMovies: (movies: MovieType[], filter: RatingFilterType) => MovieType[];
}

export type RatingFilterType = "high rated" | "low rated";

interface IInitialState {
  allMovies: MovieType[];
  movies: MovieType[];
  genres: GenreType[];
  isLoading: boolean;
  ratingFilter: RatingFilterType;
  genreFilter: number | null;
  pages: number;
}

interface IMovieState extends IInitialState, IActions {}

const initialState: IInitialState = {
  allMovies: [],
  movies: [],
  genres: [],
  isLoading: false,
  ratingFilter: "high rated",
  genreFilter: null,
  pages: 1,
};

const movieStore: StateCreator<IMovieState> = (set, get) => ({
  ...initialState,

  applyFiltersAndSort: (allMovies, genreId, rating) => {
    console.log("Filtering by:", genreId);
    let result = [...allMovies];

    if (genreId !== null) {
      result = result.filter((movie) => movie.genre_ids.includes(genreId));
    }

    return get().sortMovies(result, rating);
  },

  sortMovies: (movies, filter) => {
    return [...movies].sort((a, b) =>
      filter === "high rated"
        ? b.vote_average - a.vote_average
        : a.vote_average - b.vote_average,
    );
  },

  fetchMovies: async () => {
    try {
      const response = await api.get<{ results: MovieType[] }>(
        "/movie/popular?page=1",
      );
      const fetchedMovies = response.data.results;
      const { ratingFilter, genreFilter, applyFiltersAndSort } = get();

      set({
        allMovies: fetchedMovies,
        movies: applyFiltersAndSort(fetchedMovies, genreFilter, ratingFilter),
      });
    } catch (e) {
      console.error("Error fetching movies:", e);
    }
  },

  fetchGenres: async () => {
    try {
      const response = await api.get<{ genres: GenreType[] }>(
        "/genre/movie/list",
      );
      set({ genres: response.data.genres });
    } catch (e) {
      console.error("Error fetching genres:", e);
    }
  },

  setGenreFilter: (filterId) => {
    const { allMovies, ratingFilter, applyFiltersAndSort } = get();
    set({
      genreFilter: filterId,
      movies: applyFiltersAndSort(allMovies, filterId, ratingFilter),
    });
  },

  setRatingFilter: (filter) => {
    const { allMovies, genreFilter, applyFiltersAndSort } = get();
    set({
      ratingFilter: filter,
      movies: applyFiltersAndSort(allMovies, genreFilter, filter),
    });
  },

  fetchInitialData: async () => {
    if (get().isLoading) return;

    set({ isLoading: true });
    try {
      await Promise.all([get().fetchMovies(), get().fetchGenres()]);
    } finally {
      set({ isLoading: false });
    }
  },

  loadPages: async () => {
    const { pages, allMovies, ratingFilter, genreFilter, applyFiltersAndSort } =
      get();
    const nextPage = pages + 1;

    try {
      set({ isLoading: true });
      const response = await api.get<{ results: MovieType[] }>(
        `/movie/popular?page=${nextPage}`,
      );
      const newMovies = response.data.results;

      const movieMap = new Map(allMovies.map((m) => [m.id, m]));
      newMovies.forEach((m) => movieMap.set(m.id, m));
      const updatedAllMovies = Array.from(movieMap.values());

      set({
        allMovies: updatedAllMovies,
        movies: applyFiltersAndSort(
          updatedAllMovies,
          genreFilter,
          ratingFilter,
        ),
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
export const useMovieActions = () => {
  return useMovieStore(
    useShallow((state) => ({
      fetchInitialData: state.fetchInitialData,
      loadPages: state.loadPages,
      setGenreFilter: state.setGenreFilter,
      setRatingFilter: state.setRatingFilter,
    })),
  );
};
