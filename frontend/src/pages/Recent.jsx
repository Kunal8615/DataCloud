import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../constant';

const Recent = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from API with credentials
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/data/GetRecentData`, {
          withCredentials: true,  // Include credentials (like cookies or auth tokens)
        });
        setFiles(response.data.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching files');
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleDownload = (fileUrl) => {
    const link = document.createElement('a'); 
    link.href = fileUrl;  
    link.setAttribute('download', '');  
    document.body.appendChild(link);  
    link.click();  
    link.remove();  
  };

 
  const getFilePreview = (fileUrl) => {
    if (fileUrl.endsWith('.docx') || fileUrl.endsWith('.doc')) {
  
      return `https://docs.google.com/gview?url=${fileUrl}&embedded=true`;
    } else if (fileUrl.endsWith('.pdf')) {
   
      return fileUrl;
    } else if (fileUrl.endsWith('.jpg') || fileUrl.endsWith('.png') || fileUrl.endsWith('.jpeg')) {
      
      return fileUrl;
    } else {
      return `${fileUrl}`;
    }
  };

  if (loading) {
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold text-center mb-8">Recent Files</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {files.map((file) => (
          <div 
            key={file._id} 
            className="bg-white shadow-md rounded-lg p-6 text-center cursor-pointer"
            onClick={() => window.open(file.dataFile, '_blank')} // Open file in new tab
          >
            {/* Preview of the file */}
            {file.dataFile.endsWith('.docx') || file.dataFile.endsWith('.doc') || file.dataFile.endsWith('.pdf') ? (
              <iframe 
                src={getFilePreview(file.dataFile)} 
                title={file.title} 
                className="w-full h-40 object-cover mb-4 rounded-md" 
              
              ></iframe>
            ) : (
              <img 
                src={getFilePreview(file.dataFile)} 
                alt="File preview" 
                className="w-full h-40 object-cover mb-4 rounded-md" 
              />
            )}

            <div className="text-lg font-semibold mb-2">{file.title}</div>

            {/* Programmatic Download Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();  // Prevent card click (which opens file in new tab)
                handleDownload(file.dataFile);  // Call the download function
              }} 
              className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 mt-4"
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recent;
