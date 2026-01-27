import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Vendors table
export const vendors = pgTable("vendors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  totalSpend: decimal("total_spend", { precision: 15, scale: 2 }).notNull().default("0"),
  duplicateCount: integer("duplicate_count").notNull().default(0),
  paymentTerms: text("payment_terms"),
  riskLevel: text("risk_level").notNull().default("low"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertVendorSchema = createInsertSchema(vendors).omit({
  id: true,
  createdAt: true,
});

export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type Vendor = typeof vendors.$inferSelect;

// Cases table
export const cases = pgTable("cases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  caseNumber: text("case_number").notNull().unique(),
  status: text("status").notNull().default("open"),
  priority: text("priority").notNull().default("medium"),
  assignedTo: varchar("assigned_to").references(() => users.id),
  totalAmount: decimal("total_amount", { precision: 15, scale: 2 }).notNull(),
  potentialSavings: decimal("potential_savings", { precision: 15, scale: 2 }).notNull(),
  riskScore: integer("risk_score").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const casesRelations = relations(cases, ({ one, many }) => ({
  assignedUser: one(users, {
    fields: [cases.assignedTo],
    references: [users.id],
  }),
  invoices: many(invoices),
  activities: many(caseActivities),
}));

export const insertCaseSchema = createInsertSchema(cases).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCase = z.infer<typeof insertCaseSchema>;
export type Case = typeof cases.$inferSelect;

// Invoices table
export const invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  caseId: varchar("case_id").references(() => cases.id),
  invoiceNumber: text("invoice_number").notNull(),
  vendorId: varchar("vendor_id").notNull().references(() => vendors.id),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  invoiceDate: timestamp("invoice_date").notNull(),
  docId: text("doc_id"),
  status: text("status").notNull().default("pending"),
  similarityScore: integer("similarity_score"),
  isDuplicate: boolean("is_duplicate").notNull().default(false),
  matchedInvoiceId: varchar("matched_invoice_id"),
  signals: text("signals").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  case: one(cases, {
    fields: [invoices.caseId],
    references: [cases.id],
  }),
  vendor: one(vendors, {
    fields: [invoices.vendorId],
    references: [vendors.id],
  }),
  recoveryItems: many(recoveryItems),
}));

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
});

export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;

// Recovery Items table
export const recoveryItems = pgTable("recovery_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  invoiceId: varchar("invoice_id").references(() => invoices.id),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  status: text("status").notNull().default("initiated"),
  vendorId: varchar("vendor_id").references(() => vendors.id),
  assignedAnalyst: varchar("assigned_analyst").references(() => users.id),
  recoveryMethod: text("recovery_method").notNull(),
  notes: text("notes"),
  initiatedDate: timestamp("initiated_date").notNull().defaultNow(),
  resolvedDate: timestamp("resolved_date"),
});

export const recoveryItemsRelations = relations(recoveryItems, ({ one }) => ({
  invoice: one(invoices, {
    fields: [recoveryItems.invoiceId],
    references: [invoices.id],
  }),
  vendor: one(vendors, {
    fields: [recoveryItems.vendorId],
    references: [vendors.id],
  }),
  analyst: one(users, {
    fields: [recoveryItems.assignedAnalyst],
    references: [users.id],
  }),
}));

export const insertRecoveryItemSchema = createInsertSchema(recoveryItems).omit({
  id: true,
  initiatedDate: true,
});

export type InsertRecoveryItem = z.infer<typeof insertRecoveryItemSchema>;
export type RecoveryItem = typeof recoveryItems.$inferSelect;

// Case Activities table
export const caseActivities = pgTable("case_activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  caseId: varchar("case_id").notNull().references(() => cases.id),
  userId: varchar("user_id").references(() => users.id),
  action: text("action").notNull(),
  notes: text("notes"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const caseActivitiesRelations = relations(caseActivities, ({ one }) => ({
  case: one(cases, {
    fields: [caseActivities.caseId],
    references: [cases.id],
  }),
  user: one(users, {
    fields: [caseActivities.userId],
    references: [users.id],
  }),
}));

export const insertCaseActivitySchema = createInsertSchema(caseActivities).omit({
  id: true,
  timestamp: true,
});

export type InsertCaseActivity = z.infer<typeof insertCaseActivitySchema>;
export type CaseActivity = typeof caseActivities.$inferSelect;

// Relations for users
export const usersRelations = relations(users, ({ many }) => ({
  assignedCases: many(cases),
  recoveryItems: many(recoveryItems),
  activities: many(caseActivities),
}));

// Relations for vendors
export const vendorsRelations = relations(vendors, ({ many }) => ({
  invoices: many(invoices),
  recoveryItems: many(recoveryItems),
}));

// DPPS Configuration table
export const dppsConfig = pgTable("dpps_config", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  criticalThreshold: integer("critical_threshold").notNull().default(85),
  highThreshold: integer("high_threshold").notNull().default(70),
  mediumThreshold: integer("medium_threshold").notNull().default(50),
  invoicePatternTrigger: integer("invoice_pattern_trigger").notNull().default(80),
  dateProximityDays: integer("date_proximity_days").notNull().default(7),
  fuzzyAmountTolerance: decimal("fuzzy_amount_tolerance", { precision: 5, scale: 3 }).notNull().default("0.005"),
  legalEntityScope: text("legal_entity_scope").notNull().default("within"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertDppsConfigSchema = createInsertSchema(dppsConfig).omit({
  id: true,
  updatedAt: true,
});

export type InsertDppsConfig = z.infer<typeof insertDppsConfigSchema>;
export type DppsConfig = typeof dppsConfig.$inferSelect;

// Recovery Activities table (for tracking recovery workflow)
export const recoveryActivities = pgTable("recovery_activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  recoveryItemId: varchar("recovery_item_id").notNull().references(() => recoveryItems.id),
  userId: varchar("user_id").references(() => users.id),
  action: text("action").notNull(),
  notes: text("notes"),
  evidenceType: text("evidence_type"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const recoveryActivitiesRelations = relations(recoveryActivities, ({ one }) => ({
  recoveryItem: one(recoveryItems, {
    fields: [recoveryActivities.recoveryItemId],
    references: [recoveryItems.id],
  }),
  user: one(users, {
    fields: [recoveryActivities.userId],
    references: [users.id],
  }),
}));

export const insertRecoveryActivitySchema = createInsertSchema(recoveryActivities).omit({
  id: true,
  timestamp: true,
});

export type InsertRecoveryActivity = z.infer<typeof insertRecoveryActivitySchema>;
export type RecoveryActivity = typeof recoveryActivities.$inferSelect;

