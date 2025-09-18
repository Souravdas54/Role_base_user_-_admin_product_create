const CategoryModel = require ('../../models/category.model');
const ProductModel = require ('../../models/product.model');
const mongoose = require ('mongoose');

class AdminController {
  async getCategoryPage (req, res) {
    try {
      const categories = await CategoryModel.find ();
      res.render ('category', {
        title: 'Category',
        data: req.user,
        categories,
        successMessage: req.flash ('success'),
      });
    } catch (error) {
      console.log (error);
    }
  }

  async createCategory (req, res) {
    try {
      const {category_name} = req.body;
      if (!category_name) {
        req.flash ('error', ' Category Name Is Required');
        res.redirect ('/admin-dashboard/create-category');
      }
      const newCategory = await CategoryModel.create ({category_name});
      res.redirect ('/admin-dashboard/category');
    } catch (error) {
      console.log (error);
      req.flash ('error', 'An error occurred');
      res.redirect ('/admin-dashboard/category');
    }
  }

  // Edit category
  async editCategory (req, res) {
    try {
      const {category_name} = req.body;
      await CategoryModel.findByIdAndUpdate (req.params.id, {category_name});
      req.flash ('success', 'Category updated successfully');
      res.redirect ('/admin-dashboard/category');
    } catch (err) {
      console.log (err);
      req.flash ('error', 'An error occurred');
      res.redirect ('/admin-dashboard/category');
    }
  }

  // Delete category
  async deleteCategory (req, res) {
    try {
      await CategoryModel.findByIdAndDelete (req.params.id);
      req.flash ('success', 'Category deleted successfully');
      res.redirect ('/admin-dashboard/category');
    } catch (err) {
      console.log (err);
      req.flash ('error', 'An error occurred');
      res.redirect ('/admin-dashboard/category');
    }
  }

  // for getting the dashboard page with products table
  async getAdminDashboardPage (req, res) {
    try {
      const products = await ProductModel.aggregate ([
        {
          $lookup: {
            from: 'categories',
            localField: 'category_id',
            foreignField: '_id',
            as: 'category_info',
          },
        },
        {
          $unwind: '$category_info',
        },
        {
          $project: {
            product_name: 1,
            price: 1,
            description: 1,
            'category_info.category_name': 1,
          },
        },
      ]);
      res.render ('admin-dashboard', {
        title: 'Admin Dashboard',
        data: req.user,
        successMessage: req.flash ('success'),
        products,
      });
      // console.log(req.user);
    } catch (error) {
      console.log (error);
      req.flash ('error', 'An error occurred');
      res.redirect ('/');
    }
  }

  async getCreateProductPage (req, res) {
    try {
      const categories = await CategoryModel.find ();
      return res.render ('create-product', {
        title: 'Create Product',
        data: req.user,
        successMessage: req.flash ('success'),
        categories,
      });
    } catch (error) {
      console.log (error);
      req.flash ('error', ' An Error Occured');
      res.redirect ('/admin-dashboard/create-product');
    }
  }

  async createProduct (req, res) {
    try {
      const {product_name, price, description, category_id} = req.body;
      const newProduct = new ProductModel ({
        product_name,
        price,
        description,
        category_id,
      });
      await newProduct.save ();
      res.redirect ('/admin-dashboard');
    } catch (error) {
      console.log (error);
      req.flash ('error', ' An Error Occured');
      res.redirect ('/admin-dashboard/create-product');
    }
  }

  async getEditProductPage (req, res) {
    try {
      const productId = req.params.id;

      // Fetch the product with user details
      const product = await ProductModel.aggregate ([
        {
          $match: {_id: new mongoose.Types.ObjectId (productId)},
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'category_id',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $unwind: {
            path: '$category',
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);

      if (!product || product.length === 0) {
        return res.render ('edit-product', {
          title: 'Edit Product',
          error: 'Product not found',
        });
      }

      // 2. Fetch all categories  for dropdown
      const categories = await CategoryModel.find ();

      res.render ('edit-product', {
        title: 'Edit Product',
        product: product[0], // aggregate returns array
        data: req.user,
        categories,
      });
    } catch (error) {
      console.log (error);
      req.flash ('error', ' An Error Occured');
      res.redirect ('/admin-dashboard');
    }
  }

  async updateProduct (req, res) {
    try {
      const productId = req.params.id;

      const {product_name, price, description, category_id} = req.body;

      // Update product
      const updatedProduct = await ProductModel.findByIdAndUpdate (productId, {
        product_name,
        price,
        description,
        category_id,
      });

      if (!updatedProduct) {
        return res.render ('edit-product', {
          title: 'Edit Product',
          data: req.user,
          error: 'Product not found',
        });
      }
      res.redirect ('/admin-dashboard');
    } catch (error) {
      console.log (error);
      res.render ('edit-product', {
        title: 'Edit Product',
        data: req.user,
        error: 'Failed to fetch product details. Please try again later.',
      });
    }
  }

  async deleteProduct (req, res) {
    try {
      const productId = req.params.id;

      const deletedProduct = await ProductModel.findByIdAndDelete (productId);

      if (!deletedProduct) {
        return res.render ('/admin-dashboard', {
          title: 'All Product',
          error: 'Product not found',
        });
      }
      res.redirect ('/admin-dashboard');
    } catch (error) {
      console.log (error);
      res.render ('admin-dashboard', {
        title: 'All Product',
        error: 'Failed to fetch product details. Please try again later.',
      });
    }
  }
}

module.exports = new AdminController ();
