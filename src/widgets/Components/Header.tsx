import {
  useGenreFilter,
  useGenres,
  useRatingFilter,
  useSetGenreFilter,
  useSetRatingFilter,
  type RatingFilterType,
} from "@/features/movieStore";
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@radix-ui/react-dropdown-menu";
import DropDown from "@/widgets/Components/DropDown";

const Header = () => {
  const ratingFilter = useRatingFilter();
  const setRatingFilter = useSetRatingFilter();
  const genreFilter = useGenreFilter();
  const setGenreFilter = useSetGenreFilter();
  const genres = useGenres();

  return (
    <div className="h-20 bg-black text-white flex justify-between">
      <div>
        <p className="font-bold font-mono text-2xl pl-6 pt-10">Movie List</p>
      </div>

      <div className="text-current pr-8 pt-5 sm:pr-16 pt-10">
        <DropDown
          name="Genres"
          value={genreFilter?.toString() || ""}
          onValueChange={(value) =>
            setGenreFilter(value ? Number(value) : null)
          }
        >
          <DropdownMenuRadioItem value={""} className="hover:text-black">
            <strong>All genres</strong>
          </DropdownMenuRadioItem>
          {genres.map((elem) => {
            return (
              <DropdownMenuRadioItem
                key={elem.id}
                value={elem.id.toString()}
                className="hover:text-black"
              >
                <strong>{elem.name}</strong>
              </DropdownMenuRadioItem>
            );
          })}
        </DropDown>

        <DropDown
          name="Sort"
          value={ratingFilter}
          onValueChange={(value) => setRatingFilter(value as RatingFilterType)}
        >
          <DropdownMenuRadioGroup
            value={ratingFilter}
            onValueChange={(value) =>
              setRatingFilter(value as RatingFilterType)
            }
            className="text-indigo-500"
          >
            <DropdownMenuRadioItem
              value="high rated"
              className="hover:text-black"
            >
              <strong>High rated</strong>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              value="low rated"
              className="hover:text-black"
            >
              <strong>Low rated</strong>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropDown>
      </div>
    </div>
  );
};

export default Header;
