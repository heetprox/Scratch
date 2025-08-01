import React from 'react';
import Link from 'next/link';
import { getAllScratchCards } from '../services/scratchCardService';

async function HomePage() {
  const profiles = await getAllScratchCards();

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Scratch Card Profiles</h1>
        <p className="text-xl text-gray-600">Support your favorite creators with crypto payments</p>
        <div className="mt-6">
          <Link 
            href="/create-profile" 
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 inline-block"
          >
            Create Your Profile
          </Link>
        </div>
      </div>

      {profiles.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">No profiles yet</h2>
          <p className="text-gray-600 mb-4">Be the first to create a profile!</p>
          <Link 
            href="/create-profile" 
            className="text-blue-600 hover:text-blue-800"
          >
            Create Profile
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <Link 
              key={profile.id} 
              href={`/profile/${profile.username}`}
              className="block hover:shadow-lg transition-shadow duration-300"
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                  <img 
                    src={profile.image} 
                    alt={profile.name}
                    className="w-20 h-20 rounded-full absolute -bottom-10 left-4 border-4 border-white object-cover"
                  />
                </div>
                <div className="pt-12 p-4">
                  <h3 className="text-xl font-bold">{profile.name}</h3>
                  <p className="text-gray-600 mb-2">@{profile.username}</p>
                  <p className="text-gray-700 line-clamp-2">{profile.description}</p>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {profile.payments?.length || 0} payments received
                    </span>
                    <span className="text-blue-600 text-sm font-medium">
                      View Profile →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
