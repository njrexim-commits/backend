import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Page from '../models/pageModel.js';
import connectDB from '../config/db.js';

dotenv.config();

const pages = [
    {
        title: 'Home',
        slug: 'home',
        content: {
            hero: {
                badge: 'Welcome to NJR EXIM',
                title: 'Your Trusted Partner in',
                highlightedText: 'Global Agricultural Trade',
                description: 'Delivering premium quality agricultural and food products to international markets with excellence, reliability, and commitment to sustainability.',
                buttonText: 'Explore Our Products',
                buttonLink: '/products',
                slides: []
            },
            about: {
                badge: 'About Us',
                title: 'Excellence in Export',
                description: 'With years of experience in international trade, we specialize in exporting high-quality agricultural products to global markets.',
                features: [
                    'Quality Certified Products',
                    'Global Export Network',
                    'Sustainable Sourcing',
                    'Timely Delivery'
                ]
            },
            stats: {
                yearsExperience: '10+',
                countriesServed: '25+',
                productsExported: '50+',
                satisfiedClients: '500+'
            }
        },
        isActive: true
    },
    {
        title: 'About Us',
        slug: 'about',
        content: {
            hero: {
                badge: 'About NJR EXIM',
                title: 'Leading the Way in',
                highlightedText: 'Agricultural Exports',
                description: 'Committed to delivering quality products and building lasting relationships with our global partners.'
            },
            story: {
                title: 'Our Story',
                description: 'Founded with a vision to bridge the gap between Indian agriculture and global markets, NJR EXIM has grown into a trusted name in agricultural exports.'
            },
            mission: {
                title: 'Our Mission',
                description: 'To provide the highest quality agricultural products to international markets while supporting local farmers and promoting sustainable practices.'
            },
            vision: {
                title: 'Our Vision',
                description: 'To be the most trusted and preferred partner for agricultural exports globally, known for quality, reliability, and innovation.'
            }
        },
        isActive: true
    },
    {
        title: 'Contact Us',
        slug: 'contact',
        content: {
            hero: {
                badge: 'Get In Touch',
                title: 'Contact Us',
                description: 'Have questions about our products or services? We\'re here to help. Reach out to us and we\'ll respond as soon as possible.'
            },
            info: {
                address: ['123 Export Zone, Industrial Area', 'Mumbai, Maharashtra 400001, India'],
                phones: ['+91 123 456 7890', '+91 098 765 4321'],
                emails: ['info@njrexim.com', 'sales@njrexim.com'],
                workingHours: ['Monday - Friday: 9:00 AM - 6:00 PM', 'Saturday: 9:00 AM - 1:00 PM']
            }
        },
        isActive: true
    },
    {
        title: 'Products',
        slug: 'products',
        content: {
            hero: {
                badge: 'Our Products',
                title: 'Premium Quality',
                highlightedText: 'Export Products',
                description: 'Explore our comprehensive range of agricultural and food products, carefully sourced and prepared to meet international quality standards.'
            },
            features: {
                title: 'Why Choose Our Products?',
                description: 'We ensure every product meets the highest standards of quality and safety.',
                items: [
                    {
                        title: 'Quality Certified',
                        description: 'All products undergo rigorous quality testing and certification'
                    },
                    {
                        title: 'Fresh & Natural',
                        description: 'Sourced directly from verified farms and suppliers'
                    },
                    {
                        title: 'International Standards',
                        description: 'Compliant with global food safety and quality regulations'
                    },
                    {
                        title: 'Custom Packaging',
                        description: 'Flexible packaging options to meet your market requirements'
                    }
                ]
            },
            cta: {
                title: 'Need a Custom Quote?',
                description: 'Contact us for pricing, minimum order quantities, and custom packaging options.',
                buttonText: 'Get In Touch',
                buttonLink: '/contact'
            }
        },
        isActive: true
    },
    {
        title: 'Blog',
        slug: 'blog',
        content: {
            hero: {
                badge: 'Blog & Insights',
                title: 'Industry',
                highlightedText: 'Insights',
                description: 'Stay informed with the latest trends, insights, and news from the agricultural export industry.'
            },
            newsletter: {
                title: 'Stay Updated with Our Newsletter',
                description: 'Subscribe to receive the latest industry insights, market trends, and company updates directly to your inbox.'
            }
        },
        isActive: true
    },
    {
        title: 'Gallery',
        slug: 'gallery',
        content: {
            hero: {
                badge: 'Our Gallery',
                title: 'Facilities &',
                highlightedText: 'Product Gallery',
                description: 'Take a visual journey through our state-of-the-art facilities, quality products, and global operations.'
            },
            categories: {
                description: 'Browse our gallery by category to see our products, facilities, and operations.'
            }
        },
        isActive: true
    },
    {
        title: 'Certificates',
        slug: 'certificates',
        content: {
            hero: {
                badge: 'Certifications',
                title: 'Quality',
                highlightedText: 'Certifications',
                description: 'Our commitment to quality is validated by international certifications and compliance with global food safety standards.'
            },
            standards: {
                title: 'Quality Standards & Compliance',
                description: 'We adhere to stringent quality standards and provide comprehensive documentation for all our exports.'
            },
            whyMatters: {
                title: 'Why Our Certifications Matter',
                items: [
                    {
                        title: 'Trust & Credibility',
                        description: 'Our certifications provide assurance of quality and compliance to our international clients.'
                    },
                    {
                        title: 'Market Access',
                        description: 'Certifications enable us to export to regulated markets with strict import requirements.'
                    },
                    {
                        title: 'Quality Assurance',
                        description: 'Systematic quality management ensures consistent product quality across all shipments.'
                    },
                    {
                        title: 'Risk Mitigation',
                        description: 'Compliance with international standards reduces risks of product rejection and recalls.'
                    }
                ]
            },
            cta: {
                title: 'Need Certificate Copies?',
                description: 'Request digital or physical copies of our certifications and quality documentation.',
                buttonText: 'Contact Us',
                buttonLink: '/contact'
            }
        },
        isActive: true
    }
];

const initializePages = async () => {
    try {
        await connectDB();

        console.log('Initializing pages...');

        // Delete existing pages
        await Page.deleteMany({});
        console.log('Cleared existing pages');

        // Insert new pages
        const createdPages = await Page.insertMany(pages);
        console.log(`Created ${createdPages.length} pages successfully`);

        createdPages.forEach(page => {
            console.log(`- ${page.title} (${page.slug})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error initializing pages:', error);
        process.exit(1);
    }
};

initializePages();
