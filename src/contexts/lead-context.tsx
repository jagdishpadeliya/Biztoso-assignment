"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { generateId } from "@/lib/utils";
import { LeadType } from "@/lib/types";

type LeadsContextType = {
  leads: LeadType[];
  claimLead: (id: string, status: LeadType["status"]) => void;
  updateLead: (id: string, lead: Partial<LeadType>) => void;
  getLeadById: (id: string) => LeadType | undefined;
  loading: boolean;
};

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

export function LeadsProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<LeadType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));

        const savedLeads = localStorage.getItem("biztoso_leads");
        if (savedLeads) {
          setLeads(JSON.parse(savedLeads));
        } else {
          // Generate sample leads if none exist
          const sampleLeads: LeadType[] = Array.from({ length: 10 }, (_, i) => {
            const industries = [
              "Technology",
              "Healthcare",
              "Finance",
              "Education",
              "Retail",
              "Manufacturing",
            ];
            const statuses: LeadType["status"][] = [
              "new",
              "contacted",
              "qualified",
              "proposal",
              "closed",
              "lost",
            ];

            return {
              id: generateId(),
              businessName: `Business ${i + 1}`,
              contactName: `Contact ${i + 1}`,
              email: `contact${i + 1}@example.com`,
              phone: `555-${100 + i}`,
              industry:
                industries[Math.floor(Math.random() * industries.length)],
              status: statuses[Math.floor(Math.random() * 3)],
              notes: i % 3 === 0 ? `Sample notes for lead ${i + 1}` : undefined,
              createdAt: new Date(
                Date.now() -
                  Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
              ).toISOString(),
              updatedAt: new Date(
                Date.now() -
                  Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000
              ).toISOString(),
            };
          });

          setLeads(sampleLeads);
          localStorage.setItem("biztoso_leads", JSON.stringify(sampleLeads));
        }
      } catch (error) {
        console.error("Error fetching leads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const claimLead = (id: string, status: LeadType["status"]) => {
    const updatedLeads = leads.map((lead) =>
      lead.id === id
        ? {
            ...lead,
            status,
            assignedTo: "current-user",
            updatedAt: new Date().toISOString(),
          }
        : lead
    );

    setLeads(updatedLeads);
    localStorage.setItem("biztoso_leads", JSON.stringify(updatedLeads));
  };

  const updateLead = (id: string, updatedFields: Partial<LeadType>) => {
    const updatedLeads = leads.map((lead) =>
      lead.id === id
        ? {
            ...lead,
            ...updatedFields,
            updatedAt: new Date().toISOString(),
          }
        : lead
    );

    setLeads(updatedLeads);
    localStorage.setItem("biztoso_leads", JSON.stringify(updatedLeads));
  };

  const getLeadById = (id: string) => {
    return leads.find((lead) => lead.id === id);
  };

  return (
    <LeadsContext.Provider
      value={{
        leads,
        claimLead,
        updateLead,
        getLeadById,
        loading,
      }}
    >
      {children}
    </LeadsContext.Provider>
  );
}

export function useLeads() {
  const context = useContext(LeadsContext);
  if (context === undefined) {
    throw new Error("useLeads must be used within a LeadsProvider");
  }
  return context;
}
