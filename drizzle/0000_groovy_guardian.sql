CREATE TABLE "locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"type" text DEFAULT 'STORE' NOT NULL,
	"address" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"phone" text,
	"timezone" text DEFAULT 'Africa/Cairo' NOT NULL,
	"opening_hours" jsonb,
	"receipt_footer" text,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "uq_locations_organization_code" UNIQUE("organization_id","code"),
	CONSTRAINT "uq_locations_id_organization" UNIQUE("id","organization_id"),
	CONSTRAINT "chk_locations_type" CHECK ("locations"."type" in ('STORE', 'WAREHOUSE')),
	CONSTRAINT "chk_locations_status" CHECK ("locations"."status" in ('ACTIVE', 'INACTIVE', 'ARCHIVED'))
);
--> statement-breakpoint
CREATE TABLE "organization_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"tax_price_mode" text DEFAULT 'INCLUSIVE' NOT NULL,
	"allow_partial_payment" boolean DEFAULT false NOT NULL,
	"allow_negative_stock" boolean DEFAULT false NOT NULL,
	"max_cashier_discount_rate" numeric(9, 6) DEFAULT '0' NOT NULL,
	"cashier_refund_limit_minor" bigint DEFAULT 0 NOT NULL,
	"cash_difference_limit_minor" bigint DEFAULT 0 NOT NULL,
	"return_window_days" integer,
	"invoice_auto_issue" boolean DEFAULT false NOT NULL,
	"receipt_footer" text,
	"numbering_config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"rounding_policy" text DEFAULT 'HALF_UP_LINE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "uq_organization_settings_organization" UNIQUE("organization_id"),
	CONSTRAINT "chk_organization_settings_tax_price_mode" CHECK ("organization_settings"."tax_price_mode" in ('INCLUSIVE', 'EXCLUSIVE')),
	CONSTRAINT "chk_organization_settings_rounding_policy" CHECK ("organization_settings"."rounding_policy" in ('HALF_UP_LINE'))
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"legal_name" text,
	"tax_identifier" text,
	"currency" char(3) DEFAULT 'EGP' NOT NULL,
	"timezone" text DEFAULT 'Africa/Cairo' NOT NULL,
	"phone" text,
	"email" text,
	"address" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"logo_path" text,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "chk_organizations_status" CHECK ("organizations"."status" in ('ACTIVE', 'SUSPENDED', 'ARCHIVED'))
);
--> statement-breakpoint
CREATE TABLE "membership_roles" (
	"membership_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"assigned_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pk_membership_roles" PRIMARY KEY("membership_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "organization_memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"staff_profile_id" uuid NOT NULL,
	"employee_code" text NOT NULL,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "uq_memberships_org_staff" UNIQUE("organization_id","staff_profile_id"),
	CONSTRAINT "uq_memberships_org_employee_code" UNIQUE("organization_id","employee_code"),
	CONSTRAINT "uq_memberships_id_org" UNIQUE("id","organization_id"),
	CONSTRAINT "chk_memberships_status" CHECK ("organization_memberships"."status" in ('ACTIVE', 'INACTIVE', 'SUSPENDED'))
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"module" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "permissions_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"role_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pk_role_permissions" PRIMARY KEY("role_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"is_system" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "uq_roles_org_key" UNIQUE("organization_id","key"),
	CONSTRAINT "uq_roles_id_org" UNIQUE("id","organization_id"),
	CONSTRAINT "chk_roles_status" CHECK ("roles"."status" in ('ACTIVE', 'INACTIVE'))
);
--> statement-breakpoint
CREATE TABLE "staff_location_assignments" (
	"membership_id" uuid NOT NULL,
	"location_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pk_staff_location_assignments" PRIMARY KEY("membership_id","location_id")
);
--> statement-breakpoint
CREATE TABLE "staff_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"auth_user_id" uuid NOT NULL,
	"display_name" text NOT NULL,
	"email" text,
	"phone" text,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"last_active_at" timestamp with time zone,
	"avatar_path" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "staff_profiles_auth_user_id_unique" UNIQUE("auth_user_id"),
	CONSTRAINT "chk_staff_profiles_status" CHECK ("staff_profiles"."status" in ('ACTIVE', 'INACTIVE', 'SUSPENDED'))
);
--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "locations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_settings" ADD CONSTRAINT "organization_settings_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership_roles" ADD CONSTRAINT "fk_membership_roles_membership_org" FOREIGN KEY ("membership_id","organization_id") REFERENCES "public"."organization_memberships"("id","organization_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership_roles" ADD CONSTRAINT "fk_membership_roles_role_org" FOREIGN KEY ("role_id","organization_id") REFERENCES "public"."roles"("id","organization_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership_roles" ADD CONSTRAINT "fk_membership_roles_assigned_by" FOREIGN KEY ("assigned_by") REFERENCES "public"."organization_memberships"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_memberships" ADD CONSTRAINT "organization_memberships_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_memberships" ADD CONSTRAINT "organization_memberships_staff_profile_id_staff_profiles_id_fk" FOREIGN KEY ("staff_profile_id") REFERENCES "public"."staff_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_location_assignments" ADD CONSTRAINT "fk_staff_location_assignments_membership_org" FOREIGN KEY ("membership_id","organization_id") REFERENCES "public"."organization_memberships"("id","organization_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_location_assignments" ADD CONSTRAINT "fk_staff_location_assignments_location_org" FOREIGN KEY ("location_id","organization_id") REFERENCES "public"."locations"("id","organization_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_locations_organization" ON "locations" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_organization_settings_organization" ON "organization_settings" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_membership_roles_membership" ON "membership_roles" USING btree ("membership_id");--> statement-breakpoint
CREATE INDEX "idx_memberships_organization" ON "organization_memberships" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_memberships_staff" ON "organization_memberships" USING btree ("staff_profile_id");--> statement-breakpoint
CREATE INDEX "idx_permissions_key" ON "permissions" USING btree ("key");--> statement-breakpoint
CREATE INDEX "idx_role_permissions_role" ON "role_permissions" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "idx_roles_organization" ON "roles" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_staff_location_assignments_membership" ON "staff_location_assignments" USING btree ("membership_id");