// about.test.tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import AboutPage from './page';

// Mock untuk Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // Menggunakan img biasa untuk testing
    return <img {...props} />;
  },
}));

// Mock untuk gambar
jest.mock('../assets/about/events1.png', () => 'test-image-1.png');
jest.mock('../assets/about/events2.png', () => 'test-image-2.png');

describe('AboutPage', () => {
  beforeEach(() => {
    render(<AboutPage />);
  });

  it('menampilkan judul utama "About Us"', () => {
    const heading = screen.getByRole('heading', { 
      name: /about us/i,
      level: 1
    });
    expect(heading).toBeInTheDocument();
  });

  it('menampilkan semua section utama', () => {
    expect(screen.getByText(/our story/i)).toBeInTheDocument();
    expect(screen.getByText(/our vision/i)).toBeInTheDocument();
    expect(screen.getByText(/our mission/i)).toBeInTheDocument();
    expect(screen.getByText(/the company/i)).toBeInTheDocument();
  });

  it('menampilkan konten teks untuk OUR STORY', () => {
    const storyText = screen.getByText(/isoneday adalah nama yang gue pilih/i);
    expect(storyText).toBeInTheDocument();
    expect(storyText).toHaveClass('text-gray-300');
  });

  it('menampilkan list OUR MISSION dengan lengkap', () => {
    const missionItems = screen.getAllByRole('listitem');
    expect(missionItems).toHaveLength(3);
    
    expect(screen.getByText(/mempertahankan kualitas/i)).toBeInTheDocument();
    expect(screen.getByText(/menyampaikan kreativitas/i)).toBeInTheDocument();
    expect(screen.getByText(/menghadirkan seni dan kain/i)).toBeInTheDocument();
  });

  it('menampilkan gambar kedua di section THE COMPANY', () => {
    const companyImage = screen.getByAltText('About2');
    expect(companyImage).toBeInTheDocument();
    expect(companyImage).toHaveAttribute('src', 'test-image-2.png');
  });

});