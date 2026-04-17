const mongoose = require('mongoose');

const { Category } = require('../models/Category');
const { HttpError } = require('../utils/httpError');
const { slugify } = require('../utils/slug');

async function generateUniqueSlug(name) {
  const base = slugify(name);
  if (!base) throw new HttpError(400, 'Invalid category name');
  let slug = base;
  let i = 1;
  // eslint-disable-next-line no-await-in-loop
  while (await Category.exists({ slug })) {
    slug = `${base}-${i}`;
    i += 1;
  }
  return slug;
}

async function listCategories() {
  return Category.find().sort({ name: 1 }).lean();
}

async function getCategoryBySlug(slug) {
  const doc = await Category.findOne({ slug: String(slug).toLowerCase().trim() }).lean();
  if (!doc) throw new HttpError(404, 'Category not found');
  return doc;
}

async function createCategory({ name }) {
  const trimmed = String(name).trim();
  const slug = await generateUniqueSlug(trimmed);
  const doc = await Category.create({ name: trimmed, slug });
  return doc;
}

async function updateCategory(id, { name }) {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, 'Invalid category id');
  const doc = await Category.findById(id);
  if (!doc) throw new HttpError(404, 'Category not found');

  if (name !== undefined) {
    const trimmed = String(name).trim();
    doc.name = trimmed;
    doc.slug = await generateUniqueSlug(trimmed);
  }

  await doc.save();
  return doc;
}

async function deleteCategory(id) {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, 'Invalid category id');
  const doc = await Category.findById(id);
  if (!doc) throw new HttpError(404, 'Category not found');
  await doc.deleteOne();
}

module.exports = {
  categoriesService: {
    listCategories,
    getCategoryBySlug,
    createCategory,
    updateCategory,
    deleteCategory
  }
};

