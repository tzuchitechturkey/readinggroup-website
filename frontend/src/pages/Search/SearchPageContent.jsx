import { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

// import { GetSearchResult } from "@/api/search/GetSearchResult";
import { setErrorFn } from "@/Utility/Global/setErrorFn";

function SearchPageContent() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("q");
  const [dataResult, setDataResult] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await GetSearchResult(query);
      setDataResult(response.data?.results || []);
      setTotalRecords(response.data?.count || 0);
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // getData();
  }, [query]);

  return (
    <div className="max-w-5xl mx-auto  px-4 py-8">
      <h2>نتائج البحث: {query}</h2>
    </div>
  );
}

export default SearchPageContent;
