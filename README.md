# 🛒 Kartzo - Enterprise E-Commerce Platform

Kartzo is a modern, enterprise-ready, full-stack e-commerce application. It features a complete shopping experience from user authentication to product checkout, leveraging a **dual-frontend strategy** (Next.js 15 modern UI and classic Thymeleaf views) powered by a robust **Java / Spring Boot** REST API.

Integrations include **Razorpay** for payment processing, **Twilio** for SMS OTP verification, **Cloudinary** for scalable image hosting/CDN, and **JavaMailSender** for email updates.

---

## 🛠️ Tech Stack & Architecture

### Backend & API
- **Java 17 & Spring Boot 3.5.7**
- **Spring Security** (Session-based auth, password hashing, role-based protection)
- **Spring Data JPA** & **Hibernate** (Database mappings & queries)
- **MySQL Database**
- **Maven** (Dependency and build management)

### Modern Frontend (`/web`)
- **Next.js 15 (App Router)** & **React 19** (Server Components for SEO/speed, Client Components for interactivity)
- **Tailwind CSS 4** (Utility-first styling system)
- **Framer Motion** (Smooth transitions & micro-animations)
- **Radix UI / Lucide React** (Accessible components & modern icons)
- **CORS-Free Proxying**: All API calls are proxied through `/api/backend/[...path]` in Next.js directly to Spring Boot to avoid CORS issues and seamless cookie/session forwarding.

### Classic Thymeleaf Frontend (`/src/main/resources/templates`)
- **Thymeleaf Templates** (Server-side rendered dynamic UI)
- **Bootstrap 5** (Responsive layout and components)
- **Custom CSS Variables** (Unified dark-mode compatible design system)

### Third-Party Integrations
- **Razorpay**: Checkout payment gateway integration.
- **Cloudinary**: Multipart file uploads for product images and user avatars.
- **Twilio**: SMS OTP delivery for secure user registration and password resets.
- **JavaMailSender**: Multi-purpose HTML transactional emails.
- **OpenPDF**: Server-side PDF invoice generation on request.

---

## 📁 Project Structure

```text
Kartzo/
├── src/main/java/com/m15/kartzo/
│   ├── api/                         # Next.js API endpoints (Catalog, Wishlist, Cart, Reviews, Profile, etc.)
│   ├── config/                      # App config: MySecurityConfiguration, DataSeedConfig, NextJsDevServerLauncher
│   ├── controller/                  # Legacy/Thymeleaf controllers (ViewController, AdminController)
│   ├── dao/                         # Custom database queries & user persistence helpers
│   ├── dto/                         # Data Transfer Objects (PasswordDto, ProductDto, UserDto)
│   ├── entity/                      # JPA Entities (User, Product, CartItem, Order, OrderItem, Review, Coupon, WishlistItem)
│   ├── repository/                  # Spring Data JPA CRUD interfaces
│   ├── security/                    # CustomUserDetails, CustomUserDetailsService for authentication
│   ├── service/                     # Business logic services (UserService, AdminService, WishlistService, etc.)
│   └── util/                        # Utilities (CloudinaryHelper, OtpSender)
│
├── src/main/resources/
│   ├── static/                      # Static resources (product images seed, custom scripts/styles)
│   ├── templates/                   # Thymeleaf pages (home, cart, checkout, profile, etc.)
│   ├── application.properties       # Main configuration and integration credentials
│   └── application-dev.properties   # Developer-specific configuration (Next.js integrated launcher)
│
├── web/                             # Next.js 15 Storefront
│   ├── src/app/                     # Pages & client-side routes (auth, shop, checkout, cart)
│   ├── src/components/              # Reusable React components (UI wrappers, header, footer)
│   ├── src/lib/                     # API client wrappers and helpers
│   └── package.json                 # Next.js scripts & dependencies
│
├── Dockerfile                       # Production Spring Boot containerization
├── run.bat                          # Automated Windows developer script
└── pom.xml                          # Maven build setup
```

---

## 🔑 Default Seeding & Autoloaded Data

To make local testing seamless, the application automatically runs a seeder (`DataSeedConfig`) on startup. It performs the following operations if they do not already exist in your database:

### 1. Default Admin Credentials
Log in to the system via `http://localhost:8080/login` or `http://localhost:3000/login` using:
- **Email:** `admin@kartzo.com`
- **Password:** `Admin@123`
- **Role:** `ROLE_ADMIN`

### 2. Product Catalog
Seeds **18 sample products** complete with high-quality localized image assets (`/images/products/*`) across **15 distinct categories**:
- *Electronics, Fashion, Home & Living, Sports & Outdoors, Beauty & Personal Care, Automotive, Books, Toys & Games, Health & Wellness, Pet Supplies, Groceries, Office Products, Musical Instruments, Garden & Outdoors, Baby Products.*

### 3. Sample Reviews
Seeds initial ratings and reviews for the product `"iPhone 15 Pro"` to demonstrate aggregate rating averages on page load.

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- **Java 17 JDK** installed and configured in your environment.
- **Node.js LTS (v20+)** and **npm** installed.
- **MySQL Server** running locally on port `3306`.

