// __mocks__/lucide-react.js
const React = require('react');

const MockIcon = ({ className }) => <span className={className} data-testid="mock-icon" />;

module.exports = {
  Menu: MockIcon,
  ShoppingCart: MockIcon,
  User: MockIcon,
  ShoppingBag: MockIcon,
  MessageCircle: MockIcon,
  ArrowLeft: MockIcon,
  // Tambahkan semua ikon yang digunakan di header.tsx
};