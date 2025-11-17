import { FacebookShareButton, FacebookIcon } from "react-share";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import * as React from "react";

interface FacebookShareProps {
  url?: string;
  name: string;
  dateISO: string;
  location: string;
  hashtag?: string;
  className?: string;
  buttonText?: string;
}

export default function FacebookShare({
  url,
  name,
  dateISO,
  location,
  hashtag = "#EventiCampania",
  className,
  buttonText = "Condividi su Facebook",
}: FacebookShareProps) {
  const shareUrl =
    url ||
    (typeof window !== "undefined" && window.location
      ? window.location.href
      : "");

  const quote = React.useMemo(
    () => `${name} — ${format(new Date(dateISO), "PPP 'alle' p", { locale: it })} • ${location}`,
    [name, dateISO, location]
  );

 
  const props = { url: shareUrl, hashtag, quote } as any;

  return (
    <FacebookShareButton {...props} className={className}>
      <div className="inline-flex items-center justify-center gap-2 w-full px-3 sm:px-4 py-2 bg-[#1877F2] text-white rounded-md hover:bg-[#166FE5] transition-colors text-sm sm:text-base">
        <FacebookIcon size={24} round />
        <span>{buttonText}</span>
      </div>
    </FacebookShareButton>
  );
}


