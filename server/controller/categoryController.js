import prisma from "../db/db.config.js";

export const addCategory = async (req, res) => {
  try {
    const { name, subcategories, adminId } = req.body;

    // Create category and associated subcategories
    const newCategory = await prisma.category.create({
      data: {
        name,
        adminId,
        subcategory: {
          create: subcategories.map((subcategory) => ({
            name: subcategory,
          })),
        },
      },
      include: {
        subcategory: true,
      },
    });

    res.status(201).json({ category: newCategory });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const editCategory = async (req, res) => {
  try {
    const { categoryId, name, adminId, subcategories } = req.body;

    let updatedCategory;

    if (subcategories && subcategories?.length > 0) {
      // If subcategories are provided, update both category name and subcategories
      updatedCategory = await prisma.category.update({
        where: {
          id: parseInt(categoryId),
        },
        data: {
          name,
          adminId,
          subcategory: {
            update: subcategories.map((subcategory) => ({
              where: { id: subcategory.subcategoryId },
              data: { name: subcategory.name },
            })),
          },
        },
      });
    } else {
      // If no subcategories are provided, only update the category name
      updatedCategory = await prisma.category.update({
        where: {
          id: Number(categoryId),
        },
        data: {
          name,
          adminId,
        },
      });
    }

    res.status(200).json({ category: updatedCategory });
  } catch (error) {
    console.error("Error editing category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSingleCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    // Get category and its subcategories
    const category = await prisma.category.findUnique({
      where: {
        id: Number(categoryId),
      },
      include: {
        subcategory: true,
      },
    });

    res.status(200).json({ category });
  } catch (error) {
    console.error("Error getting category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    // Get all categories and their subcategories
    const allCategories = await prisma.category.findMany({
      include: {
        subcategory: true,
      },
    });

    res.status(200).json({ categories: allCategories });
  } catch (error) {
    console.error("Error getting all categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteSubcategory = async (req, res) => {
  try {
    const { subcategoryId } = req.params;

    // Check if the subcategory exists
    const existingSubcategory = await prisma.subCategory.findUnique({
      where: {
        id: parseInt(subcategoryId),
      },
    });

    if (!existingSubcategory) {
      return res.status(404).json({ error: "Subcategory not found" });
    }

    // Delete the subcategory
    await prisma.subCategory.delete({
      where: {
        id: parseInt(subcategoryId),
      },
    });

    res.status(200).json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
