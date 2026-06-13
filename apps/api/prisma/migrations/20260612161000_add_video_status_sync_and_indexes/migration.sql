-- Add cached provider status metadata for video processing checks.
ALTER TABLE "Video" ADD COLUMN "statusSyncedAt" TIMESTAMP(3);

-- Content navigation and publish-state lookup indexes.
CREATE INDEX "Subject_classLevel_isPublished_sortOrder_idx" ON "Subject"("classLevel", "isPublished", "sortOrder");
CREATE INDEX "Chapter_subjectId_isPublished_sortOrder_idx" ON "Chapter"("subjectId", "isPublished", "sortOrder");
CREATE INDEX "Chapter_slug_isPublished_idx" ON "Chapter"("slug", "isPublished");
CREATE INDEX "Topic_chapterId_isPublished_sortOrder_idx" ON "Topic"("chapterId", "isPublished", "sortOrder");
CREATE INDEX "Lesson_topicId_publishStatus_sortOrder_idx" ON "Lesson"("topicId", "publishStatus", "sortOrder");
CREATE INDEX "Lesson_slug_publishStatus_idx" ON "Lesson"("slug", "publishStatus");

-- Video lookup, provider sync, and lesson playback indexes.
CREATE INDEX "Video_lessonId_provider_updatedAt_idx" ON "Video"("lessonId", "provider", "updatedAt");
CREATE INDEX "Video_processingStatus_statusSyncedAt_idx" ON "Video"("processingStatus", "statusSyncedAt");

-- Note, entitlement, and progress-event indexes for upcoming learning features.
CREATE INDEX "Note_lessonId_createdAt_idx" ON "Note"("lessonId", "createdAt");
CREATE INDEX "Subscription_userId_status_idx" ON "Subscription"("userId", "status");
CREATE INDEX "Subscription_provider_providerCustomerId_idx" ON "Subscription"("provider", "providerCustomerId");
CREATE INDEX "Subscription_provider_providerSubscriptionId_idx" ON "Subscription"("provider", "providerSubscriptionId");
CREATE INDEX "ProgressEvent_userId_receivedAt_idx" ON "ProgressEvent"("userId", "receivedAt");
CREATE INDEX "ProgressEvent_userId_lessonId_eventType_receivedAt_idx" ON "ProgressEvent"("userId", "lessonId", "eventType", "receivedAt");
CREATE INDEX "ProgressEvent_lessonId_eventType_receivedAt_idx" ON "ProgressEvent"("lessonId", "eventType", "receivedAt");
