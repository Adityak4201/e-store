const Category = require("../models/categoryModel");

exports.addProductCategory = async (req, res) => {
  const { category } = req.body;
  const path = req.file.path.split("uploads")[1];

  const categoryData = new Category({
    category_name: category,
    category_image: path,
  });

  await categoryData
    .save()
    .then((response) => {
      // console.log(response);
      return res.json({ category: response });
    })
    .catch((err) => {
      console.log(err);
      if (Object.keys(err.keyPattern)[0] === "category_image")
        return res.status(403).json({ error: "Same image already exists" });
      else if (Object.keys(err.keyPattern)[0] === "category_name")
        return res.status(403).json({ error: "Same category already exists" });
      else {
        console.log(err);
        return res.status(404).json({ error: err });
      }
    });
};

exports.getProductCategories = async (req, res) => {
  try {
    const categories = await Category.find(
      {},
      { category_name: 1, category_image: 1, _id: 0 }
    );
    if (!categories) throw "No Categories";
    // console.log(categories);
    return res.json({ categories });
  } catch (error) {
    return res.status(404).json({ error });
  }
};
