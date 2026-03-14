"use client";

import React from 'react';

/**
 * Use this component in your other React/Next.js project.
 * Replace the 'src' URL with your actual deployed URL.
 */
export const KaleiWebsiteEmbed = () => {
  return (
    <div style={{ 
      width: '100%', 
      height: '800px', 
      overflow: 'hidden', 
      borderRadius: '8px', 
      border: '1px solid #e5e7eb' 
    }}>
      <iframe
        src="https://your-deployed-kalei-site.com"
        style={{ 
          width: '100%', 
          height: '100%', 
          border: 'none' 
        }}
        title="Van Roey Kaleiwerken Preview"
        loading="lazy"
        allow="fullscreen"
      />
    </div>
  );
};

export default KaleiWebsiteEmbed;