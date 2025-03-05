import React from 'react';
import { Linkedin, Github, Mail } from 'lucide-react';

import MeetImg from '../assets/image/team/Meet.jpg';
import TirthImg from '../assets/image/team/tirth.jpg';
import ShubhamImg from '../assets/image/team/Shubham.jpg';
import ShreyanImg from '../assets/image/team/Shreyan.jpg';

const developers = [
  { 
    id: "23dce115",
    name: "Meet Soni",
    role: "Backend Developer",
    email: "23dce115@charusat.edu.in",
    linkedin: "",
    github: "",
    image: MeetImg
  },
  {
    id: "23dce116",
    name: "Tirth Sorathia",
    role: "Frontend Developer",
    email: "23dce116@charusat.edu.in",
    linkedin: "",
    github: "",
    image: TirthImg
  },
  {
    id: "23dce119",
    name: "Shubham Tandel",
    role: "UI/UX Designer/Researcher",
    email: "23dce119@charusat.edu.in",
    linkedin: "",
    github: "",
    image: ShubhamImg
  },
  {
    id: "23dce125",
    name: "Shreyan Varsani",
    role: "Frontend/Documentation",
    email: "23dce125@charusat.edu.in",
    linkedin: "",
    github: "",
    image: ShreyanImg
  }
];

function AboutUs() {
  return (
    <div className="pt-16">
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4">Meet Our Team</h1>
          <p className="text-gray-100 text-center max-w-2xl mx-auto">
            We're a passionate team of developers and designers dedicated to bringing you the best movie booking experience.
            Our diverse skills and commitment to excellence ensure that TicketArc remains at the forefront of innovation.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {developers.map((dev) => (
            <div key={dev.id} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
              <div className="relative w-full h-72">
                <img 
                  src={dev.image} 
                  alt={dev.name} 
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-xl font-semibold text-white">{dev.name}</h3>
                  <p className="text-gray-200">{dev.role}</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-2">ID: {dev.id}</p>
                <div className="flex items-center space-x-2 text-gray-600 mb-2">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${dev.email}`} className="hover:text-red-600 transition-colors">
                    {dev.email}
                  </a>
                </div>
                <div className="flex justify-center space-x-4 mt-4">
                  <a 
                    href={dev.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-700 transition-colors p-2 rounded-full hover:bg-blue-50"
                  >
                    <Linkedin className="w-6 h-6" />
                  </a>
                  <a 
                    href={dev.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-700 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-50"
                  >
                    <Github className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gray-50 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-6">Our Mission</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto">
            At TicketArc, we're committed to revolutionizing the movie ticket booking experience. 
            Our platform combines cutting-edge technology with user-friendly design to make booking 
            your next movie adventure as seamless as possible. We believe in creating moments of joy, 
            one ticket at a time.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
