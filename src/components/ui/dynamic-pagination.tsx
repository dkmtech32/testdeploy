import React, { useState, useEffect } from 'react';

interface DynamicPaginationProps {
  onItemsPerPageChange: (itemsPerPage: number) => void;
  headerHeight: number;
  rowHeight: number;
  footerHeight: number;
}

const DynamicPagination: React.FC<DynamicPaginationProps> = ({
  onItemsPerPageChange,
  headerHeight,
  rowHeight,
  footerHeight,
}) => {
  useEffect(() => {
    const handleResize = () => {
      const screenHeight = window.innerHeight;
      const availableHeight = screenHeight - headerHeight - footerHeight;
      const calculatedItemsPerPage = Math.max(1, Math.floor(availableHeight / rowHeight));
      onItemsPerPageChange(calculatedItemsPerPage);
    };

    // Initial calculation
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [onItemsPerPageChange, headerHeight, rowHeight, footerHeight]);

  return null; // This component doesn't render anything
};

export default DynamicPagination;