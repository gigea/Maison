# UML Diagrams for MAISON Fashion E-Commerce

This document contains the main UML diagrams for the `ecommerce` website.

## 1. Use Case Diagram
```mermaid
usecaseDiagram
  actor Guest
  actor Customer as "Registered User"
  actor Admin

  Guest --> (Browse products)
  Guest --> (Search / filter products)
  Guest --> (View product details)
  Guest --> (Register)
  Guest --> (Login)

  Customer --> (Add product to cart)
  Customer --> (View cart)
  Customer --> (Checkout)
  Customer --> (View order history)
  Customer --> (View order detail)
  Customer --> (Leave product review)

  Admin --> (Create product)
  Admin --> (Edit product)
  Admin --> (Delete product)
  Admin --> (View all orders)
  Admin --> (Update order status)
  Admin --> (Manage users)

  (Checkout) ..> (Login) : "requires authentication"
  (Leave product review) ..> (Login) : "requires authentication"
```

## 2. Component Diagram
```mermaid
flowchart TB
  subgraph Frontend [React Frontend]
    App[App.jsx]
    AuthContext[AuthContext]
    CartContext[CartContext]
    Navbar[Navbar]
    Home[Home.jsx]
    Products[Products.jsx]
    ProductDetail[ProductDetail.jsx]
    Cart[Cart.jsx]
    Checkout[Checkout.jsx]
    Orders[Orders.jsx]
    OrderDetail[OrderDetail.jsx]
    Admin[Admin.jsx]
    AdminProductForm[AdminProductForm.jsx]
    ProductFilters[ProductFilters.jsx]
    ProductCard[ProductCard.jsx]
    AuthPage[Auth.jsx]
  end

  subgraph Backend [Express Backend]
    Server[server.js]
    AuthRoutes[/api/auth]
    ProductRoutes[/api/products]
    OrderRoutes[/api/orders]
    UserRoutes[/api/users]
    CartRoutes[/api/cart]
    AuthMiddleware[auth middleware]
    ProductModel[Product]
    UserModel[User]
    OrderModel[Order]
  end

  subgraph Database [MongoDB]
    MongoDB[(MongoDB)]
  end

  App --> AuthContext
  App --> CartContext
  App --> Navbar
  App --> Home
  App --> Products
  App --> ProductDetail
  App --> Cart
  App --> Checkout
  App --> Orders
  App --> OrderDetail
  App --> Admin
  App --> AdminProductForm

  Products --> ProductFilters
  Products --> ProductCard
  Home --> ProductCard
  ProductDetail --> ProductCard

  AuthContext -->|requests| AuthRoutes
  CartContext -->|client-side state| CartRoutes
  Checkout -->|POST /orders| OrderRoutes
  Orders -->|GET /orders/myorders| OrderRoutes
  ProductDetail -->|GET /products/:id| ProductRoutes
  Products -->|GET /products| ProductRoutes
  Admin -->|GET/POST/PUT/DELETE /products| ProductRoutes
  AuthPage -->|POST /auth/login, /auth/register| AuthRoutes
  AuthPage -->|GET /auth/me| AuthRoutes

  AuthRoutes --> AuthMiddleware
  ProductRoutes --> AuthMiddleware
  OrderRoutes --> AuthMiddleware
  UserRoutes --> AuthMiddleware

  AuthRoutes --> UserModel
  ProductRoutes --> ProductModel
  OrderRoutes --> OrderModel
  OrderRoutes --> UserModel
  UserRoutes --> UserModel
  ProductRoutes --> UserModel
  OrderRoutes --> ProductModel

  ProductModel --> MongoDB
  UserModel --> MongoDB
  OrderModel --> MongoDB
```

## 3. Class Diagram
```mermaid
classDiagram
  class User {
    +String name
    +String email
    +String password
    +String role
    +String avatar
    +String[] wishlist
    +Address[] addresses
    +matchPassword(password)
  }

  class Product {
    +String name
    +String description
    +Number price
    +Number salePrice
    +String category
    +String gender
    +String[] sizes
    +Color[] colors
    +String[] images
    +Number stock
    +String brand
    +String[] tags
    +Review[] reviews
    +Number rating
    +Number numReviews
    +Boolean featured
    +Boolean isActive
  }

  class Order {
    +ObjectId user
    +OrderItem[] items
    +ShippingAddress shippingAddress
    +String paymentMethod
    +Object paymentResult
    +Number itemsPrice
    +Number shippingPrice
    +Number taxPrice
    +Number totalPrice
    +String status
    +Boolean isPaid
    +Date paidAt
    +Boolean isDelivered
    +Date deliveredAt
  }

  class OrderItem {
    +ObjectId product
    +String name
    +String image
    +Number price
    +String size
    +String color
    +Number quantity
  }

  class Address {
    +String label
    +String street
    +String city
    +String state
    +String zip
    +String country
    +Boolean isDefault
  }

  class Review {
    +ObjectId user
    +String name
    +Number rating
    +String comment
    +Date createdAt
  }

  User "1" o-- "*" Address
  User "1" o-- "*" Product : wishlist
  Product "1" o-- "*" Review
  Order "1" o-- "*" OrderItem
  Order "*" o-- "1" User
  OrderItem "*" o-- "1" Product
```

## 4. Sequence Diagram: Login
```mermaid
sequenceDiagram
  participant Browser
  participant Frontend
  participant Backend
  participant MongoDB

  Browser->>Frontend: User submits login form
  Frontend->>Backend: POST /api/auth/login
  Backend->>MongoDB: findOne({ email })
  MongoDB-->>Backend: user document
  Backend->>Backend: verify password
  Backend-->>Frontend: { user, token }
  Frontend->>Browser: store token + user in localStorage
  Browser-->>Frontend: navigate to authenticated page
```

## 5. Sequence Diagram: Checkout
```mermaid
sequenceDiagram
  participant Browser
  participant Frontend
  participant Backend
  participant MongoDB

  Browser->>Frontend: User clicks checkout
  Frontend->>Backend: POST /api/orders
  Backend->>MongoDB: create Order document
  MongoDB-->>Backend: new order
  Backend-->>Frontend: order response
  Frontend->>Browser: clear local cart and redirect to /orders/:id
```

## 6. Sequence Diagram: Admin Product Management
```mermaid
sequenceDiagram
  participant AdminBrowser
  participant Frontend
  participant Backend
  participant MongoDB

  AdminBrowser->>Frontend: open admin dashboard
  Frontend->>Backend: GET /api/products
  Backend->>MongoDB: find products
  MongoDB-->>Backend: product list
  Backend-->>Frontend: products

  AdminBrowser->>Frontend: click create/edit/delete
  Frontend->>Backend: POST/PUT/DELETE /api/products
  Backend->>MongoDB: save/update/remove product
  MongoDB-->>Backend: result
  Backend-->>Frontend: updated product info
```

## Notes
- `Cart` state is managed entirely in `CartContext` and stored in browser `localStorage`.
- `AuthContext` similarly stores logged-in user data and JWT token.
- Most backend features are served via REST endpoints under `/api/*`.
- The `cart` backend route is a stub because cart state remains client-side.
