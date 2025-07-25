export interface ContentFormatter {
  entityType: string;
  generateDisplayText(entity: any): string;
  generateContent(entity: any): string;
}