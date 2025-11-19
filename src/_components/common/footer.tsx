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
          href="https://portfolio-ecmm.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground cursor:pointer underline transition-colors"
        >
          Eng.
        </Link>{" "}
        <Link
          href="https://github.com/ENDERSON-MARIN"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground cursor:pointer underline transition-colors"
        >
          Enderson
        </Link>{" "}
        <Link
          href="https://www.linkedin.com/in/enderson-millan"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground cursor:pointer underline transition-colors"
        >
          Millán
        </Link>{" "}
        com muito <Heart className="inline h-4 w-4 fill-red-500 text-red-500" />{" "}
        para{" "}
        <Link
          href="https://www.cravil.com.br/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground cursor:pointer underline transition-colors"
        >
          Cravil
        </Link>
      </p>
    </div>
  );
};

export default Footer;
