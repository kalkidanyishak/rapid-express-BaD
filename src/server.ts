import express from "express";

import cors from "cors";
import endpoint from "./utils/endpoint";
import { errorHandler } from "./middleware/error-handler";
import relationalEndpoint from "./utils/relational-endpoint";

const app = express();
const PORT =process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    credentials: true,
  })
);

app.use(endpoint("/api/user", "user"));
app.use(endpoint("/api/core-team-member", "coreTeamMember"));
app.use(endpoint("/api/lesson", "lesson"));
app.use(endpoint("/api/enrollment", "enrollment"));
app.use(endpoint("/api/badge", "badge"));
app.use(endpoint("/api/user-award", "userAward"));
app.use(endpoint("/api/proposal", "proposal"));
app.use(endpoint("/api/vote", "vote"));
app.use(endpoint("/api/comment", "comment"));
app.use(endpoint("/api/event", "event"));
app.use(endpoint("/api/ticket", "ticket"));
app.use(endpoint("/api/nft", "nFT"));
app.use(endpoint("/api/holder", "holder"));
app.use(endpoint("/api/progress", "progress"));
app.use(endpoint("/api/completion", "completion"));

app.use(relationalEndpoint("/api/badge", "badgeId", "/lesson", "lesson"));
app.use(relationalEndpoint("/api/badge", "badgeId", "/user-award", "userAward"));

app.use(relationalEndpoint("/api/user", "userId", "/enrollment", "enrollment"));
app.use(relationalEndpoint("/api/user", "userId", "/completion", "completion"));
app.use(relationalEndpoint("/api/user", "userId", "/proposal", "proposal"));
app.use(relationalEndpoint("/api/user", "userId", "/vote", "vote"));
app.use(relationalEndpoint("/api/user", "userId", "/comment", "comment"));
app.use(relationalEndpoint("/api/user", "userId", "/event", "event"));
app.use(relationalEndpoint("/api/user", "userId", "/ticket", "ticket"));
app.use(relationalEndpoint("/api/user", "userId", "/holder", "holder"));
app.use(relationalEndpoint("/api/user", "userId", "/progress", "progress"));
app.use(relationalEndpoint("/api/user", "userId", "/user-award", "userAward"));

app.use(relationalEndpoint("/api/lesson", "lessonId", "/enrollment", "enrollment"));
app.use(relationalEndpoint("/api/lesson", "lessonId", "/completion", "completion"));

app.use(relationalEndpoint("/api/proposal", "proposalId", "/vote", "vote"));
app.use(relationalEndpoint("/api/proposal", "proposalId", "/comment", "comment"));

app.use(relationalEndpoint("/api/event", "eventId", "/ticket", "ticket"));

app.use(relationalEndpoint("/api/nft", "nftId", "/holder", "holder"));
app.use(relationalEndpoint("/api/nft", "nftId", "/progress", "progress"));

// Central error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
