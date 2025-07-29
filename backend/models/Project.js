const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a project title"],
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Please provide a project description"],
      maxlength: 500,
    },
    category: {
      type: String,
      required: true,
      enum: ["web", "mobile", "desktop", "ai", "other"],
    },
    technologies: [
      {
        type: String,
        required: true,
      },
    ],
    status: {
      type: String,
      enum: ["planning", "in-progress", "completed", "on-hold"],
      default: "planning",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaborators: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["viewer", "contributor", "admin"],
          default: "viewer",
        },
      },
    ],
    tasks: [
      {
        title: String,
        description: String,
        completed: { type: Boolean, default: false },
        assignedTo: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        dueDate: Date,
      },
    ],
    githubUrl: String,
    liveUrl: String,
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);
