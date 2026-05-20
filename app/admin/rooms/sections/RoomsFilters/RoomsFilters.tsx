"use client";

import { Checkbox } from "@/components/Checkbox";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { useRooms } from "../../context";
import styles from "./style.module.scss";

export function RoomsFilters() {
  const {
    query,
    bedsFilter,
    floorFilter,
    balconyOnly,
    mountainOnly,
    setQuery,
    setBedsFilter,
    setFloorFilter,
    setBalconyOnly,
    setMountainOnly,
  } = useRooms();

  return (
    <section className={styles.filters}>
      <Input
        label="Search Room Number"
        icon="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="e.g. 402, Alpine Suite..."
      />
      <Select
        label="Beds"
        value={bedsFilter}
        onValueChange={setBedsFilter}
        options={[
          { value: "all", label: "All" },
          { value: "2", label: "2 Beds" },
          { value: "4", label: "4 Beds" },
          { value: "6", label: "6 Beds" },
        ]}
      />
      <Select
        label="Floor"
        value={floorFilter}
        onValueChange={setFloorFilter}
        options={[
          { value: "all", label: "All Floors" },
          { value: "1", label: "Floor 1" },
          { value: "2", label: "Floor 2" },
          { value: "3", label: "Floor 3" },
          { value: "4", label: "Floor 4" },
          { value: "5", label: "Floor 5" },
        ]}
      />
      <Checkbox
        label="Balcony"
        checked={balconyOnly}
        onChange={(event) => setBalconyOnly(event.target.checked)}
      />
      <Checkbox
        label="Mountain View"
        checked={mountainOnly}
        onChange={(event) => setMountainOnly(event.target.checked)}
      />
    </section>
  );
}
