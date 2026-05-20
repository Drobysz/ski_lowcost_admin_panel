import { ReservationsFilters } from "./sections/ReservationsFilters";
import { ReservationsHeader } from "./sections/ReservationsHeader";
import { ReservationsModals } from "./sections/ReservationsModals";
import { ReservationsProvider } from "./sections/ReservationsProvider";
import { ReservationsStats } from "./sections/ReservationsStats";
import { ReservationsTableSection } from "./sections/ReservationsTableSection";

export default function AccommodationsPage() {
  return (
    <ReservationsProvider>
      <ReservationsHeader />
      <ReservationsFilters />
      <ReservationsTableSection />
      <ReservationsStats />
      <ReservationsModals />
    </ReservationsProvider>
  );
}
