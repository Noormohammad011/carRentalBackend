import mongoose from 'mongoose'


const { Schema } = mongoose

const carSchema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    capacity: { type: Number, required: true },
    fuelType: { type: String, required: true },
    bookedTimeSlots: [
      {
        from: { type: String },
        to: { type: String },
      },
    ],

    rentPerHour: { type: Number, required: true },
  },
  { timestamps: true }
)



export default mongoose.model('Cars', carSchema)
