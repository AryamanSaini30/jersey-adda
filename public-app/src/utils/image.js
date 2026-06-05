export function getJerseyImages(jersey) {
  const images = [];

  const add = (value) => {
    if (!value || images.includes(value)) return;
    images.push(value);
  };

  add(jersey?.image_url_1);
  add(jersey?.image_url_2);
  add(jersey?.image_url);
  add(jersey?.cover_image_url);

  if (Array.isArray(jersey?.images)) {
    jersey.images.forEach((image) => add(image?.url));
  }

  if (Array.isArray(jersey?.jersey_images)) {
    jersey.jersey_images
      .slice()
      .sort((left, right) => (left.position ?? 0) - (right.position ?? 0))
      .forEach((image) => add(image?.url));
  }

  return images.length > 0 ? images : ['/placeholder-jersey.svg'];
}

export function getPrimaryJerseyImage(jersey) {
  return getJerseyImages(jersey)[0];
}
