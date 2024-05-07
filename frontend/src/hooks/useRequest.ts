import axios from "axios";
import { useState, useEffect } from "react";

const useRequest = (url: string, method: string, payload: undefined) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios({
          method: method,
          url: url,
          data: payload,
        });
        const json = await response.data();
        setLoading(false);
        setData(json);
        setError(null);
      } catch (error) {
        console.error(error);
        setError(`${error}`);
        setLoading(false);
      }
    };

    fetchData();
  }, [url, method, payload]);

  return { data, loading, error };
};

export default useRequest;
