const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roundSchema = new Schema({
  name: {
    type: String,
    required: true,
    // Ví dụ: "Vòng bảng", "Tứ kết", "Bán kết", "Chung kết"
  },
  roundNumber: {
    type: Number,
    required: true,
    // Số thứ tự của vòng, dùng để sắp xếp theo tiến trình (1, 2, 3, ...)
  },
  tournament: {
    type: Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true,
    // Vòng đấu này thuộc về giải đấu nào
  },
  matches: [{
    type: Schema.Types.ObjectId,
    ref: 'Match',
    // Danh sách các trận đấu trong vòng này
  }],
  isCompleted: {
    type: Boolean,
    default: false,
    // Đánh dấu vòng đấu đã hoàn tất hay chưa
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Round', roundSchema);
