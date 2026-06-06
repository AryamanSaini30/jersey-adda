const slugify = require('slugify');
const jerseyModel = require('../models/jersey.model');
const { ApiError } = require('../utils/apiError');
const cloudinaryService = require('./cloudinary.service');

const defaultSizes = ['S', 'M', 'L', 'XL', '2XL'];

function normalizeOptionalString(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  return value;
}

function generateSlug(name, teamName) {
  const base = `${name}-${teamName}`;
  return slugify(base, { lower: true, strict: true, trim: true });
}

function extractUploadedFile(files, fieldName) {
  return files?.[fieldName]?.[0] || null;
}

function extractUploadedFiles(files) {
  return Object.entries(files || {})
    .flatMap(([, group]) => group || [])
    .slice(0, 5);
}

function getImageFields(files) {
  return [1, 2, 3, 4, 5]
    .map((index) => extractUploadedFile(files, `image_${index}`))
    .filter(Boolean);
}

function normalizeFiles(files) {
  const namedImages = getImageFields(files);
  return namedImages.length > 0 ? namedImages : extractUploadedFiles(files);
}

async function listJerseys(query) {
  const sortBy = query.sort_by || 'created_at';
  const sortOrder = query.sort_order || 'desc';
  const page = query.page || 1;
  const limit = query.limit || 12;

  const filters = {
    search: normalizeOptionalString(query.search),
    team: normalizeOptionalString(query.team),
    priceMin: query.price_min,
    priceMax: query.price_max,
    nationalTeam: query.national_team,
    hasShorts: query.has_shorts,
    sleeveType: normalizeOptionalString(query.sleeve_type),
    versionType: normalizeOptionalString(query.version_type),
    featuredClub: normalizeOptionalString(query.featured_club)
  };

  return jerseyModel.list({
    filters,
    sortBy,
    sortOrder,
    page,
    limit
  });
}

async function getJerseyBySlug(slug) {
  const jersey = await jerseyModel.findBySlug(slug);

  if (!jersey) {
    throw new ApiError(404, 'Jersey not found');
  }

  return jersey;
}

async function createJersey(payload, files) {
  const uploadedFiles = normalizeFiles(files);

  if (uploadedFiles.length === 0) {
    throw new ApiError(400, 'At least one image is required');
  }

  const uploadedImages = [];
  let createdJersey = null;

  try {
    for (const file of uploadedFiles) {
      uploadedImages.push(await cloudinaryService.uploadImage(file));
    }

    const rawSlug = payload.slug || generateSlug(payload.name, payload.team_name);
    const slug = slugify(rawSlug, { lower: true, strict: true, trim: true });

    const jerseyPayload = {
      slug,
      name: payload.name,
      team_name: payload.team_name,
      league_name: normalizeOptionalString(payload.league_name),
      description: normalizeOptionalString(payload.description),
      price: payload.price,
      is_national_team: payload.is_national_team ?? false,
      has_shorts: payload.has_shorts ?? false,
      sleeve_type: normalizeOptionalString(payload.sleeve_type),
      version_type: normalizeOptionalString(payload.version_type),
      featured_club: normalizeOptionalString(payload.featured_club),
      available_sizes: payload.available_sizes ?? defaultSizes,
      is_active: payload.is_active ?? true
    };

    createdJersey = await jerseyModel.create(jerseyPayload);
    await jerseyModel.replaceImages(createdJersey.id, uploadedImages);

    return await jerseyModel.findById(createdJersey.id);
  } catch (error) {
    if (createdJersey?.id) {
      await Promise.allSettled([
        jerseyModel.deleteImagesByJerseyId(createdJersey.id),
        jerseyModel.remove(createdJersey.id)
      ]);
    }

    await Promise.allSettled(uploadedImages.map((image) => cloudinaryService.deleteImageByUrl(image.url)));
    throw error;
  }
}

async function updateJersey(id, payload, files) {
  const existingJersey = await jerseyModel.findById(id);

  if (!existingJersey) {
    throw new ApiError(404, 'Jersey not found');
  }

  const uploadedFiles = normalizeFiles(files);
  const newlyUploadedImages = [];

  try {
    for (const file of uploadedFiles) {
      const uploaded = await cloudinaryService.uploadImage(file);
      newlyUploadedImages.push(uploaded);
    }

    const rawSlug = payload.slug || existingJersey.slug;
    const slug = slugify(rawSlug, { lower: true, strict: true, trim: true });

    const jerseyPayload = {
      slug,
      name: payload.name ?? existingJersey.name,
      team_name: payload.team_name ?? existingJersey.team_name,
      league_name: payload.league_name === undefined ? existingJersey.league_name : normalizeOptionalString(payload.league_name),
      description: payload.description === undefined ? existingJersey.description : normalizeOptionalString(payload.description),
      price: payload.price ?? existingJersey.price,
      is_national_team: payload.is_national_team ?? existingJersey.is_national_team,
      has_shorts: payload.has_shorts ?? existingJersey.has_shorts,
      sleeve_type: payload.sleeve_type === undefined ? existingJersey.sleeve_type : normalizeOptionalString(payload.sleeve_type),
      version_type: payload.version_type === undefined ? existingJersey.version_type : normalizeOptionalString(payload.version_type),
      featured_club: payload.featured_club === undefined ? existingJersey.featured_club : normalizeOptionalString(payload.featured_club),
      available_sizes: payload.available_sizes === undefined ? existingJersey.available_sizes : payload.available_sizes,
      is_active: payload.is_active ?? existingJersey.is_active
    };

    const updatedJersey = await jerseyModel.update(id, jerseyPayload);

    if (newlyUploadedImages.length > 0) {
      const oldImages = existingJersey.jersey_images || existingJersey.images || [];
      await jerseyModel.deleteImagesByJerseyId(id);
      await jerseyModel.replaceImages(id, newlyUploadedImages);

      await Promise.allSettled(
        oldImages.map((image) =>
          image.public_id
            ? cloudinaryService.deleteImageByPublicId(image.public_id)
            : cloudinaryService.deleteImageByUrl(image.url)
        )
      );
    }

    return await jerseyModel.findById(updatedJersey.id);
  } catch (error) {
    await Promise.allSettled(newlyUploadedImages.map((image) => cloudinaryService.deleteImageByPublicId(image.publicId)));
    throw error;
  }
}

async function deleteJersey(id) {
  const existingJersey = await jerseyModel.findById(id);

  if (!existingJersey) {
    throw new ApiError(404, 'Jersey not found');
  }

  const deletedJersey = await jerseyModel.remove(id);

  const images = existingJersey.jersey_images || existingJersey.images || [];

  await Promise.allSettled(
    images.map((image) =>
      image.public_id ? cloudinaryService.deleteImageByPublicId(image.public_id) : cloudinaryService.deleteImageByUrl(image.url)
    )
  );

  return deletedJersey;
}

module.exports = {
  listJerseys,
  getJerseyBySlug,
  createJersey,
  updateJersey,
  deleteJersey
};