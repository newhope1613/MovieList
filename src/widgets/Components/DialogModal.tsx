import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import type { MovieType } from "@/shared/types/types";
import { memo } from "react";

interface DialogPropsType {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  chosenFilm: MovieType;
  getGenreFilms: (ids: number[]) => string;
}

const DialogModal = memo(
  ({ isOpen, setIsOpen, chosenFilm, getGenreFilms }: DialogPropsType) => {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[250px]">
          <DialogHeader>
            <DialogTitle>{chosenFilm?.title}</DialogTitle>
            <DialogDescription>{chosenFilm?.overview}</DialogDescription>
            <DialogDescription>
              <strong>Year of Release: {chosenFilm?.release_date}</strong>
              <br />
              <i>Genre(s):</i> {`${getGenreFilms(chosenFilm?.genre_ids || [])}`}
              <br />
              <strong>Rating:</strong>{" "}
              {`${chosenFilm?.vote_average.toFixed(1)}`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
);

export default DialogModal;
