"use client";
import React, { useCallback, useMemo, useState } from "react";
import Loader from "@/components/loader";
import { useLeads } from "@/contexts/lead-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeadsList from "./_component/lead-list";
import { LeadType } from "@/lib/types";
import SearchBar from "../marketplace/_components/search-bar";
import { Search } from "lucide-react";
const page = () => {
  const { leads, claimLead, loading } = useLeads();
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState<string>("all");

  const industries = useMemo(() => {
    const uniqueIndustries = new Set(leads.map((lead) => lead.industry));
    return ["all", ...Array.from(uniqueIndustries)];
  }, [leads]);

  const filteredLeads = useMemo(() => {
    let filtered = leads;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (lead) =>
          lead.businessName.toLowerCase().includes(term) ||
          lead.contactName.toLowerCase().includes(term) ||
          lead.email.toLowerCase().includes(term) ||
          (lead.notes && lead.notes.toLowerCase().includes(term))
      );
    }

    if (industryFilter !== "all") {
      filtered = filtered.filter((lead) => lead.industry === industryFilter);
    }

    return filtered;
  }, [leads, searchTerm, industryFilter]);

  const leadsByStatus = useMemo(() => {
    const grouped = {
      new: filteredLeads.filter((lead) => lead.status === "new"),
      contacted: filteredLeads.filter((lead) => lead.status === "contacted"),
      qualified: filteredLeads.filter((lead) => lead.status === "qualified"),
      proposal: filteredLeads.filter((lead) => lead.status === "proposal"),
      closed: filteredLeads.filter((lead) => lead.status === "closed"),
      lost: filteredLeads.filter((lead) => lead.status === "lost"),
    };

    return grouped;
  }, [filteredLeads]);

  const handleClaimLead = useCallback(
    (id: string, status: LeadType["status"]) => {
      claimLead(id, status);
    },
    [claimLead]
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <main className="container mx-auto p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold">Lead Generation</h1>
          <p className="text-2xl text-gray-500">
            {" "}
            Find and manage potential business leads
          </p>
        </div>
      </div>
      <section className="mt-5">
        <div className="my-5">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Search leads"
          />
        </div>
        <Tabs defaultValue="new">
          <TabsList className="mb-4 py-6">
            <TabsTrigger value="new" className="text-lg px-3">
              New ({leadsByStatus.new.length})
            </TabsTrigger>
            <TabsTrigger value="contacted" className="text-lg px-3">
              Contacted ({leadsByStatus.contacted.length})
            </TabsTrigger>
            <TabsTrigger value="qualified" className="text-lg px-3">
              Qualified ({leadsByStatus.qualified.length})
            </TabsTrigger>
            <TabsTrigger value="all" className="text-lg px-3">
              All Leads ({filteredLeads.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new">
            <LeadsList
              leads={leadsByStatus.new}
              onClaimLead={handleClaimLead}
            />
          </TabsContent>

          <TabsContent value="contacted">
            <LeadsList
              leads={leadsByStatus.contacted}
              onClaimLead={handleClaimLead}
            />
          </TabsContent>

          <TabsContent value="qualified">
            <LeadsList
              leads={leadsByStatus.qualified}
              onClaimLead={handleClaimLead}
            />
          </TabsContent>

          <TabsContent value="all">
            <LeadsList leads={filteredLeads} onClaimLead={handleClaimLead} />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
};

export default page;
