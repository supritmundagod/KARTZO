package com.m15.kartzo.config;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.m15.kartzo.entity.Product;
import com.m15.kartzo.entity.Review;
import com.m15.kartzo.entity.User;
import com.m15.kartzo.repository.ProductRepository;
import com.m15.kartzo.repository.ReviewRepository;
import com.m15.kartzo.repository.UserRepository;

@Configuration
public class DataSeedConfig implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Create Admin User if not exists
        if (!userRepository.existsByEmail("admin@kartzo.com")) {
            User admin = new User();
            admin.setName("System Admin");
            admin.setEmail("admin@kartzo.com");
            admin.setPassword(encoder.encode("Admin@123"));
            admin.setMobile(9999999999L);
            admin.setGender("Male");
            admin.setRole("ROLE_ADMIN");
            admin.setVerified(true);
            userRepository.save(admin);
            System.out.println(">>> Created Admin User: admin@kartzo.com / Admin@123");
        }

        // 2. Seed/Update Products
        seedProduct("iPhone 15 Pro", 129900.0, 15, "The latest flagship from Apple with Titanium design.", 
            "/images/products/iphone.png", "Electronics");
        seedProduct("MacBook Air M3", 114900.0, 8, "Supercharged by M3, thin and light laptop.", 
            "/images/products/macbook.png", "Electronics");
        seedProduct("Nike Air Max", 8999.0, 25, "Iconic comfortable sneakers for daily wear.", 
            "/images/products/sneakers.png", "Fashion");
        seedProduct("Denim Jacket", 2499.0, 40, "Classic blue denim jacket with a modern fit.", 
            "/images/products/jacket.png", "Fashion");
        seedProduct("Leather Office Chair", 12500.0, 10, "Ergonomic leather chair for your home office.", 
            "/images/products/chair.png", "Home & Living");
        seedProduct("Sony WH-1000XM5", 26990.0, 12, "Industry-leading noise canceling headphones.", 
            "/images/products/headphones.png", "Electronics");
            
        // New Products added to meet 10-15 different categories request
        seedProduct("Premium Yoga Mat", 2500.0, 30, "Non-slip eco-friendly yoga mat for your daily practice.", 
            "/images/products/yoga_mat.png", "Sports & Outdoors");
        seedProduct("Luxury Perfume", 5500.0, 20, "An elegant and long-lasting fragrance.", 
            "/images/products/perfume.png", "Beauty & Personal Care");
        seedProduct("Smart Dash Cam", 4500.0, 15, "1080p HD dash camera with night vision and loop recording.", 
            "/images/products/dash_cam.png", "Automotive");
        seedProduct("Science Fiction Novel", 499.0, 50, "Bestselling award-winning sci-fi hardcover book.", 
            "/images/products/book.png", "Books");
        seedProduct("Lego Creator Set", 3999.0, 25, "Creative building blocks for all ages.", 
            "/images/products/lego.png", "Toys & Games");
        seedProduct("Daily Multivitamins", 899.0, 40, "Complete multivitamin complex for daily health.", 
            "/images/products/vitamins.png", "Health & Wellness");
        seedProduct("Plush Dog Bed", 1800.0, 20, "Ultra soft and comfortable pet bed.", 
            "/images/products/dog_bed.png", "Pet Supplies");
        seedProduct("Artisanal Coffee Beans", 650.0, 60, "Freshly roasted organic arabica coffee beans.", 
            "/images/products/coffee.png", "Groceries");
        seedProduct("Leather Bound Notebook", 750.0, 35, "Premium quality ruled journal for writing.", 
            "/images/products/notebook.png", "Office Products");
        seedProduct("Acoustic Guitar", 8500.0, 10, "High quality wooden acoustic guitar with warm sound.", 
            "/images/products/guitar.png", "Musical Instruments");
        seedProduct("Ceramic Plant Pot", 450.0, 45, "Modern ceramic pot suitable for indoor plants.", 
            "/images/products/plant_pot.png", "Garden & Outdoors");
        seedProduct("Premium Baby Stroller", 18500.0, 5, "Lightweight and foldable stroller for babies.", 
            "/images/products/stroller.png", "Baby Products");

        // Temporary Cleanup: Remove accidentally added grouped products
        List<String> misaddedProducts = Arrays.asList(
            "Samsung Galaxy S24 Ultra", "Dell XPS 15", "Levi's 501 Original Fit Jeans", "Plain White T-Shirt", 
            "Ray-Ban Aviator Sunglasses", "Modern Velvet Sofa", "Minimalist Floor Lamp", "Wooden Standing Desk", 
            "Fluffy Area Rug", "Hex Dumbbell Set", "2-Person Camping Tent", "Mountain Bicycle", 
            "Pro Tennis Racket", "Hydrating Face Serum", "Charcoal Face Wash", "Matte Lipstick", 
            "Hair Styling Clay", "Car Vacuum Cleaner", "Microfiber Cleaning Cloths", "LED Headlight Bulbs", 
            "Portable Tire Inflator", "Gourmet Cookbook", "Historical Biography", "World History Encyclopedia", 
            "Superhero Graphic Novel", "RC Sports Car", "Monopoly Board Game", "Wooden Puzzle Set", 
            "Action Figure", "Whey Protein Powder", "Omega-3 Fish Oil", "Digital Thermometer", 
            "Posture Corrector", "Automatic Cat Feeder", "Squeaky Chew Toy", "Organic Dog Treats", 
            "Cat Scratching Post"
        );
        for (String pName : misaddedProducts) {
            Optional<Product> pOpt = productRepository.findByName(pName);
            pOpt.ifPresent(p -> productRepository.delete(p));
        }


        // 3. Add some initial reviews for the first product if none exist
        Optional<Product> iphoneOpt = productRepository.findByName("iPhone 15 Pro");
        if (iphoneOpt.isPresent()) {
            Product iphone = iphoneOpt.get();
            if (reviewRepository.countByProduct(iphone) == 0) {
                User admin = userRepository.findByEmail("admin@kartzo.com").get();
                
                Review review1 = new Review();
                review1.setRating(5);
                review1.setComment("Absolutely amazing build quality!");
                review1.setUser(admin);
                review1.setProduct(iphone);
                
                Review review2 = new Review();
                review2.setRating(4);
                review2.setComment("Great phone, but expensive.");
                review2.setUser(admin);
                review2.setProduct(iphone);
                
                reviewRepository.saveAll(Arrays.asList(review1, review2));
                
                iphone.setReviewCount(2);
                iphone.setAverageRating(4.5);
                productRepository.save(iphone);
                System.out.println(">>> Added sample reviews.");
            }
        }
    }

    private void seedProduct(String name, Double price, Integer stock, String desc, String img, String cat) {
        Optional<Product> existing = productRepository.findByName(name);
        Product p;
        if (existing.isPresent()) {
            p = existing.get();
        } else {
            p = new Product();
            p.setName(name);
        }
        p.setPrice(price);
        p.setStock(stock);
        p.setDescription(desc);
        p.setImageLink(img);
        p.setCategory(cat);
        productRepository.save(p);
    }
}
