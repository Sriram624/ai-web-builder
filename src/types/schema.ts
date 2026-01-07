export type ComponentType = 'Navbar' | 'Hero' | 'Features' | 'Testimonials' | 'Contact' | 'Footer';
export interface Section {
  id: string;
  type: ComponentType;
  content: {
    title?: string;
    subtitle?: string;
    primaryAction?: string;
    items?: Array<{ title: string; description: string }>;
  };
  styles: {
    backgroundColor: string;
    textColor: string;
  };
}
export interface WebsiteSchema {
  theme: 'light' | 'dark';
  sections: Section[];
}