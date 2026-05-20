export function prepareRoomImages(formData: FormData) {
  const prepared = new FormData();

  for (const [key, value] of formData.entries()) {
    if (key === "images[]" || key === "images") {
      if (value instanceof File && value.name && value.size > 0) {
        prepared.append("images[]", value);
      }
      continue;
    }

    prepared.append(key, value);
  }

  return prepared;
}
