model User {
id Int @id @default(autoincrement())
name String
email String @unique
phone String?
password String @bcrypt
addresses Address[]
paymentMethods PaymentMethod[]
orders Order[]
reviews Review[]

@@map("users")
}

model Address {
id Int @id @default(autoincrement())
userId Int @relation(fields: [userId], references: [id], cascade: deletes)
street1 String
street2 String?
city String
state String
country String
postcode String
isDefault Boolean @default(false)

@@map("addresses")
}

model PaymentMethod {
id Int @id @default(autoincrement())
userId Int @relation(fields: [userId], references: [id], cascade: deletes)
provider String
type String
details String
isDefault Boolean @default(false)

@@map("payment_methods")
}

model Product {
id Int @id @default(autoincrement())
name String
description String?
price Decimal @db.Decimal
sku String
stock Int
categories Category[]
variations ProductVariation[]
reviews Review[]

@@map("products")
}

model Category {
id Int @id @default(autoincrement())
name String
parent Category? @relation(fields: [parentId], references: [id])
children Category[]
products Product[]

@@map("categories")
}

model ProductVariation {
id Int @id @default(autoincrement())
productId Int @relation(fields: [productId], references: [id], cascade: deletes)
option String
value String

@@map("product_variations")
}

model Order {
id Int @id @default(autoincrement())
userId Int @relation(fields: [userId], references: [id])
address Address @relation(fields: [addressId], references: [id])
paymentMethod PaymentMethod @relation(fields: [paymentMethodId], references: [id])
shippingMethod String
status OrderStatus
total Decimal @db.Decimal
items OrderItem[]

@@map("orders")
}

model OrderItem {
id Int @id @default(autoincrement())
orderId Int @relation(fields: [orderId], references: [id])
productId Int @relation(fields: [productId], references: [id])
variation String?
quantity Int
price Decimal @db.Decimal

@@map("order_items")
}

enum OrderStatus {
PROCESSING
SHIPPED
DELIVERED
CANCELLED
}

model Review {
id Int @id @default(autoincrement())
userId Int @relation(fields: [userId], references: [id])
productId Int @relation(fields: [productId], references: [id])
rating Int
comment String

@@map("reviews")
}

model Promotion {
id Int @id @default(autoincrement())
category Category @relation(fields: [categoryId], references: [id])
categoryId Int @relation(fields: [categoryId], references: [id])
discount Decimal @db.Decimal
startDate DateTime
endDate DateTime

@@map("promotions")
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////
