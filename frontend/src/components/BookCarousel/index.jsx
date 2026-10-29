"use client";

import styles from "./bookCarousel.module.css";

import { useRef } from "react";
import Link from "next/link";

import BookCard from "@/components/BookCard";

export default function BookCarousel({ title, text, books, href }) {
    const trackRef = useRef(null);

    if (!books || books.length === 0) {
        return null;
    }

    // Rola cerca de 80% da largura visível, para o leitor sempre ver um pedaço do que já passou
    function scrollTrack(direction) {
        const track = trackRef.current;

        if (!track) return;

        track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: "smooth" });
    }

    return (
        <section aria-label={title}>
            <div className="d-flex align-items-end justify-content-between gap-3 mb-3">
                <div>
                    <h2 className={styles.carousel_title}>{title}</h2>
                    {text && <p className="mb-0">{text}</p>}
                </div>
                <div className="d-flex align-items-center gap-3">
                    {href && <Link href={href} className={styles.view_all_link}>Ver todos</Link>}
                    <div className="d-none d-md-flex gap-2">
                        <button
                            type="button"
                            className={styles.arrow_button}
                            aria-label={`Voltar em ${title}`}
                            onClick={() => scrollTrack(-1)}
                        >
                            ‹
                        </button>
                        <button
                            type="button"
                            className={styles.arrow_button}
                            aria-label={`Avançar em ${title}`}
                            onClick={() => scrollTrack(1)}
                        >
                            ›
                        </button>
                    </div>
                </div>
            </div>

            <div ref={trackRef} className={styles.carousel_track}>
                {books.map((book) => (
                    <BookCard key={book.id} book={book}/>
                ))}
            </div>
        </section>
    );
}
