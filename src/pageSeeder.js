import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Page from './models/pageModel.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const pages = [
    {
        title: 'Home Page',
        slug: 'home',
        content: {
            hero: {
                title: "Discover Excellence in Exporting Quality Goods",
                highlightedText: "Exporting",
                description: "Explore our diverse range of top-quality export products including premium rice, fresh fruits, vegetables, spices, and essential food items. We deliver consistent quality that meets international standards and build long-term global partnerships.",
                buttonText: "Explore Products",
                buttonLink: "/products",
                slides: [
                    { id: 1, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1920&q=80", alt: "Premium rice in bowl" },
                    { id: 2, image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=1920&q=80", alt: "Fresh fruits export" },
                    { id: 3, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1920&q=80", alt: "Fresh vegetables" },
                    { id: 4, image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1920&q=80", alt: "Premium spices" },
                    { id: 5, image: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1920&q=80", alt: "Logistics" }
                ]
            },
            aboutSection: {
                badge: "About NJR EXIM",
                title: "Connecting Indian Excellence to the World",
                description: "NJR EXIM is a premier international export trading company based in India. We specialize in sourcing and delivering the finest agricultural and food products.",
                stats: [
                    { label: "Years Experience", value: "05+" },
                    { label: "Countries Served", value: "25+" },
                    { label: "Product Categories", value: "10+" }
                ]
            }
        }
    },
    {
        title: 'About Us Page',
        slug: 'about',
        content: {
            hero: {
                badge: "About NJR Exim",
                title: "Your Trusted Partner in Global Trade",
                description: "With years of experience in international trade, we've built a reputation for delivering premium agricultural and food products to markets across the globe."
            },
            values: [
                {
                    icon: "Target",
                    title: "Our Mission",
                    description: "To provide premium quality agricultural and food products to global markets, establishing long-term partnerships built on trust, reliability, and excellence."
                },
                {
                    icon: "Eye",
                    title: "Our Vision",
                    description: "To become a leading international export company recognized for quality, innovation, and customer satisfaction in the global agricultural trade industry."
                },
                {
                    icon: "Award",
                    title: "Quality Commitment",
                    description: "We maintain the highest quality standards through rigorous testing, certifications, and partnerships with verified suppliers who share our commitment to excellence."
                }
            ],
            story: {
                badge: "Our Story",
                title: "Building Bridges Between Markets",
                content: [
                    "NJR Exim was founded with a simple yet powerful vision: to connect the finest agricultural products from India with global markets seeking quality, reliability, and consistency.",
                    "Starting from humble beginnings, we've grown into a trusted name in international export, serving clients across the Middle East, Europe, Southeast Asia, and beyond.",
                    "Today, we handle everything from sourcing and quality control to packaging, documentation, and logistics, ensuring a seamless experience for our clients."
                ],
                image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80",
                statValue: "100%",
                statLabel: "Customer Satisfaction"
            }
        }
    },
    {
        title: 'Contact Page',
        slug: 'contact',
        content: {
            hero: {
                badge: "Get In Touch",
                title: "Contact Us",
                description: "Have questions about our products or services? We're here to help. Reach out to us and we'll respond as soon as possible."
            },
            info: {
                address: ["123 Export Zone, Industrial Area", "Mumbai, Maharashtra 400001, India"],
                phones: ["+91 123 456 7890", "+91 098 765 4321"],
                emails: ["info@njrexim.com", "sales@njrexim.com"],
                workingHours: ["Monday - Friday: 9:00 AM - 6:00 PM", "Saturday: 9:00 AM - 1:00 PM"]
            }
        }
    }
];

const importData = async () => {
    try {
        await Page.deleteMany();
        await Page.insertMany(pages);
        console.log('Page Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
