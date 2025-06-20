import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import ContactForm from '../components/ContactForm';

async function getData() {
  const jsonDirectory = path.join(process.cwd(), 'public/data');
  const fileContents = await fs.readFile(jsonDirectory + '/data.json', 'utf8');
  return JSON.parse(fileContents);
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-indigo-600">Project</h1>
              </div>
              {/* Navigation removed since only Contact is needed */}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <ContactForm />
      </main>
    </div>
  );
}
