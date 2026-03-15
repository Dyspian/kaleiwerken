"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface LeadPaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export const LeadPagination = ({ currentPage, totalPages, setCurrentPage }: LeadPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-12">
      <Button
        variant="outline"
        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="rounded-none border-brand-dark/10 hover:bg-brand-stone"
      >
        Vorige
      </Button>
      <span className="text-sm text-brand-dark/60">Pagina {currentPage} van {totalPages}</span>
      <Button
        variant="outline"
        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="rounded-none border-brand-dark/10 hover:bg-brand-stone"
      >
        Volgende
      </Button>
    </div>
  );
};