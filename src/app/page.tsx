import { redirect } from 'next/navigation';

export default function Home() {
  // Redirige automáticamente a la vista de feed
  redirect('/feed');
}