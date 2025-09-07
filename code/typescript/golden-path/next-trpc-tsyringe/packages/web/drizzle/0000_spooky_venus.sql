CREATE TABLE "web_collection" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"url" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "web_post" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"collectionId" varchar(255) NOT NULL,
	"profileId" varchar(255),
	"shortcode" varchar(255),
	"description" text,
	"videoUrl" text,
	"thumbnailSrc" text,
	"displayUrl" text,
	"parsedAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "web_profile" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"displayName" varchar(255),
	"profileUrl" text,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "web_profile_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "web_post" ADD CONSTRAINT "web_post_collectionId_web_collection_id_fk" FOREIGN KEY ("collectionId") REFERENCES "public"."web_collection"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "web_post" ADD CONSTRAINT "web_post_profileId_web_profile_id_fk" FOREIGN KEY ("profileId") REFERENCES "public"."web_profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_idx" ON "web_collection" USING btree ("user");--> statement-breakpoint
CREATE INDEX "name_idx" ON "web_collection" USING btree ("name");--> statement-breakpoint
CREATE INDEX "collection_idx" ON "web_post" USING btree ("collectionId");--> statement-breakpoint
CREATE INDEX "profile_idx" ON "web_post" USING btree ("profileId");--> statement-breakpoint
CREATE INDEX "username_idx" ON "web_profile" USING btree ("username");