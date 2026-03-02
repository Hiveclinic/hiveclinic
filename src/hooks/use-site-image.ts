import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const imageCache: Record<string, string> = {};

export const useSiteImage = (key: string, fallback: string): string => {
  const [url, setUrl] = useState(imageCache[key] || fallback);

  useEffect(() => {
    if (imageCache[key]) {
      setUrl(imageCache[key]);
      return;
    }
    supabase
      .from("site_images")
      .select("image_url")
      .eq("key", key)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.image_url) {
          imageCache[key] = data.image_url;
          setUrl(data.image_url);
        }
      });
  }, [key]);

  return url;
};
