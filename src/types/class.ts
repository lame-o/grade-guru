export interface Class {
  id: string;
  name: string;
  syllabusName: string;
  uploadDate: string;
  lastAccessed?: string;
  pdfUrl?: string;
  isCommitted: boolean;
  additionalContent?: AdditionalContent[];
}

export interface AdditionalContent {
  id: string;
  name: string;
  uploadDate: string;
  pdfUrl: string;
  isCommitted: boolean;
}

export interface PDFSection {
  heading?: string;
  body: string;
  annotations?: string[];
  visual_elements?: string[];
  key_terms?: string[];
}

export interface PDFContent {
  document_type: 'syllabus' | 'lecture' | 'homework' | 'study_guide' | 'notes';
  metadata: {
    course_name?: string;
    professor?: string;
    lecture_number?: number;
    dates?: string[];
    [key: string]: any;
  };
  content: {
    sections: PDFSection[];
  };
  action_items: {
    assignments?: { name: string; due_date: string; }[];
    exams?: { type: string; date: string; }[];
  };
}