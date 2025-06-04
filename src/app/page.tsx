import { promises as fs } from 'fs';
import path from 'path';
import StoreLocator from '../components/StoreLocator';
import Link from 'next/link';

async function getData() {
  const jsonDirectory = path.join(process.cwd(), 'public/data');
  const fileContents = await fs.readFile(jsonDirectory + '/data.json', 'utf8');
  return JSON.parse(fileContents);
}

export default async function Home() {
  const data = await getData();

  return (
    <div className="min-h-screen">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-indigo-600">Store Locator</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link 
                  href="/"
                  className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Stores
                </Link>
                <Link
                  href="/contact"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <StoreLocator initialData={data} />
      </main>
    </div>
  );
}
