const CategoryModel = require ('../../models/category.model');
const ProductModel = require ('../../models/product.model');

class UserController {
  async getUserDashboardPageAndAllProducts (req, res) {
    try {
      // Fetch categories for sidebar
      const categories = await CategoryModel.find ().lean ();

      // Build filter
      let matchStage = {};
      if (req.query.categories) {
        matchStage['category_info.category_name'] = Array.isArray (
          req.query.categories
        )
          ? {$in: req.query.categories}
          : req.query.categories;
      }

      if (req.query.search) {
        matchStage['product_name'] = {$regex: req.query.search, $options: 'i'}; // case-insensitive
      }

      // Fetch products with filter
      const products = await ProductModel.aggregate ([
        {
          $lookup: {
            from: 'categories',
            localField: 'category_id',
            foreignField: '_id',
            as: 'category_info',
          },
        },
        {$unwind: '$category_info'},
        {$match: matchStage},
      ]);

      res.render ('user-dashboard', {
        title: 'User Dashboard',
        data: req.user,
        products,
        categories,
        query: req.query,
        successMessage: req.flash ('success'),
      });
    } catch (error) {
      console.log (error);
      req.flash ('error', 'An error occurred');
      res.redirect ('/');
    }
  }
}

module.exports = new UserController ();