### Setup Steps

#### 1. Configure the Database
Ensure MySQL is running, and create a database named `kartzo` (or let Spring Boot create it automatically if `createDatabaseIfNotExist=true` is enabled in your connection string):
```sql
CREATE DATABASE IF NOT EXISTS kartzo;
```

#### 2. Environment Variables
Provide API credentials in `src/main/resources/application.properties`:
```properties
# Database (Update password accordingly)
spring.datasource.username=root
spring.datasource.password=YourMySQLPassword

# Email (SMTP server settings for Gmail notifications)
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password

# Cloudinary image hosting URL
cloudinary.url=cloudinary://key:secret@cloudname

# Twilio SMS API Credentials
twilio.sid=ACxxxx
twilio.auth.token=xxxx
twilio.mobile=+1234567890

# Razorpay key details for testing orders
razorpay.id=rzp_test_xxxx
razorpay.secret=xxxx
```

#### 3. Run the Application
You can choose between running the unified dev script, the integrated IDE launchers, or separate terminals:

##### Option A: The Unified Script (Recommended on Windows)
Simply double-click or run the `run.bat` script in the root directory:
```bash
.\run.bat
```
*What this script does:*
1. Verifies that `Node.js` and `npm` are installed.
2. Checks for `/web/.env.local` and creates it from the example template automatically if it doesn't exist.
3. Automatically runs `npm install` inside the `/web` folder to fetch dependencies.
4. Starts Spring Boot with the `dev` profile, which automatically executes `NextJsDevServerLauncher` to spin up the Next.js storefront.
5. Launches your default web browser pointing directly to the storefront once ready.

##### Option B: Integrated Dev Profile (Command Line)
Start Spring Boot with the `dev` profile active. The backend launcher will automatically spin up Next.js on port `3000` in the background and terminate it when Spring Boot shuts down:
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

##### Option C: Manual Split Running
If you prefer running the backend and frontend in separate consoles:
- **Terminal 1 (Backend):**
  ```bash
  ./mvnw spring-boot:run
  ```
- **Terminal 2 (Next.js Frontend):**
  ```bash
  cd web
  # Create .env.local with credentials:
  # SPRING_BACKEND_URL=http://localhost:8080
  # NEXT_PUBLIC_SITE_URL=http://localhost:3000
  # NEXT_PUBLIC_MEDIA_ORIGIN=http://localhost:8080
  npm install
  npm run dev
  ```

---

## 🎯 Port Mappings & URLs
- **Modern Next.js Storefront:** [http://localhost:3000](http://localhost:3000)
- **Legacy Thymeleaf Web App:** [http://localhost:8080](http://localhost:8080)
- **Spring Boot REST API Root:** [http://localhost:8080/api/v1](http://localhost:8080/api/v1)
- **Admin Dashboard (Thymeleaf UI):** [http://localhost:8080/admin/dashboard](http://localhost:8080/admin/dashboard)

---

## 📊 Core Features & REST API Mappings
The Next.js modern UI calls dedicated REST endpoints implemented in the Spring Boot backend:

1. **User Authentication & OTPs**
   - Endpoints: `POST /register`, `POST /otp`, `POST /resend-otp`, `POST /forgot-password`, `POST /reset-password`
   - Flow: Users receive OTP verification codes via Twilio SMS or JavaMailSender email.
2. **Product Catalog & Search**
   - Endpoint: `/api/v1/catalog`
   - Supports advanced search specifications, category filtering (e.g. `?category=Electronics`), sorting, and paginated queries.
3. **Shopping Cart & Checkout**
   - Endpoints: `/api/v1/me/cart`, `/api/v1/me/checkout`
   - Connects live cart items to the user session, checks discount eligibility with coupon codes, generates Razorpay order IDs, and processes orders securely.
4. **Wishlist (Save for Later)**
   - Endpoint: `/api/v1/me/wishlist`
   - Simple heart icon mapping allows dynamic additions and removals from the user's dashboard.
5. **Product Reviews & Ratings**
   - Endpoint: `/api/v1/me/reviews`
   - Enables users to write text comments and rate products from 1 to 5 stars, automatically computing average product ratings.
6. **Order Status Tracking & Invoices**
   - Endpoints: `/api/v1/me/orders`
   - Updates order states (`PROCESSING`, `SHIPPED`, `DELIVERED`). Generates dynamic printable PDF invoices on `/order/invoice/{id}` using the `OpenPDF` engine.
7. **Coupons & Promotions**
   - Endpoint: `/admin/coupons`
   - Admins can create and delete active discount codes, automatically applied at the checkout validation phase.

---

## 🐳 Docker Deployment (Production)

You can containerize the Spring Boot application using the provided `Dockerfile`.

### Build Image
```bash
docker build -t kartzo-backend .
```

### Run Container
```bash
docker run -p 8080:8080 \
  -e DB_URL=mysql://host.docker.internal:3306/kartzo \
  -e DB_UN=root \
  -e DB_PWD=yourpassword \
  kartzo-backend
```
*(Make sure to update environment variables inside the container command to reflect production MySQL settings).*
