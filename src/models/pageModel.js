import mongoose from 'mongoose';

const pageSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        content: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Page = mongoose.model('Page', pageSchema);

export default Page;
