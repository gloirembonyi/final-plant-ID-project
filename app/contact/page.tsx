
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Navigation from '@/components/Navigation';;

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement form submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B4332] to-[#081C15] text-white">
      <section className="relative h-screen flex items-center justify-center">
        <Image
              src="/contact-plant.jpg"
              alt="Beautiful plant"
              layout="fill"
              objectFit="cover"
              className="absolute z-0"
            />
        {/* <div><Navigation /></div> */}
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl font-thin text-center mb-8 text-black">Contact Us</h1>
          <div className="max-w-lg mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2 text-black">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-[#081C15] border border-[#52B788]"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-black">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-[#081C15] border border-[#52B788]"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block mb-2 text-black">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-2 rounded-lg bg-[#081C15] border border-[#52B788]"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-[#52B788] text-white px-6 py-3 rounded-lg hover:bg-[#3E8E69] transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}