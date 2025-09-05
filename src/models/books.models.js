import mongoose from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subImages: {
      type: [
        {
          url: String,
          localPath: String,
        },
      ],
      default: [],
    },
    mainImage: {
      type: String,
      required: true,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    owner: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
)

bookSchema.plugin(mongooseAggregatePaginate)

const Book = mongoose.model("Book", bookSchema)

export default Book
