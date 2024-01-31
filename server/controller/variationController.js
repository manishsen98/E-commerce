import prisma from "../db/db.config.js";

export const addVariation = async (req, res) => {
  try {
    const { tracking, productId, options, adminId } = req.body;

    // Create VariationName and associated VariationOptions
    const newVariation = await prisma.variationName.create({
      data: {
        tracking,
        productId,
        adminId,
        varitionOption: {
          create: options,
        },
      },
      include: {
        varitionOption: true,
      },
    });

    res.status(201).json({ success: true, data: newVariation });
  } catch (error) {
    console.error("Error adding variation:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const editVariation = async (req, res) => {
  try {
    const { variationId, tracking, options, adminId } = req.body;

    // Update VariationName and associated VariationOptions
    const updatedVariation = await prisma.variationName.update({
      where: {
        id: variationId,
      },
      data: {
        tracking,
        varitionOption: {
          upsert: options.map((option) => ({
            where: { id: option.id || undefined },
            update: { option: option.option, value: option.value },
            create: { option: option.option, value: option.value },
          })),
        },
      },
      include: {
        varitionOption: true,
      },
    });

    res.status(200).json({ success: true, data: updatedVariation });
  } catch (error) {
    console.error("Error editing variation:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const getAllVariation = async (req, res) => {
  try {
    const variations = await prisma.variationName.findMany({
      include: {
        varitionOption: true,
      },
    });

    res.status(200).json({ variations });
  } catch (error) {
    console.error("Error fetching variations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteVariation = async (req, res) => {
  try {
    const { variationId } = req.body;

    // Delete VariationName and associated VariationOptions
    await prisma.variationName.delete({
      where: {
        id: variationId,
      },
    });

    res
      .status(200)
      .json({ success: true, message: "Variation deleted successfully" });
  } catch (error) {
    console.error("Error deleting variation:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const getSingleVariation = async (req, res) => {
  try {
    const { variationId } = req.params;

    const singleVariation = await prisma.variationName.findUnique({
      where: {
        id: parseInt(variationId, 10),
      },
      include: {
        varitionOption: true,
      },
    });

    res.status(200).json({ singleVariation });
  } catch (error) {
    console.error("Error fetching single variation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
