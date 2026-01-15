import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema({
  taskId: { type: String, required: false }, // optional, can link to a task
  username: { type: String, required: true },
  action: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
});

export default mongoose.models.History || mongoose.model("History", HistorySchema);
