import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://xpxtggnmilvnugzgxrit.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhweHRnZ25taWx2bnVnemd4cml0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1NTg3NTAsImV4cCI6MjA3MzEzNDc1MH0.EyvcWsXuRiNU5LggAEghbMj9K5DWMEEgXhp5x91aV4Q";

// Create Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for form data
export interface DueDiligenceFormData {
  fullName: string;
  email: string;
  phone?: string;
  country: string;
  investmentSize: string;
}

export interface NewsletterFormData {
  email: string;
}

export interface FacilityTourFormData {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
}

// Form submission functions
export async function submitDueDiligenceForm(data: DueDiligenceFormData) {
  const { data: result, error } = await supabase.functions.invoke('submit-due-diligence-form', {
    body: data,
  });

  if (error) {
    console.error('Due diligence form submission error:', error);
    throw error;
  }

  return result;
}

export async function submitNewsletterForm(data: NewsletterFormData) {
  const { data: result, error } = await supabase.functions.invoke('submit-newsletter-form', {
    body: data,
  });

  if (error) {
    console.error('Newsletter form submission error:', error);
    throw error;
  }

  return result;
}

export async function submitFacilityTourForm(data: FacilityTourFormData) {
  const { data: result, error } = await supabase.functions.invoke('submit-facility-tour-form', {
    body: data,
  });

  if (error) {
    console.error('Facility tour form submission error:', error);
    throw error;
  }

  return result;
}
