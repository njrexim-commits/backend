import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';
import { Blog, Product, Certificate, Gallery, Inquiry } from './models/cmsModels.js';
import Settings from './models/settingsModel.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
    try {
        // Clear existing data
        await User.deleteMany();
        await Blog.deleteMany();
        await Product.deleteMany();
        await Certificate.deleteMany();
        await Gallery.deleteMany();
        await Inquiry.deleteMany();
        await Settings.deleteMany();

        // 1. Seed Users
        const createdUsers = await User.create([
            {
                name: 'Super Admin',
                email: 'super@example.com',
                password: 'password123',
                role: 'super-admin',
            },
            {
                name: 'Anand Admin',
                email: 'admin@njrexim.com',
                password: 'password123',
                role: 'admin',
            }
        ]);

        const adminId = createdUsers[0]._id;

        // 2. Seed Blogs
        await Blog.create([
            {
                title: 'Sustainable Export Trends in 2026',
                slug: 'sustainable-export-trends-2026',
                content: 'Exploring the future of global trade with a focus on eco-friendly logistics and sustainable sourcing...',
                author: adminId,
                image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1000',
                tags: ['Sustainability', 'Logistics', 'Trade'],
                isPublished: true,
            },
            {
                title: 'Digital Transformation in Supply Chain',
                slug: 'digital-transformation-supply-chain',
                content: 'How AI and Blockchain are revolutionizing the way we track and manage global shipments...',
                author: adminId,
                image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000',
                tags: ['Technology', 'AI', 'Efficiency'],
                isPublished: true,
            },
            {
                title: 'Expanding to European Markets',
                slug: 'expanding-european-markets',
                content: 'Strategic insights for exporters looking to tap into the diverse and growing European consumer base...',
                author: adminId,
                image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=1000',
                tags: ['Expansion', 'Europe', 'Strategy'],
                isPublished: false,
            }
        ]);

        // 3. Seed Products
        await Product.create([
            {
                name: 'Industrial Grade Steel Coils',
                slug: 'industrial-steel-coils',
                description: 'High-quality cold-rolled steel coils suitable for automotive and construction applications.',
                category: 'Metals',
                images: ['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1000'],
                specifications: new Map([
                    ['Thickness', '0.5mm - 3.0mm'],
                    ['Width', '1000mm - 1500mm'],
                    ['Grade', 'SS304 / SS316']
                ]),
                isFeatured: true,
            },
            {
                name: 'Organic Arabica Coffee Beans',
                slug: 'organic-arabica-coffee',
                description: 'Premium organic coffee beans sourced from high-altitude estates in Ethiopia.',
                category: 'Agriculture',
                images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1000'],
                specifications: new Map([
                    ['Roast Level', 'Medium'],
                    ['Certification', 'Organic / Fair Trade'],
                    ['Bag Size', '60kg Jute Bags']
                ]),
                isFeatured: true,
            },
            {
                name: 'Heavy Duty Excavator Parts',
                slug: 'excavator-parts-hd',
                description: 'Replacement hydraulic pumps and cylinders for leading excavator brands.',
                category: 'Machinery',
                images: ['https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=1000'],
                specifications: new Map([
                    ['Compatibility', 'CAT, Komatsu, Volvo'],
                    ['Warranty', '12 Months'],
                    ['Material', 'High-Strength Alloy']
                ]),
                isFeatured: false,
            }
        ]);

        // 4. Seed Certificates
        await Certificate.create([
            {
                title: 'ISO 9001:2015 Quality Management',
                issuer: 'International Standards Organization',
                issueDate: new Date('2024-05-15'),
                fileUrl: 'https://example.com/iso-cert.pdf',
                thumbnail: 'https://images.unsplash.com/photo-1589330694653-99732f7900b3?auto=format&fit=crop&q=80&w=200',
            },
            {
                title: 'Export Excellence Award 2025',
                issuer: 'Export Promotion Council',
                issueDate: new Date('2025-02-10'),
                fileUrl: 'https://example.com/award.pdf',
                thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=200',
            }
        ]);

        // 5. Seed Gallery
        await Gallery.create([
            {
                title: 'State-of-the-art Warehouse',
                imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
                category: 'Infrastructure',
            },
            {
                title: 'Global Export Team 2025',
                imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
                category: 'Events',
            },
            {
                title: 'Quality Check Process',
                imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
                category: 'General',
            },
            {
                title: 'Port Shipment Logistics',
                imageUrl: 'https://images.unsplash.com/photo-1494412574743-01947b4d599d?auto=format&fit=crop&q=80&w=800',
                category: 'Infrastructure',
            }
        ]);

        // 6. Seed Inquiries
        await Inquiry.create([
            {
                name: 'John Smith',
                email: 'john.smith@gmail.com',
                phone: '+1 202 555 0123',
                subject: 'Bulk Steel Inquiry',
                message: 'I am interested in ordering 500 tons of cold-rolled steel coils. Please provide a formal quote including shipping to Port of Los Angeles.',
                status: 'new',
            },
            {
                name: 'Elena Rodriguez',
                email: 'e.rodriguez@tradecorp.es',
                phone: '+34 912 345 678',
                subject: 'Partnership Opportunity',
                message: 'Our company is looking for a reliable export partner in your region for agricultural products. Would love to discuss this further.',
                status: 'read',
            },
            {
                name: 'David Chen',
                email: 'd.chen@logistics.com.hk',
                phone: '+852 2345 6789',
                subject: 'Logistics Quotation',
                message: 'Can you handle freight forwarding for machinery parts to Hong Kong? Please share your rates.',
                status: 'replied',
            }
        ]);

        // 7. Seed Settings
        await Settings.create({
            siteName: 'NJR EXIM - Global Trading Solutions',
            siteDescription: 'Leading exporter of industrial grade metals, premium agricultural products, and heavy machinery parts worldwide.',
            contactEmail: 'contact@njrexim.com',
            contactPhone: '+1 (555) 012-3456',
            address: '123 Export Plaza, Global Trade District, CA 90210, USA',
            facebookUrl: 'https://facebook.com/njrexim',
            twitterUrl: 'https://twitter.com/njrexim',
            linkedinUrl: 'https://linkedin.com/company/njrexim',
            instagramUrl: 'https://instagram.com/njrexim',
        });

        console.log('✅ All Data Successfully Seeded!');
        process.exit();
    } catch (error) {
        console.error(`❌ Seeding Error: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Blog.deleteMany();
        await Product.deleteMany();
        await Certificate.deleteMany();
        await Gallery.deleteMany();
        await Inquiry.deleteMany();
        await Settings.deleteMany();

        console.log('🗑️ Data Successfully Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`❌ destruction Error: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
