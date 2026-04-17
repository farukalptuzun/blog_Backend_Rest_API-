const { HttpError } = require('../utils/httpError');
const { categoriesService } = require('../services/categories.service');

const categoriesController = {
  async list(req, res) {
    const items = await categoriesService.listCategories();
    res.json({ items });
  },

  async getBySlug(req, res) {
    const category = await categoriesService.getCategoryBySlug(req.params.slug);
    res.json({ category });
  },

  async create(req, res) {
    const { name } = req.body || {};
    if (!name || String(name).trim().length === 0) throw new HttpError(400, 'name is required');
    const category = await categoriesService.createCategory({ name: String(name) });
    res.status(201).json({ category });
  },

  async update(req, res) {
    const { name } = req.body || {};
    if (name === undefined) throw new HttpError(400, 'name is required');
    const category = await categoriesService.updateCategory(req.params.id, { name: String(name) });
    res.json({ category });
  },

  async remove(req, res) {
    await categoriesService.deleteCategory(req.params.id);
    res.status(204).send();
  }
};

module.exports = { categoriesController };

