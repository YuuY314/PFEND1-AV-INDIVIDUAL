"use client";

import { useEffect, useMemo, useState } from "react";

import BrandBanner from "@/components/BrandBanner";
import HomeBanner from "@/components/HomeBanner";
import DiscoverBanner from "@/components/DiscoverBanner";
import BookCarousel from "@/components/BookCarousel";
import { buildHomeSections } from "@/utils/homeSections.js";

export default function Home() {
  const [ books, setBooks ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/api/livro")
      .then(res => {
        if (!res.ok) throw new Error("Não foi possível carregar os livros.");
        return res.json();
      })
      .then(data => {
        setBooks(data.dados ?? []);
        setError("");
      })
      .catch(error => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  // useMemo evita embaralhar as sugestões de novo a cada render
  const sections = useMemo(() => buildHomeSections(books), [books]);

  const showShelves = !loading && !error && books.length > 0;

  return (
    <main>
      <HomeBanner/>
      <BrandBanner/>

      <div className="container py-5 d-flex flex-column gap-5">
        {loading && (
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Carregando livros...</span>
            </div>
          </div>
        )}

        {error && <div className="alert alert-danger mb-0" role="alert">{error}</div>}

        {showShelves && (
          <>
            <BookCarousel
              title="Lançamentos"
              text="As novidades que acabaram de chegar à estante."
              books={sections.newReleases}
              href="/shelf?filter=newReleases"
            />
            <BookCarousel
              title="Sugestões para você"
              text="Uma seleção para descobrir a sua próxima leitura."
              books={sections.suggestions}
              href="/shelf"
            />
          </>
        )}
      </div>

      <DiscoverBanner
        h6="ONDE A MAGIA GANHA VIDA, EM QUALQUER MUNDO"
        h2="Mundos extraordinários esperam por você."
        p="Atravesse reinos encantados, descubra criaturas lendárias e viva aventuras que só a fantasia pode proporcionar."
        buttonText="Descubra a fantasia"
      />

      {showShelves && (
        <div className="container py-5 d-flex flex-column gap-5">
          <BookCarousel
            title="Ofertas especiais"
            text="Boas histórias por preços que cabem no bolso."
            books={sections.offers}
            href="/shelf?filter=offers"
          />
          {sections.byCategory.map((category) => (
            <BookCarousel
              key={category.name}
              title={category.name}
              text={`Leituras para quem gosta de ${category.name.toLowerCase()}.`}
              books={category.books}
              href={`/shelf?category=${encodeURIComponent(category.name)}`}
            />
          ))}
        </div>
      )}
    </main>
  );
}
