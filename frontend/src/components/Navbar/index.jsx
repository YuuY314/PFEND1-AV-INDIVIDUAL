import styles from "./navbar.module.css";

const categoryLink = (name) => `/shelf?category=${encodeURIComponent(name)}`;

const links = [
    { name: "Todos os Livros", href: "/shelf" },
    { name: "Lançamentos", href: "/shelf?filter=newReleases" },
    { name: "Ofertas especiais", href: "/shelf?filter=offers" },
    { name: "Literatura brasileira", href: categoryLink("Literatura brasileira") },
    { name: "Fantasia", href: categoryLink("Fantasia") },
    { name: "Romance", href: categoryLink("Romance") },
    { name: "Clássicos", href: categoryLink("Clássicos") },
    { name: "Infantojuvenil", href: categoryLink("Infantojuvenil") },
];

export default function Navbar(){
    return (
        <nav className={`d-flex align-items-center justify-content-start justify-content-lg-evenly overflow-x-auto ${styles.navbar}`}>
            {
                links.map((link) => (
                    <a key={link.name} href={link.href} className="px-3 text-nowrap">{link.name}</a>
                ))
            }
        </nav>
    )
}