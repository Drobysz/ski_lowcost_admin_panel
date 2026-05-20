import { UsersFilters } from "./sections/UsersFilters";
import { UsersHeader } from "./sections/UsersHeader";
import { UsersModals } from "./sections/UsersModals";
import { UsersProvider } from "./sections/UsersProvider";
import { UsersTableSection } from "./sections/UsersTableSection";

export default function UsersPage() {
  return (
    <UsersProvider>
      <UsersHeader />
      <UsersFilters />
      <UsersTableSection />
      <UsersModals />
    </UsersProvider>
  );
}
