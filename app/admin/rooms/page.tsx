import { RoomsFilters } from "./sections/RoomsFilters";
import { RoomsHeader } from "./sections/RoomsHeader";
import { RoomsModals } from "./sections/RoomsModals";
import { RoomsProvider } from "./context";
import { RoomsTableSection } from "./sections/RoomsTableSection";

export default function RoomsPage() {
  return (
    <RoomsProvider>
      <RoomsHeader />
      <RoomsFilters />
      <RoomsTableSection />
      <RoomsModals />
    </RoomsProvider>
  );
}
