import z from "zod";

export const coverKeyTypeSchema = z.enum([
	"isbn",
	"oclc",
	"lccn",
	"olid",
	"id",
]);
export type CoverKeyType = z.infer<typeof coverKeyTypeSchema>;

export const coverSizeSchema = z.enum(["S", "M", "L"]);
export type CoverSize = z.infer<typeof coverSizeSchema>;

export const coverResourceSchema = z.enum(["b", "a"]);
export type CoverResource = z.infer<typeof coverResourceSchema>;
