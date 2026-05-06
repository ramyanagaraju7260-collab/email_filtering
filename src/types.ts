export type Category = 'Spam' | 'Important' | 'Promotions' | 'Social' | 'Updates';

export interface Email {
  id: string;
  sender: string;
  to_address: string;
  subject: string;
  body: string;
  date: string;
  category: Category;
  status: 'read' | 'unread';
  is_starred: boolean | number; // SQLite returns 0/1
  sentiment: 'positive' | 'negative' | 'neutral';
  tags: string; // JSON string in DB
  summary?: string;
}

export interface Filter {
  id: string;
  name: string;
  sender_pattern?: string;
  keyword_pattern?: string;
  target_category: Category;
}
