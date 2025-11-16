import { Heart } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="bg-accent w-full gap-1 p-3 text-center md:p-5">
      <p className="text-xs font-medium">
        © {new Date().getFullYear()} Copyright BOOKINGMENU
      </p>
      <p className="text-muted-foreground text-xs font-bold">
        Feito por{" "}
        <Link
          href="https://www.linkedin.com/in/enderson-millan"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground underline transition-colors"
        >
          Enderson Millan
        </Link>{" "}
        com muito <Heart className="inline h-4 w-4 fill-red-500 text-red-500" />{" "}
        para Cravil.
      </p>
    </div>
  );
};

export default Footer;
