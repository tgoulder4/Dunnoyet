import { Loader2 } from "lucide-react";
import { useState } from "react";
function Source() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="grid place-items-center gap-4 py-4 h-96 w-full bg-background rounded-lg">
      {loading ? (
        <Loader2 className="w-8 h-8 animate-spin" color="#cdcdcd" />
      ) : (
        <></>
      )}
    </div>
  );
}

export default Source;
