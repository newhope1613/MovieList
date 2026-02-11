import type { MovieType } from "@/shared/types/types";
import { useEffect, useState } from "react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import DialogModal from "@/widgets/Components/DialogModal";
import {
  useMovies,
  useGenres,
  useIsLoading,
  useMovieActions,
} from "@/features/movieStore";
import { Spinner } from "@/shared/components/ui/spinner";

const ListOfMovie = () => {
  const [chosenFilm, setChosenFilm] = useState<MovieType>();
  const [isOpen, setIsOpen] = useState(false);

  const movies = useMovies();
  const genres = useGenres();
  const isLoading = useIsLoading();
  const { loadPages, fetchInitialData } = useMovieActions();

  useEffect(() => {
    const fn = async () => {
      await fetchInitialData();
    };
    fn();
  }, [fetchInitialData]);

  if (isLoading) return <Spinner className="size-16" />;

  const getGenreFilms = (ids: number[]) => {
    return ids
      .map((id) => {
        const genre = genres.find((elem) => elem.id === id);
        return genre ? genre.name : null;
      })
      .join(", ");
  };

  const dialogFilm = (id: number) => {
    const film = movies.find((elem) => elem.id === id);
    setChosenFilm(film);
    setIsOpen(true);
  };

  return (
    <div className="flex justify-center flex-col items-center flex-wrap  w-[1200px] p-4">
      <div className="flex flex-wrap justify-center gap-[10px] mb-10">
        {movies.length === 0 && (
          <strong>There are no films in this genre.</strong>
        )}
        {movies.map((movie) => {
          return (
            <div key={movie.id}>
              <Card
                className="p-2 h-[520px] w-[150px] cursor-pointer"
                onClick={() => dialogFilm(movie.id)}
              >
                <div className="flex flex-col h-full">
                  <div className="grow overflow-auto">
                    <img
                      src={`${import.meta.env.VITE_GENRES_URL}${movie.poster_path}`}
                      alt={movie.title}
                    />
                    <div className="w-[132px]">
                      <p>{movie.title}</p>
                      <p>
                        <strong>Rating:</strong>{" "}
                        {`${movie.vote_average.toFixed(1)}`}
                      </p>
                      <p>
                        <i>Genre(s):</i> {`${getGenreFilms(movie.genre_ids)}`}
                      </p>
                    </div>
                  </div>
                  <div className="self-center">
                    <Button
                      className="mt-2 cursor-pointer"
                      onClick={() => dialogFilm(movie.id)}
                    >
                      See More
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
      <div>
        {movies.length === 0 ? (
          ""
        ) : (
          <Button className="cursor-pointer" onClick={loadPages}>
            Load more
          </Button>
        )}
      </div>
      {chosenFilm && (
        <DialogModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          chosenFilm={chosenFilm}
          getGenreFilms={getGenreFilms}
        />
      )}
    </div>
  );
};

export default ListOfMovie;
