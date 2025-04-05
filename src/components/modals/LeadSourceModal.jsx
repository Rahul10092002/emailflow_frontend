import { useState, useEffect } from "react";
import { X, Search, Check } from "lucide-react";
import { useEmail } from "../../context/EmailContext";

const mockCompanies = [
  {
    id: 1,
    name: "Acme Inc",
    domain: "acme.com",
    industry: "Technology",
    email: "rahulpatidar1009@gmail.com",
  },
  {
    id: 2,
    name: "Globex Corporation",
    domain: "globex.com",
    industry: "Manufacturing",
    email: "info@globex.com",
  },
  {
    id: 3,
    name: "Initech",
    domain: "initech.com",
    industry: "Technology",
    email: "support@initech.com",
  },
  {
    id: 4,
    name: "Umbrella Corp",
    domain: "umbrella.org",
    industry: "Pharmaceuticals",
    email: "research@umbrella.org",
  },
  {
    id: 5,
    name: "Stark Industries",
    domain: "starkindustries.com",
    industry: "Defense",
    email: "contact@starkindustries.com",
  },
  {
    id: 6,
    name: "Wayne Enterprises",
    domain: "waynecorp.com",
    industry: "Finance",
    email: "invest@waynecorp.com",
  },
  {
    id: 7,
    name: "Dunder Mifflin",
    domain: "dundermifflin.com",
    industry: "Paper",
    email: "sales@dundermifflin.com",
  },
  {
    id: 8,
    name: "Soylent Corp",
    domain: "soylentcorp.com",
    industry: "Food Production",
    email: "hello@soylentcorp.com",
  },
  {
    id: 9,
    name: "Tyrell Corporation",
    domain: "tyrell.com",
    industry: "Biotech",
    email: "replicants@tyrell.com",
  },
  {
    id: 10,
    name: "Hooli",
    domain: "hooli.xyz",
    industry: "Tech",
    email: "admin@hooli.xyz",
  },
];

const LeadSourceModal = ({ isOpen, onClose, onSave, selectedLead = null }) => {
  const { setRecipientFromLead } = useEmail(); // Use the context function
  const [searchTerm, setSearchTerm] = useState("");
  const [companies, setCompanies] = useState(mockCompanies);
  const [selected, setSelected] = useState(selectedLead);

  useEffect(() => {
    // Filter companies based on search term
    if (searchTerm) {
      const filtered = mockCompanies.filter(
        (company) =>
          company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.industry.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setCompanies(filtered);
    } else {
      setCompanies(mockCompanies);
    }
  }, [searchTerm]);

  useEffect(() => {
    // Initialize selected company from props
    setSelected(selectedLead);
  }, [selectedLead]);

  const handleSelect = (companyId) => {
    const selectedCompany = companies.find(
      (company) => company.id === companyId
    );
    setSelected(companyId); // Set the selected company
    setRecipientFromLead(selectedCompany); // Set the recipient email
  };

  const handleSave = () => {
    const selectedCompany = mockCompanies.find(
      (company) => company.id === selected
    );
    onSave(selectedCompany);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Select Lead Source
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 flex items-center rounded-md border border-gray-300 px-3 py-2">
          <Search className="mr-2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search companies by name, domain, or industry..."
            className="w-full border-0 p-0 text-sm focus:outline-none focus:ring-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="max-h-60 overflow-y-auto">
          {companies.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {companies.map((company) => (
                <li key={company.id} className="flex items-center py-2">
                  <input
                    type="radio"
                    id={`company-${company.id}`}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    checked={selected === company.id}
                    onChange={() => handleSelect(company.id)}
                  />
                  <label
                    htmlFor={`company-${company.id}`}
                    className="ml-2 flex flex-1 cursor-pointer items-center justify-between"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {company.name}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-4 text-center text-sm text-gray-500">
              No companies found matching your search.
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end space-x-2 border-t border-gray-200 pt-4">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            disabled={!selected}
          >
            <Check className="mr-1.5 h-4 w-4" />
            Save Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadSourceModal;
