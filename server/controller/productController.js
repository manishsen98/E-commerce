// import prisma from "../db/db.config.js";
import prisma from "../db/db.config.js";

export const addProduct = async (req, res) => {
  const dummyData = {
    name: "Casual Jeans",
    description: "Comfortable and stylish jeans for everyday wear",
    mainImg: "jeans_image.jpg",
    adminId: 1,
    category: {
      name: "Men's Wear",
      subcategory: "Bottoms",
    },
    productItem: [
      {
        stockQuantity: 80,
        productImg: ["BlueJeans.jpg"],
        price: 49.99,
        isFeatured: true,
        variation: [
          {
            tracking: "Size",
            varitionOption: [
              {
                option: "M",
                value: "Medium",
              },
              {
                option: "L",
                value: "Large",
              },
            ],
          },
          {
            tracking: "Color",
            varitionOption: [
              {
                option: "Blue",
                value: "#ofblue",
              },
            ],
          },
        ],
      },
      {
        stockQuantity: 120,
        productImg: ["BlackJeans.jpg"],
        price: 59.99,
        isFeatured: false,
        variation: [
          {
            tracking: "Size",
            varitionOption: [
              {
                option: "S",
                value: "Small",
              },
              {
                option: "XL",
                value: "Extra Large",
              },
            ],
          },
          {
            tracking: "Color",
            varitionOption: [
              {
                option: "Black",
                value: "#ofblack",
              },
            ],
          },
        ],
      },
      {
        stockQuantity: 100,
        productImg: ["GrayJeans.jpg"],
        price: 54.99,
        isFeatured: true,
        variation: [
          {
            tracking: "Size",
            varitionOption: [
              {
                option: "M",
                value: "Medium",
              },
              {
                option: "L",
                value: "Large",
              },
            ],
          },
          {
            tracking: "Color",
            varitionOption: [
              {
                option: "Gray",
                value: "#ofgray",
              },
            ],
          },
        ],
      },
      {
        stockQuantity: 90,
        productImg: ["SlimFitJeans.jpg"],
        price: 69.99,
        isFeatured: true,
        variation: [
          {
            tracking: "Size",
            varitionOption: [
              {
                option: "S",
                value: "Small",
              },
              {
                option: "M",
                value: "Medium",
              },
            ],
          },
          {
            tracking: "Color",
            varitionOption: [
              {
                option: "Indigo",
                value: "#4b0082",
              },
            ],
          },
        ],
      },
    ],
  };

  try {
    // Create Product
    const createdProduct = await prisma.product.create({
      data: {
        name: dummyData.name,
        description: dummyData.description,
        mainImg: dummyData.mainImg,
        adminId: dummyData.adminId,
        category: {
          create: [
            {
              name: dummyData.category.name,
              subcategory: {
                create: [
                  {
                    name: dummyData.category.subcategory,
                  },
                ],
              },
            },
          ],
        },
        productItem: {
          create: dummyData.productItem.map((item) => {
            return {
              stockQuantity: item.stockQuantity,
              productImg: item.productImg,
              price: item.price,
              isFeatured: item.isFeatured,
              variation: {
                create: item.variation.map((variationItem) => {
                  return {
                    tracking: variationItem.tracking,
                    varitionOption: {
                      create: variationItem.varitionOption.map(
                        (varitionOptionItem) => {
                          return {
                            option: varitionOptionItem.option,
                            value: varitionOptionItem.value,
                          };
                        }
                      ),
                    },
                  };
                }),
              },
            };
          }),
        },
      },
    });

    res.status(200).json({ success: true, data: createdProduct });
  } catch (error) {
    console.error("Error adding products:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;

    const products = await prisma.product.findMany({
      where: {
        category: {
          some: {
            name: categoryName,
          },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        mainImg: true,
        productItem: {
          select: {
            id: true,
            stockQuantity: true,
            productImg: true,
            price: true,
            isFeatured: true,
            variation: {
              select: {
                id: true,
                tracking: true,
                varitionOption: {
                  select: {
                    id: true,
                    option: true,
                    value: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
};
