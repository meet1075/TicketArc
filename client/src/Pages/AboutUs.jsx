import React from 'react';
import { Linkedin, Github, Mail } from 'lucide-react';

function AboutUs() {
  const developers = [
    {
      id: "DEV001",
      name: "Sarah Johnson",
      role: "Full Stack Developer",
      email: "sarah.johnson@ticketarc.com",
      linkedin: "https://linkedin.com/in/sarahjohnson",
      github: "https://github.com/sarahjohnson",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "DEV002",
      name: "Michael Chen",
      role: "Frontend Developer",
      email: "michael.chen@ticketarc.com",
      linkedin: "https://linkedin.com/in/michaelchen",
      github: "https://github.com/michaelchen",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "DEV003",
      name: "Emily Rodriguez",
      role: "Backend Developer",
      email: "emily.rodriguez@ticketarc.com",
      linkedin: "https://linkedin.com/in/emilyrodriguez",
      github: "https://github.com/emilyrodriguez",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "DEV004",
      name: "David Kim",
      role: "UI/UX Designer",
      email: "david.kim@ticketarc.com",
      linkedin: "https://linkedin.com/in/davidkim",
      github: "https://github.com/davidkim",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
  ];

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
              <div className="relative">
                <img 
                  src={dev.image} 
                  alt={dev.name} 
                  className="w-full h-64 object-cover"
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