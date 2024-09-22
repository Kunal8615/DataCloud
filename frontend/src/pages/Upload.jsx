import React, { useState } from 'react';
import { API_URL } from '../constant';
import bgupload from "../images/bgupload.jpg";

const UploadForm = () => {
  const [title, setTitle] = useState('');
  const [dataFile, setDataFile] = useState(null);
  const [show, setShow] = useState('Upload here');

  const handleFileChange = (e) => {
    setDataFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('dataFile', dataFile);
    setShow(<p className='text-green-500'>Uploading...</p>);

    try {
      const response = await fetch(`${API_URL}/data/upload`, {
        method: 'POST',
        body: formData,
        credentials: "include"
      });

      if (response.ok) {
        console.log('File uploaded successfully');
        setShow('File uploaded successfully');
      } else {
        console.error('Failed to upload file');
        setShow('Failed to upload file');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      setShow('Error occurred');
    }
  };

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
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Upload File
        </h2>

        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200"
            placeholder="Enter file title"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="dataFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            File
          </label>
          <input
            type="file"
            id="dataFile"
            onChange={handleFileChange}
            required
            className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:placeholder-gray-400"
          />
        </div>

        <div className="text-lg text-center p-2 text-gray-600 dark:text-gray-300">
          {show}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
