"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.News = void 0;
const mongoose_1 = require("mongoose");
const newsSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['tournament', 'education', 'event', 'other'],
        default: 'other'
    },
    author: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
exports.News = (0, mongoose_1.model)('News', newsSchema);
exports.default = exports.News;
