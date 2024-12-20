import React, { useEffect, useState } from 'react';
import axios from 'axios';
import bgupload from "../images/bgupload.jpg";
import { API_URL } from '../constant';

const File = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from API with credentials
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/data/getuserData`, {
          withCredentials: true,  
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

  const handleDelete = async (fileId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this file?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/data/Deletefile/${fileId}`, {
        withCredentials: true,  // Include credentials (like cookies or auth tokens)
      });
      setFiles(files.filter(file => file._id !== fileId)); // Remove file from the list
    } catch (error) {
      setError('Error deleting file');
    }
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
    return <div className="text-center text-lg font-semibold text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen" style={{ 
      backgroundImage: `url(${bgupload})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'repeat',
      width: '100%',
      height: '100%',
      padding: "20px" 
    }}>
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-200">Files</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {files.map((file) => (
          <div 
            key={file._id} 
            className="bg-gray-800 border-gray-700 border-4 shadow-md rounded-lg p-6 text-center cursor-pointer hover:bg-gray-700 transition duration-300"
            onClick={() => window.open(file.dataFile, '_blank')} // Open file in new tab
          >
            {/* Preview of the file */}
            {file.dataFile.endsWith('.docx') || file.dataFile.endsWith('.doc') || file.dataFile.endsWith('.pdf') ? (
              <iframe 
                src={getFilePreview(file.dataFile)} 
                title={file.title} 
                className="w-full h-40 object-cover mb-4 rounded-md" 
                frameBorder="0"
              ></iframe>
            ) : (
              <img 
                src={getFilePreview(file.dataFile)} 
                alt="File preview" 
                className="w-full border-2 border-white h-40 object-cover mb-4 rounded-md" 
              />
            )}

            <div className="text-lg font-semibold mb-2 text-gray-200">{file.title}</div>

            <div className="flex justify-between mt-4">
              {/* Download Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();  // Prevent card click (which opens file in new tab)
                  handleDownload(file.dataFile);  // Call the download function
                }} 
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
              >
                Download
              </button>

              {/* Delete Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();  // Prevent card click
                  handleDelete(file._id);  // Call the delete function
                }} 
                className="inline-block px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default File;
