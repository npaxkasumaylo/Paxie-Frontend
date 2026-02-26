import { CircleX, FileText, LoaderCircle } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { api } from "../../api/api";

export default function ProductsandServicesList({
  handleDownload,
  handleDelete,
  deleting,
  currentId,
  docTypeArr = [],
  formatDate,
  documents = [],
  networkError,
  tagMap = {},
  notify,
}) {
  const [selectedTagId, setSelectedTagId] = useState("");
  const [search, setSearch] = useState("");
  const [documentTags, setDocumentTags] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;

  // ✅ NEW: server search result + loading
  const [searchedDocs, setSearchedDocs] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    getDocumentTags();
  }, []);

  const getDocumentTags = async () => {
    try {
      const res = await api.getDocumentTags(true);
      setDocumentTags(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      notify?.("Failed to load document tags.", "error");
      setDocumentTags([]);
    }
  };

  // ✅ NEW: call endpoint when searching
  useEffect(() => {
    const q = search.trim().toLowerCase();

    if (!q) {
      setSearchedDocs([]);
      setSearchLoading(false);
      return;
    }

    const t = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const res = await api.searchDocument(true, q.toLowerCase());
        setSearchedDocs(Array.isArray(res?.data) ? res.data : []);
      } catch (e) {
        console.error(e);
        setSearchedDocs([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [search]);

  // ✅ Use server results only when searching
  const displayDocuments = useMemo(() => {
  return search.trim()
    ? searchedDocs
    : (Array.isArray(documents) ? documents : []);
}, [search, searchedDocs, documents]);

  // ✅ keep your filters + pagination (same logic)
  const filteredDocuments = useMemo(() => {
    const q = search.trim().toLowerCase();

    return displayDocuments.filter((d) => {
      const tagMatch =
        !selectedTagId || String(d.documentTagsId) === String(selectedTagId);

      // OPTIONAL: keep local includes (you can remove if you want pure server search)
      const fileName = String(d.fileName ?? "").toLowerCase();
      const tagText = String(tagMap[String(d.documentTagsId)] ?? "").toLowerCase();
      const searchMatch = !q || fileName.includes(q) || tagText.includes(q);

      return tagMatch && searchMatch;
    });
  }, [displayDocuments, selectedTagId, search, tagMap]);

  useEffect(() => {
  setPageNumber(1);
}, [selectedTagId, search, searchedDocs, documents]);

  const totalPages = Math.max(1, Math.ceil(filteredDocuments.length / pageSize));

  const pagedDocuments = useMemo(() => {
    const start = (pageNumber - 1) * pageSize;
    return filteredDocuments.slice(start, start + pageSize);
  }, [filteredDocuments, pageNumber, pageSize]);

  useEffect(() => {
    if (pageNumber > totalPages) setPageNumber(totalPages);
  }, [totalPages, pageNumber]);

  return (
    <>
      <div className="md:w-1/8 lg:1/3 w-full p-8 bg-[#00092d] backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl overflow-y-auto">
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-b-white/50">
          <h1 className="text-2xl font-bold text-white">Products and Services List</h1>

          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg pl-3 pr-9 py-1.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/80"
              placeholder="Search documents..."
            />
            {searchLoading && (
              <LoaderCircle className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-white/80 animate-spin" />
            )}
          </div>

          <select
            value={selectedTagId}
            onChange={(e) => setSelectedTagId(e.target.value)}
            className="text-gray-700 font-semibold px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-white"
          >
            <option value="">All</option>
            {documentTags.map((t) => (
              <option key={t.id} value={t.id}>
                {t.tagName}
              </option>
            ))}
          </select>
        </div>

        <div>
          {pagedDocuments.length > 0 ? (
            pagedDocuments.map((item) => (
              <div key={item.documentId} className="relative group mt-2.5">
                <div className="flex p-2 bg-white/10 rounded-lg border border-white/10 hover:bg-white/20 transition-all duration-200">
                  <button onClick={() => handleDownload(item)} className="flex flex-1 items-center">
                    <FileText className="mr-2 text-white/90" />
                    <p className="text-white/90 truncate">{item.fileName}</p>
                  </button>

                  <button onClick={handleDelete(item.documentId)} disabled={deleting}>
                    {deleting && currentId === item.documentId ? (
                      <LoaderCircle className="text-white/90 animate-spin" />
                    ) : (
                      <CircleX size={20} className="text-white/90" />
                    )}
                  </button>
                </div>

                <div className="absolute right-0 left-0 top-full p-2 mt-1 bg-white/10 rounded-b-lg border border-t-0 border-white/10 shadow-xl overflow-hidden max-h-0 opacity-0 pointer-events-none group-hover:static group-hover:max-h-60 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 ease-out">
                  <p className="text-white/90 truncate text-sm">
                    <b>File Format:</b> {docTypeArr[item.documentType]}
                  </p>
                  <p className="text-white/90 truncate text-sm">
                    <b>File Information:</b>{documentTags.find(t => Number(t.id) === Number(item.documentTagsId))?.tagName ?? "Unknown"}
                  </p>
                  <p className="text-white/90 truncate text-sm">
                    <b>Date Uploaded:</b> {formatDate(item.uploaded)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white/90 mt-4 text-center">
              {networkError ? networkError : "No documents uploaded yet."}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between px-2 py-4 border-t border-white/10">
          <button
            className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-white/90 disabled:opacity-40"
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>

          <p className="text-sm text-white/70">
            Page {pageNumber} of {totalPages}
          </p>

          <button
            className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-white/90 disabled:opacity-40"
            disabled={pageNumber >= totalPages}
            onClick={() => setPageNumber((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}