export interface UploadedFileDto {
  fleekHash: string;
  hash: string;
  url: string;
}

export interface ContentModeration {
  Classification: ContentClassification; //Content Moderation output
  OriginalText: string; //Input text
  Terms: ContentTerm[]; //List of offending terms
}

export interface ContentClassification {
  ReviewRecommended: boolean;
  SexuallyExplicitRating: ContentCategoryScore;
  SexuallySuggestiveRating: ContentCategoryScore;
  OffensiveRating: ContentCategoryScore;
}

export interface ContentCategoryScore {
  Score: number;
}

export interface ContentTerm {
  Index: number;
  OriginalIndex: number;
  ListId: number;
  Term: string; //Offending Phrase
}
