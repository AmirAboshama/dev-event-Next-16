import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <header>
      <nav>

        <Link href="/" className="logo"  >
        <Image  src="/icons/logo.png" alt="logo" width={24} height={24}/>
       <p> DevEvent</p>
       
        </Link>
        <ul>
            <Link href="/">home</Link>
            <Link href="/">events</Link>
            <Link href="/">create event</Link>
        </ul>
      </nav>
    </header>
  )
}

export default Navbar
