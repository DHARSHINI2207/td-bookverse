-- Add comments attached to reviews
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "review_id" TEXT NOT NULL,
    "commenter_name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "comments_review_id_idx" ON "comments"("review_id");

ALTER TABLE "comments" ADD CONSTRAINT "comments_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;
