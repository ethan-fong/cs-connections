import React, { useState, useEffect } from "react";
import { GraduationCap } from "lucide-react";
import HomepageModal from "../modals/HomepageModal"; // Assuming you already have this component

const API_BASE_URL = process.env.NODE_ENV === 'development' ? "http://localhost:8080/" : "https://cs-connections.app/backend/";

function ResponsiveHeader() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Check screen size on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) { // Define small screen threshold
        setIsSmallScreen(true);
      } else {
        setIsSmallScreen(false);
      }
    };

    // Initial screen size check
    handleResize();

    // Add event listener for resize
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);
    
const handleInstructorClick = async () => {
  try {
    const csrfToken = document.cookie
      .split(';')
      .find(cookie => cookie.trim().startsWith('csrftoken='))
      ?.split('=')[1];

    const response = await fetch(`${API_BASE_URL}check_authenticated/`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'X-CSRFToken': csrfToken,
      },
    });

    const data = await response.json();

    if (response.ok && data.authenticated) {
      window.location.href = `${window.location.origin}/instructor/`;
    } else {
      // Clear the sessionid cookie by setting it to expire
      window.location.href = `${API_BASE_URL}accounts/login`;
    }
  } catch (error) {
    console.error('Error checking authentication', error);
    window.location.href = `${API_BASE_URL}accounts/login`;
  }
};

  return (
    <div className="container mx-auto p-6">
      {/* Header Section */}
      <div className="flex flex-col mb-6">
        {/* Desktop Layout: Modal on the left, Heading centered, Graduation Cap icon on the right */}
        {!isSmallScreen ? (
          <div className="flex items-center justify-between w-full mb-4">
            {/* Modal on the left side */}
            <div className="flex items-center space-x-6">
              <HomepageModal />
            </div>
            
            {/* Heading centered in the middle */}
            <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight leading-tight flex-grow text-center">
              CS Connections
            </h1>
            
            {/* Graduation Cap Icon on the right */}
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <GraduationCap
                  className="h-12 w-12 text-blue-600 cursor-pointer hover:text-blue-700 transition-all duration-200"
                  onClick={handleInstructorClick}
                />
                <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-40 bg-gray-800 text-white text-sm rounded-md py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 text-center">
                  Instructor Login
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Mobile Layout: Heading with icons stacked in a new row
          <div className="flex flex-col items-center w-full mb-4">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
              CS Connections
            </h1>
            <div className="flex flex-row space-x-4 mt-4">
              
              {/* Info Icon Modal */}
              <HomepageModal />
              {/* Graduation Cap Icon with Tooltip */}
              <div className="relative group">
                <GraduationCap
                  className="h-12 w-12 text-blue-600 cursor-pointer hover:text-blue-700 transition-all duration-200"
                  onClick={handleInstructorClick}
                />
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-32 bg-gray-800 text-white text-sm rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 text-center">
                  Instructor Login
                </div>
              </div>
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResponsiveHeader;
